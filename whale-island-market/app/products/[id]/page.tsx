import { notFound, redirect } from 'next/navigation';
import db from '../../../lib/db';
import getSession from '../../../lib/session';
import Link from 'next/link';
import { formatToWon } from '../../../lib/utils';
import { UserIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { unstable_cache as nextCache } from 'next/cache';

async function getIsOwner(userId: number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}

async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avatar: true,
        },
      },
    },
  });
  return product;
}

const getCachedProduct = nextCache(
  getProduct,
  ['product-detail'],
  { tags: ['product-detail'] },
);

async function getProductTitle(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    select: {
      title: true,
    },
  });
  return product;
}

const getCachedProductTitle = nextCache(
  getProductTitle,
  ['product-title'],
  { tags: ['product-title'] },
);

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}) {
  const product = await getCachedProductTitle(
    Number(params.id),
  );
  return {
    title: product?.title,
  };
}

export default async function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();

  const product = await getCachedProduct(id);
  if (!product) return notFound();

  const isOwner = await getIsOwner(product.userId);

  const handleDelete = async () => {
    'use server';
    await db.product.delete({
      where: {
        id,
      },
    });
    redirect('/home');
  };

  return (
    <div>
      <div className="relative aspect-square">
        <Image
          fill
          src={product.photo}
          alt={product.title}
          className="object-cover"
        />
      </div>
      <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
        <div className="size-10 overflow-hidden rounded-full">
          {product.user.avatar !== null ? (
            <Image
              src={product.user.avatar}
              width={40}
              height={40}
              alt={product.user.username}
            />
          ) : (
            <UserIcon />
          )}
        </div>
        <div>
          <h3>{product.user.username}</h3>
        </div>
      </div>
      <div className="p-5 pb-36">
        <h1 className="text-2xl font-semibold">
          {product.title}
        </h1>
        <p>{product.description}</p>
      </div>
      <div className="fixed w-full bottom-0 left-0 p-5 pb-8 bg-neutral-400 bg-opacity-50 backdrop-blur-md flex justify-between items-center">
        <span className="font-semibold text-xl">
          {formatToWon(product.price)}원
        </span>
        {isOwner ? (
          <div className="flex gap-2">
            <form action={handleDelete}>
              <button
                className="bg-red-500 px-5 py-2 rounded-md
               text-white font-semibold hover:bg-red-600 transition-all"
              >
                판매 내리기
              </button>
            </form>
            <Link href={`/products/edit/${product.id}`}>
              <button
                className="bg-sky-500 px-5 py-2 rounded-md
               text-white font-semibold hover:bg-sky-600 transition-all"
              >
                수정하기
              </button>
            </Link>
          </div>
        ) : (
          <Link
            className="bg-green-600 px-5 py-2 rounded-md text-white font-semibold"
            href={``}
          >
            채팅하기
          </Link>
        )}
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const products = await db.product.findMany({
    select: {
      id: true,
    },
  });
  return products.map((product) => ({
    id: product.id + '',
  }));
}


import { Prisma } from '@prisma/client';
import ListProduct from '../../../components/list-product';
import ProductList from '../../../components/product-list';
import db from '../../../lib/db';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/16/solid';
import { unstable_cache as nextCache } from 'next/cache';

const getCachedProducts = nextCache(
  getInitialProducts,
  ['home-products'],
  { revalidate: 60 },
);

async function getInitialProducts() {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    take: 10,
    orderBy: {
      created_at: 'desc',
    },
  });
  return products;
}

export type InitialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;

export default async function Products() {
  const initialProducts = await getCachedProducts();
  return (
    <div>
      <Link
        href="/products/add"
        className="bg-green-800 flex items-center justify-center
      rounded-full size-12 fixed z-10 bottom-24 right-6 text-white
       transition-colors hover:bg-green-700"
      >
        <PlusIcon className="size-10" />
      </Link>
      <ProductList initialProducts={initialProducts} />
    </div>
  );
}


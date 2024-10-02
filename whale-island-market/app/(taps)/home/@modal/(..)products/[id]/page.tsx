import CloseBtn from '@/components/close-btn';
import db from '@/lib/db';
import { formatToWon } from '@/lib/utils';
import { UserIcon } from '@heroicons/react/16/solid';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
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

export default async function Modal({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  const product = await getProduct(id);
  if (!product) {
    return notFound();
  }
  return (
    <Link
      href={`/products/${id}`}
      className="max-w-screen-sm w-full h-1/2 flex justify-center items-center
    cursor-pointer"
    >
      <div className="fixed bottom-14 max-w-screen-sm bg-white rounded-lg shadow-lg w-full h-auto p-6 pb-10">
        <CloseBtn />
        <h2 className="text-xl font-bold text-neutral-800 mb-4 border-b pb-2">
          상품 더보기
        </h2>
        <div className="flex flex-row gap-4">
          <div className="w-1/2 aspect-square md:h-80 relative rounded-lg overflow-hidden bg-gray-100">
            <Image
              fill
              src={product.photo}
              alt={product.title}
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-between">
            <div className="flex flex-col gap-2 mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {product.title}
              </h2>
              <p className="text-sm font-medium text-gray-700">
                {formatToWon(product.price)}원
              </p>
              <p className="text-neutral-500">
                {product.description}
              </p>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <div
                className="w-9 h-9 relative rounded-full overflow-hidden bg-gray-200
              text-neutral-600"
              >
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
              <h3 className="text-lg font-medium text-gray-800">
                {product.user.username}
              </h3>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}


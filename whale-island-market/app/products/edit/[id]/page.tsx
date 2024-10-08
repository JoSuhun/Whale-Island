import { notFound } from 'next/navigation';
import { getProduct } from './actions';
import { Prisma } from '@prisma/client';
import EditProductForm from './edit-form';

export type Product = Prisma.PromiseReturnType<
  typeof getProduct
>;

export default async function EditProduct({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();
  const product = await getProduct(Number(params.id));
  if (!product) return notFound();

  return (
    <div className="max-w-screen-sm ">
      <EditProductForm product={product} />
    </div>
  );
}


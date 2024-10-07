import { notFound } from 'next/navigation';
import db from '../../../../lib/db';
import Input from '../../../../components/input';
import Button from '../../../../components/btn';

async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
  });
  return product;
}

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
    <div className="max-w-screen-sm flex flex-col gap-5 p-5">
      <label
        htmlFor="photo"
        className="border-2 aspect-square flex flex-col items-center justify-center
          border-neutral-500 border-dashed rounded-md cursor-pointer bg-cover bg-center"
        style={{
          backgroundImage: `url(${product.photo})`,
        }}
      ></label>
      <input
        // onChange={onImageChange}
        type="file"
        id="photo"
        name="photo"
        className="hidden"
      />
      <Input
        name="title"
        required
        placeholder="제목"
        type="text"
        defaultValue={product.title}
        //   errors={state?.fieldErrors.title}
      />
      <Input
        name="price"
        required
        placeholder="가격"
        type="number"
        defaultValue={product.price}
        //   errors={state?.fieldErrors.price}
      />
      <Input
        name="description"
        required
        placeholder="설명"
        type="text"
        defaultValue={product.description}
        //   errors={state?.fieldErrors.description}
      />
      <Button text="수정 완료" />
    </div>
  );
}


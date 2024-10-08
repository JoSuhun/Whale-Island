'use client';
import { useState } from 'react';
import { useFormState } from 'react-dom';
import { editProduct } from './actions';
import { Product } from './page';
import { notFound } from 'next/navigation';
import Input from '../../../../components/input';
import Button from '../../../../components/btn';

export default function EditProductForm({
  product,
}: {
  product: Product;
}) {
  const [preview, setPreview] = useState(product?.photo);
  const onImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const {
      target: { files },
    } = event;
    if (!files) return;
    const file = files[0];
    const url = URL.createObjectURL(file);
    setPreview(url);
  };
  const [state, action] = useFormState(editProduct, null);

  return (
    <form
      action={action}
      className="flex flex-col gap-5 p-5"
    >
      <label
        htmlFor="photo"
        className="border-2 aspect-square flex flex-col items-center justify-center
          border-neutral-500 border-dashed rounded-md cursor-pointer bg-cover bg-center"
        style={{
          backgroundImage: `url(${preview})`,
        }}
      ></label>
      <input
        onChange={onImageChange}
        type="file"
        id="photo"
        name="photo"
        className="hidden"
      />
      <input
        type="number"
        id="id"
        name="id"
        defaultValue={product?.id}
        className="hidden"
      />
      <Input
        name="title"
        required
        placeholder="제목"
        type="text"
        defaultValue={product?.title}
        errors={state?.fieldErrors.title}
      />
      <Input
        name="price"
        required
        placeholder="가격"
        type="number"
        defaultValue={product?.price}
        errors={state?.fieldErrors.price}
      />
      <Input
        name="description"
        required
        placeholder="설명"
        type="text"
        defaultValue={product?.description}
        errors={state?.fieldErrors.description}
      />
      <Button text="수정 완료" />
    </form>
  );
}


'use client';
import Input from '../../../components/input';
import Button from '../../../components/btn';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

export default function AddProduct() {
  const [preview, setPreview] = useState('');
  const onImageChange = () => {};
  return (
    <div>
      <form action="" className="flex flex-col gap-5 p-5">
        <label
          htmlFor="photo"
          className="border-2 aspect-square flex flex-col items-center justify-center
          border-neutral-500 border-dashed rounded-md cursor-pointer"
        >
          <PhotoIcon className="w-20" />
          <div className="text-neutral-800 text-sm">
            사진을 추가해주세요.
          </div>
        </label>
        <input
          onChange={onImageChange}
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
        />
        <Input
          name="price"
          required
          placeholder="가격"
          type="number"
        />
        <Input
          name="description"
          required
          placeholder="설명"
          type="text"
        />
        <Button text="작성 완료" />
      </form>
    </div>
  );
}


'use server';

import { z } from 'zod';
import fs from 'fs/promises';
import db from '../../../../lib/db';
import getSession from '../../../../lib/session';
import { redirect } from 'next/navigation';
import { revalidateTag } from 'next/cache';

const productSchema = z.object({
  id: z.coerce.number(),
  photo: z.string({
    required_error: '사진을 첨부해주세요!',
  }),
  title: z.string(),
  description: z.string(),
  price: z.coerce.number(),
});

export async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
  });
  return product;
}

export async function editProduct(
  _: any,
  formData: FormData,
) {
  const data = {
    id: formData.get('id'),
    photo: formData.get('photo'),
    title: formData.get('title'),
    price: formData.get('price'),
    description: formData.get('description'),
  };
  const product = await getProduct(
    Number(formData.get('id')),
  );

  if (data.photo instanceof File) {
    if (data.photo.name !== 'undefined') {
      const photoData = await data.photo.arrayBuffer();
      await fs.appendFile(
        `./public/${data.photo.name}`,
        Buffer.from(photoData),
      );
      data.photo = `/${data.photo.name}`;
    } else {
      data.photo = `${product?.photo}`;
    }
  }
  const result = productSchema.safeParse(data);
  console.log(result.error);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const product = await db.product.update({
        where: {
          id: result.data.id,
        },
        data: {
          title: result.data.title,
          description: result.data.description,
          price: result.data.price,
          photo: result.data.photo,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
        select: {
          id: true,
        },
      });
      revalidateTag('product-detail');
      redirect(`/products/${product.id}`);
    }
  }
}


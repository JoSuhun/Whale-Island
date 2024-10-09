'use server';
import { revalidateTag } from 'next/cache';
import getSession from '../../../lib/session';
import db from '../../../lib/db';
import { z } from 'zod';
import { redirect } from 'next/navigation';

const commentSchema = z.object({
  payload: z.string().max(25),
  postId: z.string(),
});

export const likePost = async (postId: number) => {
  const session = await getSession();
  try {
    await db.like.create({
      data: {
        postId,
        userId: session.id!,
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (e) {
    return;
  }
};

export const dislikePost = async (postId: number) => {
  const session = await getSession();
  try {
    await db.like.delete({
      where: {
        id: {
          postId,
          userId: session.id!,
        },
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (e) {
    return;
  }
};

export const uploadComment = async (
  _: any,
  formData: FormData,
) => {
  const data = {
    payload: formData.get('payload'),
    postId: formData.get('postId'),
  };

  const result = commentSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    await db.comment.create({
      data: {
        payload: result.data.payload,
        post: {
          connect: {
            id: Number(result.data.postId),
          },
        },
        user: {
          connect: {
            id: session.id,
          },
        },
      },
    });
    revalidateTag('post-comments');
  }
};

export const deleteComment = async (id: number) => {
  try {
    await db.comment.delete({
      where: {
        id,
      },
    });
    revalidateTag('post-comments');
  } catch (e) {
    return;
  }
};


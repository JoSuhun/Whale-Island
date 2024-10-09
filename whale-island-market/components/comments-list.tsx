'use client';
import Image from 'next/image';
import { CommentsType } from '../app/posts/[id]/page';
import { formatDate } from '../lib/utils';
import { UserIcon } from '@heroicons/react/16/solid';
import { useOptimistic, useRef } from 'react';
import getSession from '../lib/session';
import { useFormState } from 'react-dom';
import { uploadComment } from '../app/posts/[id]/actions';

interface CommentsProps {
  payload: string;
  id: number;
  created_at: Date;
  userId: number;
  user: {
    username: string;
    avatar: string | null;
  };
}

export default function CommentsList({
  comments,
  postId,
}: {
  comments: CommentsProps[];
  postId: number;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const [optimisticState, reducerFn] = useOptimistic(
    comments,
    (previousComments, newComment: CommentsProps) => [
      ...previousComments,
      newComment,
    ],
  );

  const optimisticUpload = async (
    _: any,
    formData: FormData,
  ) => {
    const newComment = {
      payload: formData.get('comment')?.toString()!,
      id: 0,
      created_at: new Date(),
      userId: 0,
      user: {
        username: '..',
        avatar: null,
      },
    };

    reducerFn(newComment);
    formData.append('postId', postId + '');
    await uploadComment(_, formData);
    formRef.current?.reset();
  };

  const [state, action] = useFormState(
    optimisticUpload,
    null,
  );

  return (
    <div>
      <form ref={formRef} action={action}>
        <input
          id="payload"
          name="payload"
          type="text"
          className="bg-transparent rounded-md w-full focus:outline-none
             ring-[1.5px] ring-inset ring-neutral-300
              focus:ring-[1.5px] focus:ring-inset focus:ring-neutral-400 border-none 
             placeholder:text-neutral-400 mt-3 text-sm"
        />
      </form>
      <div
        className="bg-neutral-200 flex flex-col gap-3 p-2 mt-2
     border-t-[1px] rounded-md text-sm"
      >
        {optimisticState.map((comment, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div
                className="size-7 overflow-hidden rounded-full
          p-[2px] bg-neutral-100 text-neutral-500"
              >
                {comment.user.avatar !== null ? (
                  <Image
                    width={28}
                    height={28}
                    className="size-7 rounded-full"
                    src={comment.user.avatar!}
                    alt={comment.user.username}
                  />
                ) : (
                  <UserIcon />
                )}
              </div>
              <div className="font-semibold border-r-[1px] pr-2 border-neutral-400">
                {comment.user.username}
              </div>
              <div>{comment.payload}</div>
            </div>

            <div className="text-xs text-neutral-500">
              {formatDate(comment.created_at as Date)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


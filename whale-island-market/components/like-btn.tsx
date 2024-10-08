'use client';
import { HandThumbUpIcon } from '@heroicons/react/24/solid';
import { HandThumbUpIcon as OutlineHandThumbUpIcon } from '@heroicons/react/24/outline';
import { useOptimistic } from 'react';
import {
  dislikePost,
  likePost,
} from '../app/posts/[id]/actions';

interface LikeBtnProps {
  isLiked: boolean;
  likeCount: number;
  postId: number;
}

export default function LikeBtn({
  isLiked,
  likeCount,
  postId,
}: LikeBtnProps) {
  const [state, reducerFn] = useOptimistic(
    { isLiked, likeCount },
    (prev, payload) => {
      return {
        isLiked: !prev.isLiked,
        likeCount: prev.isLiked
          ? prev.likeCount - 1
          : prev.likeCount + 1,
      };
    },
  );
  const onClick = async () => {
    reducerFn(undefined);
    if (isLiked) await dislikePost(postId);
    else await likePost(postId);
  };
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 text-sm border
         border-neutral-400 rounded-full p-2
         ${
           state.isLiked
             ? 'bg-neutral-300 hover:bg-neutral-200'
             : 'hover:bg-neutral-200'
         }
           transition-colors`}
    >
      {state.isLiked ? (
        <HandThumbUpIcon className="size-5" />
      ) : (
        <OutlineHandThumbUpIcon className="size-5" />
      )}
      {state.isLiked ? (
        <span>{state.likeCount}</span>
      ) : (
        <span>공감하기 ({state.likeCount})</span>
      )}
    </button>
  );
}


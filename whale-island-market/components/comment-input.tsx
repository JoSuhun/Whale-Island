import { useOptimistic } from 'react';
import { uploadComment } from '../app/posts/[id]/actions';

export default async function CommentInput({
  postId,
}: {
  postId: number;
}) {
  return (
    <form>
      <input
        type="text"
        className="bg-transparent rounded-md w-full focus:outline-none
             ring-[1.5px] ring-inset ring-neutral-300
              focus:ring-[1.5px] focus:ring-inset focus:ring-neutral-400 border-none 
             placeholder:text-neutral-400 mt-3 text-sm"
      />
    </form>
  );
}


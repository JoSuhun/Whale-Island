import Image from 'next/image';
import { CommentsType } from '../app/posts/[id]/page';
import { formatDate } from '../lib/utils';
import { UserIcon } from '@heroicons/react/16/solid';

interface CommentsListProps {
  comments: CommentsType;
}

export default async function CommentsList({
  comments,
}: CommentsListProps) {
  return (
    <div
      className="bg-neutral-200 flex flex-col gap-3 p-2 mt-3
     border-t-[1px] rounded-md text-sm"
    >
      {comments.map((comment, idx) => (
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
            {formatDate(comment.created_at)}
          </div>
        </div>
      ))}
    </div>
  );
}


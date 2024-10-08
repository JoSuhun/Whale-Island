import { notFound } from 'next/navigation';
import db from '../../../lib/db';
import Image from 'next/image';
import { formatToTimeAgo } from '../../../lib/utils';
import {
  EyeIcon,
  UserIcon,
} from '@heroicons/react/24/solid';
import getSession from '../../../lib/session';
import { unstable_cache } from 'next/cache';
import LikeBtn from '../../../components/like-btn';
import { Prisma } from '@prisma/client';
import CommentsList from '../../../components/comments-list';

async function getPost(id: number) {
  try {
    const post = await db.post.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    return post;
  } catch (e) {
    return null;
  }
}

const cachedPost = unstable_cache(
  getPost,
  ['post-detail'],
  { tags: ['post-detail'], revalidate: 60 },
);

async function getLikeStatus(
  postId: number,
  userId: number,
) {
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        postId,
        userId: userId!,
      },
    },
  });
  const likeCount = await db.like.count({
    where: {
      postId,
    },
  });
  return { likeCount, isLiked: Boolean(isLiked) };
}

async function cachedLikeStatus(
  postId: number,
  userId: number,
) {
  const cachedOperation = unstable_cache(
    (postId) => getLikeStatus(postId, userId),
    ['post-like-status'],
    { tags: [`like-status-${postId}`] },
  );
  return cachedOperation(postId);
}

async function getComments(postId: number) {
  const comments = await db.comment.findMany({
    where: {
      postId,
    },
    select: {
      id: true,
      payload: true,
      userId: true,
      created_at: true,
      user: {
        select: {
          avatar: true,
          username: true,
        },
      },
    },
  });
  return comments;
}

const cachedComments = unstable_cache(
  getComments,
  ['post-comments'],
  {
    tags: ['post-comments'],
  },
);

export type CommentsType = Prisma.PromiseReturnType<
  typeof getComments
>;

export default async function PostDetail({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();
  const session = await getSession();
  const post = await cachedPost(id);
  if (!post) return notFound();

  if (!session.id) return;
  const { likeCount, isLiked } = await cachedLikeStatus(
    id,
    session.id,
  );
  const comments = await cachedComments(id);

  return (
    <div className="p-5 text-neutral-700">
      <div className="flex items-center gap-2 mb-2">
        <div className="size-10 overflow-hidden rounded-full">
          {post.user.avatar !== null ? (
            <Image
              width={28}
              height={28}
              className="size-7 rounded-full"
              src={post.user.avatar!}
              alt={post.user.username}
            />
          ) : (
            <UserIcon />
          )}
        </div>

        <div>
          <span className="text-sm font-semibold">
            {post.user.username}
          </span>
          <div className="text-xs">
            <span>
              {formatToTimeAgo(post.created_at.toString())}
            </span>
          </div>
        </div>
      </div>
      <h2 className="text-lg font-semibold">
        {post.title}
      </h2>
      <p className="mb-5">{post.description}</p>
      <div className="flex flex-col gap-5 items-start">
        <div className="flex items-center gap-2 text-neutral-600 text-sm">
          <EyeIcon className="size-5" />
          <span>조회 {post.views}</span>
        </div>
        <LikeBtn
          isLiked={isLiked}
          likeCount={likeCount}
          postId={id}
        />
      </div>
      <div>
        <CommentsList
          userId={session.id}
          postId={id}
          comments={comments}
        />
      </div>
    </div>
  );
}


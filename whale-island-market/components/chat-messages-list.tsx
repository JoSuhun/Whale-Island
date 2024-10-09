'use client';
import { useState } from 'react';
import { InitialChatMessages } from '../app/chats/[id]/page';
import { formatToTimeAgo } from '../lib/utils';
import Image from 'next/image';
import { UserIcon } from '@heroicons/react/16/solid';

interface ChatMessagesListProps {
  initialMessages: InitialChatMessages;
  userId: number;
}
export default function ChatMessagesList({
  initialMessages,
  userId,
}: ChatMessagesListProps) {
  const [messages, setMessages] = useState(initialMessages);
  return (
    <div className="p-5 flex flex-col gap-5 min-h-screen justify-end">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-2 items-end ${
            message.userId === userId ? 'justify-end' : ''
          }`}
        >
          <div className="pb-5">
            {message.userId === userId ? null : message.user
                .avatar ? (
              <Image
                src={message.user.avatar!}
                alt={message.user.username}
                width={50}
                height={50}
                className="size-9 rounded-full"
              />
            ) : (
              <div className="size-9 p-[2px] bg-neutral-200 rounded-full text-neutral-400">
                <UserIcon />
              </div>
            )}
          </div>

          <div
            className={`flex flex-col gap-1 ${
              message.userId === userId ? 'items-end' : ''
            }`}
          >
            <span
              className={`${
                message.userId === userId
                  ? 'bg-neutral-500 rounded-br-none'
                  : 'bg-green-600 rounded-bl-none'
              } p-2 px-3 rounded-2xl text-neutral-50 max-w-md`}
            >
              {message.payload}
            </span>
            <span className="text-xs text-neutral-500">
              {formatToTimeAgo(
                message.created_at.toString(),
              )}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}


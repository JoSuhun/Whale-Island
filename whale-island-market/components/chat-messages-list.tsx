'use client';
import { useEffect, useRef, useState } from 'react';
import { InitialChatMessages } from '../app/chats/[id]/page';
import { formatToTimeAgo } from '../lib/utils';
import Image from 'next/image';
import {
  createClient,
  RealtimeChannel,
} from '../node_modules/@supabase/supabase-js/dist/module/index';
import {
  ArrowUpCircleIcon,
  UserIcon,
} from '@heroicons/react/16/solid';
import { saveMessages } from '../app/chats/[id]/actions';

const SUPABASE_PUBLIC_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpY3ZrZ2R1bXlka3dpaHp0eWtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg1MjU4MTMsImV4cCI6MjA0NDEwMTgxM30.Ia7EVMzu6su4qKxii9sj-tYexin6rRjtgEFcPlFPrYY';

const SUPABASE_URL =
  'https://eicvkgdumydkwihztykq.supabase.co';

interface ChatMessagesListProps {
  initialMessages: InitialChatMessages;
  userId: number;
  chatRoomId: string;
  username: string;
  avatar: string | null;
}
export default function ChatMessagesList({
  initialMessages,
  userId,
  chatRoomId,
  username,
  avatar,
}: ChatMessagesListProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState('');
  const channel = useRef<RealtimeChannel>();

  const onChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const {
      target: { value },
    } = event;
    setMessage(value);
  };
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessages((prevMsgs) => [
      ...prevMsgs,
      {
        id: Date.now(),
        payload: message,
        created_at: new Date(),
        userId,
        user: {
          username: ' ',
          avatar: null,
        },
      },
    ]);
    channel.current?.send({
      type: 'broadcast',
      event: 'message',
      payload: {
        id: Date.now(),
        payload: message,
        created_at: new Date(),
        userId,
        user: {
          username,
          avatar,
        },
      },
    });
    await saveMessages(message, chatRoomId);
    setMessage('');
  };

  useEffect(() => {
    const client = createClient(
      SUPABASE_URL,
      SUPABASE_PUBLIC_KEY,
    );
    channel.current = client.channel(`room-${chatRoomId}`);
    channel.current
      .on('broadcast', { event: 'message' }, (payload) => {
        setMessages((prev) => [...prev, payload.payload]);
      })
      .subscribe();

    return () => {
      channel.current?.unsubscribe();
    };
  }, [chatRoomId]);

  return (
    <div className="p-5 flex flex-col gap-3 min-h-screen justify-end">
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
      <form
        className="flex justify-between border-neutral-400 border rounded-full
        focus-within:border-neutral-500 transition-colors"
        onSubmit={onSubmit}
      >
        <input
          required
          onChange={onChange}
          value={message}
          className="bg-transparent rounded-full w-full h-10 focus:outline-none
           px-4 transition focus:ring-0 border-none placeholder:text-neutral-400"
          type="text"
          name="message"
          placeholder="새로운 메세지 . . ."
        />
        <button className="">
          <ArrowUpCircleIcon
            className="size-10 text-green-600 transition-colors
           hover:text-green-700"
          />
        </button>
      </form>
    </div>
  );
}


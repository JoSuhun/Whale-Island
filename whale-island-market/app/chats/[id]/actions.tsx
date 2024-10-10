'use server';

import db from '../../../lib/db';
import getSession from '../../../lib/session';

export async function saveMessages(
  payload: string,
  chatRoomId: string,
) {
  const session = await getSession();
  const message = await db.message.create({
    data: {
      userId: session.id!,
      payload,
      chatRoomId,
    },
    select: {
      id: true,
    },
  });
}


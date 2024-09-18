import { notFound, redirect } from 'next/navigation';
import db from '../../../lib/db';
import getSession from '../../../lib/session';

async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
    if (user) return user;
  }
  notFound();
}

export default async function Profile() {
  const user = await getUser();
  const logOut = async () => {
    'use server';
    const session = await getSession();
    await session.destroy();
    redirect('/');
  };
  return (
    <div>
      <h2>welcome {user?.username}</h2>
      <form action={logOut}>
        <button>Logout</button>
      </form>
    </div>
  );
}

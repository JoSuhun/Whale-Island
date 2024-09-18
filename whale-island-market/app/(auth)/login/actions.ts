'use server';

import bcrypt from 'bcrypt';
import { z } from 'zod';

import db from '../../../lib/db';
import getSession from '../../../lib/session';
import { redirect } from 'next/navigation';

const checkEmailExists = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  return Boolean(user);
};

const formSchema = z.object({
  email: z
    .string()
    .email(
      '아이디를 확인해주세요, 아이디는 이메일 형식이랍니다!',
    )
    .toLowerCase()
    .refine(
      checkEmailExists,
      '존재하는 사용자가 아닙니다! 이메일을 확인해주세요',
    ),
  password: z.string({
    required_error: '올바른 비밀번호를 입력해주세요',
  }),
  // .min(PASSWORD_MIN_LENGTH),
  // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
});

export const login = async (
  prevState: any,
  formData: FormData,
) => {
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const result = await formSchema.safeParseAsync(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    // 사용자가 있는 경우에만, 해싱된 패스워드 확인
    const user = await db.user.findUnique({
      where: {
        email: result.data.email,
      },
      select: {
        id: true,
        password: true,
      },
    });
    const ok = await bcrypt.compare(
      result.data.password,
      user!.password ?? '',
    );

    if (ok) {
      const session = await getSession();
      session.id = user!.id;
      await session.save();
      redirect('/profile');
    } else {
      return {
        fieldErrors: {
          password: ['잘못된 비밀번호입니다.'],
          email: [],
        },
      };
    }
  }
};


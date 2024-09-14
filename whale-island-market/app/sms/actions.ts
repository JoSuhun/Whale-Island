'use server';

import crypto from 'crypto';
import { z } from 'zod';
import validator from 'validator';
import { redirect } from 'next/navigation';
import db from '../../lib/db';

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, 'ko-KR'),
    '전화번호 형식을 확인해주세요!',
  );

const tokenSchema = z.coerce
  .number()
  .min(100000)
  .max(999999);

interface ActionState {
  token: boolean;
}

async function getToken() {
  const token = crypto.randomInt(100000, 999999).toString();
  const exists = await db.sMSToken.findUnique({
    where: {
      token,
    },
    select: {
      id: true,
    },
  });
  if (exists) return getToken();
  else return token;
}

export const smsLogin = async (
  prevState: ActionState,
  formData: FormData,
) => {
  const phone = formData.get('phone');
  const token = formData.get('token');
  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      return {
        token: false,
        error: result.error.flatten(),
      };
    } else {
      // sMSToken db에 입력한 전화번호와 일치하는 유저의 토큰 제거
      await db.sMSToken.deleteMany({
        where: {
          user: {
            phone: result.data,
          },
        },
      });
      // 토큰 새로 생성
      const token = await getToken();
      await db.sMSToken.create({
        data: {
          token,
          user: {
            connectOrCreate: {
              where: {
                phone: result.data,
              },
              create: {
                username: crypto
                  .randomBytes(10)
                  .toString('hex'),
                phone: result.data,
              },
            },
          },
        },
      });
      return {
        token: true,
      };
    }
  } else {
    const result = tokenSchema.safeParse(token);
    if (!result.success) {
      return {
        token: true,
        error: result.error.flatten(),
      };
    } else {
      redirect('/');
    }
  }
};


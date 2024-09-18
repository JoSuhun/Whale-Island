'use server';

import twilio from 'twilio';
import crypto from 'crypto';
import { z } from 'zod';
import validator from 'validator';
import { redirect } from 'next/navigation';
import db from '../../../lib/db';
import getSession from '../../../lib/session';

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, 'ko-KR'),
    '전화번호 형식을 확인해주세요!',
  );

async function tokenExists(token: number) {
  const exists = await db.sMSToken.findUnique({
    where: {
      token: token.toString(),
    },
    select: {
      id: true,
    },
  });
  return Boolean(exists);
}

const tokenSchema = z.coerce
  .number()
  .min(100000)
  .max(999999)
  .refine(tokenExists, '인증번호가 유효하지 않아요');

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
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN,
      );
      await client.messages.create({
        body: `고래섬 로그인 인증코드 : ${token}`,
        from: process.env.TWILIO_PHONE_NUMBER!,
        to: process.env.TWILIO_MY_PHONE_NUMBER!,
      });
      return {
        token: true,
      };
    }
  } else {
    const result = await tokenSchema.safeParseAsync(token);
    if (!result.success) {
      return {
        token: true,
        error: result.error.flatten(),
      };
    } else {
      // token의 userId 가져오기
      const token = await db.sMSToken.findUnique({
        where: {
          token: result.data.toString(),
        },
        select: {
          id: true,
          userId: true,
        },
      });
      if (token) {
        const session = await getSession();
        session.id = token.userId;
        await session.save();
        await db.sMSToken.delete({
          where: {
            id: token.id,
          },
        });
      }
      redirect('/profile');
    }
  }
};


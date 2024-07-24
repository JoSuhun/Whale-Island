'use server';
import { z } from 'zod';
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from '../../lib/constants';

const checkPassword = ({
  password,
  confirm_password,
}: {
  password: string;
  confirm_password: string;
}) => password === confirm_password;

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error:
          '이름은 문자로만 설정할 수 있어요',
        required_error: '이름을 설정해주세요',
      })
      .trim(),
    email: z
      .string()
      .email('이메일을 확인해주세요.')
      .toLowerCase(),
    password: z
      .string()
      .min(
        PASSWORD_MIN_LENGTH,
        '최소 8글자 이상으로 설정해주세요',
      )
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirm_password: z
      .string()
      .min(
        PASSWORD_MIN_LENGTH,
        '최소 8글자 이상으로 설정해주세요',
      ),
  })
  .refine(checkPassword, {
    message: '비밀번호가 일치하지 않아요',
    path: ['confirm_password'],
  });

export async function createAccount(
  prevState: any,
  formData: FormData,
) {
  const data = {
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirm_password: formData.get('confirm_password'),
  };
  const result = formSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    console.log(result.data);
  }
}


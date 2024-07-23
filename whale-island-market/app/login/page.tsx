'use client';

import SocialLogin from '../../components/social-login';
import { useFormState } from 'react-dom';
import { login } from './actions';
import Input from '../../components/input';
import Button from '@/components/btn';
import { PASSWORD_MIN_LENGTH } from '../../lib/constants';

export default function Login() {
  // server action

  const [state, action] = useFormState(
    login,
    // initial state
    null,
  );

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">반갑습니다 회원님</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <Input
          name="email"
          type="email"
          placeholder="이메일"
          required
          errors={[]}
        />
        <Input
          name="password"
          type="password"
          placeholder="비밀번호"
          required
          minLength={PASSWORD_MIN_LENGTH}
          errors={state?.errors ?? []}
        />
        <Button text="로그인" />
      </form>
      <SocialLogin />
    </div>
  );
}


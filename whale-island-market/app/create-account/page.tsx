'use client';

import FormInput from '@/components/form-input';
import FormButton from '@/components/form-btn';
import SocialLogin from '../../components/social-login';
import { useFormState } from 'react-dom';
import { createAccount } from './actions';

export default function CreateAccount() {
  const [state, action] = useFormState(createAccount, null);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">회원가입을 도와드릴게요</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <FormInput
          name="username"
          type="text"
          placeholder="이름"
          required
          errors={state?.fieldErrors.username}
        />
        <FormInput
          name="email"
          type="email"
          placeholder="이메일"
          required
          errors={state?.fieldErrors.email}
        />
        <FormInput
          name="password"
          type="password"
          placeholder="비밀번호"
          required
          errors={state?.fieldErrors.password}
        />
        <FormInput
          name="confirm_password"
          type="password"
          placeholder="비밀번호 확인"
          required
          errors={state?.fieldErrors.confirm_password}
        />
        <FormButton text="회원가입하기" />
      </form>
      <SocialLogin />
    </div>
  );
}


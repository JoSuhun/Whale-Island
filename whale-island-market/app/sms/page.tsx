'use client';

import Button from '@/components/btn';
import Input from '@/components/input';
import { useFormState } from 'react-dom';
import { smsLogin } from './actions';

const initialState = {
  token: false,
  error: undefined,
};

export default function SMSLogin() {
  const [state, action] = useFormState(
    smsLogin,
    initialState,
  );
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS 로그인</h1>
        <h2 className="text-xl">
          본인 명의의 휴대전화 번호 인증
        </h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <Input
          name="phone"
          type="text"
          placeholder="휴대전화 번호"
          required
          errors={state.error?.formErrors}
          disabled={state.token}
        />
        {state.token ? (
          <Input
            name="token"
            type="number"
            placeholder="인증번호"
            required
            min={100000}
            max={999999}
          />
        ) : null}
        <Button
          text={
            state.token ? '인증하기' : '인증번호 보내기'
          }
        />
      </form>
    </div>
  );
}


import Link from 'next/link';
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/16/solid';
import FormInput from '../../components/form-input';
import FormButton from '../../components/form-btn';

export default function CreateAccount() {
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">
          회원가입을 도와드릴게요
        </h2>
      </div>
      <form className="flex flex-col gap-3">
        <FormInput
          type="text"
          placeholder="이름"
          required
          errors={[
            '유효한 값을 입력하세요! (한 글자 이상)',
          ]}
        />
        <FormInput
          type="email"
          placeholder="이메일"
          required
          errors={[]}
        />
        <FormInput
          type="password"
          placeholder="비밀번호"
          required
          errors={[]}
        />
        <FormInput
          type="password"
          placeholder="비밀번호 확인"
          required
          errors={[]}
        />
        <FormButton
          loading={false}
          text="회원가입하기"
        />
      </form>
      <div className="w-full h-px bg-neutral-500" />
      <div>
        <Link
          className="primary-btn flex h-10 items-center justify-center gap-2"
          href="/sms"
        >
          <span>
            <ChatBubbleOvalLeftEllipsisIcon className="size-5" />
          </span>
          <span>sign up with SMS</span>
        </Link>
      </div>
    </div>
  );
}


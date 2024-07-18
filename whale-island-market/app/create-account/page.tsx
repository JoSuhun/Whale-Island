import FormInput from '@/components/form-input';
import FormButton from '@/components/form-btn';
import SocialLogin from '../../components/social-login';

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
          name="name"
          type="text"
          placeholder="이름"
          required
          errors={[
            '유효한 값을 입력하세요! (한 글자 이상)',
          ]}
        />
        <FormInput
          name="email"
          type="email"
          placeholder="이메일"
          required
          errors={[]}
        />
        <FormInput
          name="password"
          type="password"
          placeholder="비밀번호"
          required
          errors={[]}
        />
        <FormInput
          name="password2"
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
      <SocialLogin />
    </div>
  );
}


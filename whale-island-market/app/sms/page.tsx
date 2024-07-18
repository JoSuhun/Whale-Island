import FormInput from '@/components/form-input';
import FormButton from '@/components/form-btn';
import SocialLogin from '../../components/social-login';

export default function SMSLogin() {
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS 로그인</h1>
        <h2 className="text-xl">
          본인 명의의 휴대전화 번호 인증
        </h2>
      </div>
      <form className="flex flex-col gap-3">
        <FormInput
          name="number"
          type="number"
          placeholder="휴대전화 번호"
          required
          errors={[]}
        />
        <FormInput
          name="verify"
          type="number"
          placeholder="인증번호"
          required
          errors={[]}
        />
        <FormButton
          loading={false}
          text="인증번호 보내기"
        />
      </form>
    </div>
  );
}


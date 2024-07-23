export const PASSWORD_MIN_LENGTH = 4;

export const PASSWORD_REGEX = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/,
);

export const PASSWORD_REGEX_ERROR =
  '비밀번호는 대문자, 소문자, 숫자, 특수문자를 포함하여 만들어주세요!';

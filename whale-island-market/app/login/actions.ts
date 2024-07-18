'use server';

export const handleForm = async (
  prevState: any,
  formData: FormData,
) => {
  await new Promise((resolve) =>
    setTimeout(resolve, 3000),
  );
  console.log('logged in');
  return {
    errors: ['wrong password', 'too short'],
  };
};


'use server';

import bcrypt from 'bcrypt';
import { AuthError } from 'next-auth';
import { auth, signIn } from '@/auth';
import { z } from 'zod';
import { getCurrentUTCTime } from '../utils';
import { apiRequest } from '../server-functions';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Credenciales inválidas';
        default:
          return 'Ha ocurrido un error inesperado';
      }
    }
    throw error;
  }
}

const FormSchema = z.object({
  username: z.string().min(3, {
    message: 'El usuario debe tener al menos 3 caracteres.',
  }),
});
export async function sendRecoveryCode(
  prevState: any,
  formData: FormData
): Promise<{
  errors: { username?: string[] | undefined };
  step: 'email' | 'otp' | '';
  message: string;
  username?: string;
}> {
  const usernameField = formData.get('username')?.toString();
  const validatedData = FormSchema.safeParse({ username: usernameField });

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
      step: 'email',
      message: '',
    };
  }

  const { username } = validatedData.data;
  try {
    const response = await apiRequest(
      '/auth/forgot-password',
      'PATCH',
      undefined,
      {
        username,
      }
    );

    if (!response?.success) {
      return {
        errors: {
          username: ['El usuario no existe.'],
        },
        step: 'email',
        message: '',
      };
    }

    return {
      errors: {},
      step: 'otp',
      message: '',
      username,
    };
  } catch (error) {
    console.error(error);
    return {
      errors: {},
      step: 'email',
      message:
        'Ha ocurrido un error al enviar el código de recuperación, por favor, contacta a soporte.',
    };
  }
}

export async function validateOTP(
  username: string,
  prevState: any,
  formData: FormData
): Promise<{
  errors: { otp?: string[] | undefined };
  username?: string;
}> {
  const otpObject = Object.fromEntries(formData.entries());
  const otp = Object.values(otpObject).join('');

  const response = await apiRequest(
    '/auth/forgot-password/verify',
    'POST',
    undefined,
    {
      otp,
      username,
    }
  );

  if (!response?.success) {
    const fieldMessage = {
      otp: response?.schema.otp,
    };
    return {
      errors: {
        otp: [fieldMessage.otp ?? ''],
      },
    };
  }

  return {
    errors: {},
    username,
  };
}

const PassFormSchema = z.object({
  password: z.string().min(6, {
    message: 'La contraseña debe tener al menos 6 caracteres.',
  }),
  confirmPassword: z.string({
    message: 'Por favor, confirma tu contraseña.',
  }),
});

export async function resetPassword(
  username: string,
  otp: string,
  prevState: any,
  formData: FormData
): Promise<{
  errors: {
    password?: string[] | undefined;
    confirmPassword?: string[] | undefined;
  };
  done?: boolean;
}> {
  const validatedData = PassFormSchema.safeParse({
    password: formData.get('password')?.toString(),
    confirmPassword: formData.get('confirmPassword')?.toString(),
  });

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
    };
  }

  const { password, confirmPassword } = validatedData.data;

  if (password !== confirmPassword) {
    return {
      errors: {
        password: ['Las contraseñas no coinciden.'],
      },
    };
  }

  try {
    const response = await apiRequest(
      '/auth/forgot-password/reset',
      'PATCH',
      undefined,
      {
        username,
        otp,
        password,
        confirmPassword,
      }
    );

    if (!response?.success) {
      const fieldMessage = {
        password: response?.schema.password,
        confirmPassword: response?.schema.confirmPassword,
      };
      return {
        errors: {
          password: [fieldMessage.password ?? ''],
          confirmPassword: [fieldMessage.confirmPassword ?? ''],
        },
      };
    }

    return {
      errors: {},
      done: true,
    };
  } catch (error) {
    console.error(error);
    return {
      errors: {
        password: ['Ha ocurrido un error al actualizar la contraseña.'],
      },
    };
  }
}
const ResetPassFormSchema = z.object({
  currentPassword: z.string().min(6, {
    message: 'La contraseña debe tener al menos 6 caracteres.',
  }),
  password: z.string().min(6, {
    message: 'La contraseña debe tener al menos 6 caracteres.',
  }),
  passwordConfirm: z.string({
    message: 'Por favor, confirma tu contraseña.',
  }),
});

export async function changePassword(
  prevState: any,
  formData: FormData
): Promise<{
  done?: boolean;
  errors: {
    currentPassword?: string[] | undefined;
    password?: string[] | undefined;
    passwordConfirm?: string[] | undefined;
  };
}> {
  const validatedData = ResetPassFormSchema.safeParse({
    currentPassword: formData.get('currentPassword')?.toString(),
    password: formData.get('password')?.toString(),
    passwordConfirm: formData.get('passwordConfirm')?.toString(),
  });

  if (!validatedData.success) {
    return {
      errors: validatedData.error.flatten().fieldErrors,
    };
  }

  const { currentPassword, password, passwordConfirm } = validatedData.data;
  const session = await auth();

  if (password !== passwordConfirm) {
    return {
      errors: {
        password: ['Las contraseñas no coinciden.'],
        passwordConfirm: ['Las contraseñas no coinciden.'],
      },
    };
  }
  try {
    const token = session?.user.token;
    const response = await apiRequest('/auth/change-password', 'PUT', token, {
      currentPassword,
      password,
      confirmPassword: passwordConfirm,
    });

    if (!response?.success) {
      return {
        errors: {
          password: ['La contraseña actual es incorrecta.'],
        },
      };
    }

    return {
      done: true,
      errors: {},
    };
  } catch (error) {
    console.error(error);
    return {
      errors: {
        password: ['Ha ocurrido un error al actualizar la contraseña.'],
      },
    };
  }
}

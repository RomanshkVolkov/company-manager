'use client';
import { changePassword } from '@/app/lib/actions/auth.actions';
import InputCredentials from '@/app/ui/common/input-credentials';
import SubmitButton from '@/app/ui/common/submit-button';
import { hasItems } from '@/app/lib/utils';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { useActionState } from 'react';

export default function FormResetPassword() {
  const initialState = {
    done: false,
    errors: {},
  };

  const [formState, dispatch] = useActionState(changePassword, initialState);

  return (
    <form action={dispatch} className="px-2 md:px-4">
      <InputCredentials
        id="currentPassword"
        label="Contraseña actual"
        isInvalid={hasItems(formState.errors?.currentPassword)}
        errorMessage={formState.errors?.currentPassword?.join(', ')}
      />
      <InputCredentials
        isInvalid={hasItems(formState.errors?.password)}
        errorMessage={formState.errors?.password?.join(', ')}
      />
      <InputCredentials
        id="passwordConfirm"
        label="Confirmar contraseña"
        isInvalid={hasItems(formState.errors?.passwordConfirm)}
        errorMessage={formState.errors?.passwordConfirm?.join(', ')}
      />

      <div className="mt-4 flex justify-center">
        <SubmitButton label="Guardar" />
      </div>
      <div className="">
        {formState.done && (
          <div className="mt-4 flex items-center justify-center text-green-500">
            <CheckCircleIcon width={20} />
            <span className="ml-2">Contraseña actualizada</span>
          </div>
        )}
      </div>
    </form>
  );
}

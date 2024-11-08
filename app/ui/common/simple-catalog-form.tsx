'use client';
// framework
import { useActionState, useState } from 'react';

// libs
import { Input } from '@nextui-org/react';
import { UserGroupIcon } from '@heroicons/react/24/outline';

// types and utils
import { ActionState } from '@/app/types/types';
import { site } from '@/app/lib/consts';

// components
import Fields from '@/app/ui/common/fields';
import FormGroup from '@/app/ui/common/form-group';
import FormWrapper from '@/app/ui/common/form-wrapper';
import { hasItems } from '@/app/lib/utils';

type FormErrors = {
  name?: string[];
};

export default function SimpleCatalogForm<T extends FormErrors>({
  serverAction,
}: {
  serverAction: (
    state: ActionState<T>,
    formData: FormData
  ) => ActionState<T> | Promise<ActionState<T>>;
}) {
  const initialState: ActionState<T> = {
    message: '',
    errors: {} as T,
  };

  const [state, dispatch] = useActionState(serverAction, initialState);

  return (
    <FormWrapper
      dispatch={dispatch}
      hrefCancelled="back()"
      message={state?.message}
      isTransparent={true}
    >
      <FormGroup title="Información del usuario" icon={UserGroupIcon}>
        <Fields>
          <div className="mb-4 w-full">
            <Input
              id="name"
              label="Nombre"
              isInvalid={hasItems(state.errors?.name)}
              errorMessage={state.errors?.name}
            />
          </div>
        </Fields>
      </FormGroup>
    </FormWrapper>
  );
}

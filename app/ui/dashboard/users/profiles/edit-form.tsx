'use client';
import { createProfile } from '@/app/lib/actions/user.actions';
import { hasItems } from '@/app/lib/utils';
import { ActionState } from '@/app/types/types';
import { Profile } from '@/app/types/user';
import Fields from '@/app/ui/common/fields';
import FormGroup from '@/app/ui/common/form-group';
// framework

// libs

// types and utils

// components
import FormWrapper from '@/app/ui/common/form-wrapper';
import { ShieldCheckIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { Input } from '@nextui-org/react';
import { useActionState } from 'react';

type Props = {
  profile: Profile;
};
export default function EditFormProfile({ profile }: Props) {
  console.log(profile);
  const initialState: ActionState<any> = {
    errors: {} as any,
    message: '',
    finishedProcess: false,
  };
  const [state, dispatch] = useActionState(createProfile, initialState);
  return (
    <FormWrapper
      dispatch={dispatch}
      message={state.message}
      hrefCancelled="back()"
    >
      <FormGroup title="Datos del perfil" icon={UserCircleIcon}>
        <Fields>
          <div className="mb-4 w-full md:mb-0">
            <Input
              id="name"
              name="name"
              label="Nombre"
              isInvalid={hasItems(state.errors?.name)}
              errorMessage={state.errors?.name}
            />
          </div>
        </Fields>
      </FormGroup>
      <FormGroup title="Permisos" icon={ShieldCheckIcon}>
        <Fields>
          <div className="mb-4 w-full md:mb-0"></div>
        </Fields>
      </FormGroup>
    </FormWrapper>
  );
}

'use client';

// framework
import { useActionState } from 'react';

// libs
import { ClockIcon } from '@heroicons/react/24/outline';
import { Input } from '@nextui-org/react';

// types and utils

// components
import Fields from '@/app/ui/common/fields';
import FormGroup from '@/app/ui/common/form-group';
import FormWrapper from '@/app/ui/common/form-wrapper';
import { createShift } from '@/app/lib/actions/user.actions';
import useEndActionModalProcess from '@/app/hooks/use-end-action-modal-process';

export default function Form() {
  const initialState = {
    message: '',
    errors: {},
    finishedProcess: false,
  };

  const [state, dispatch, isPending] = useActionState(
    createShift,
    initialState
  );

  useEndActionModalProcess({ signal: state?.finishedProcess });
  return (
    <FormWrapper
      dispatch={dispatch}
      message={state?.message}
      hrefCancelled={'back()'}
      isPending={isPending}
    >
      <FormGroup title="Información del turno" icon={ClockIcon}>
        <Fields>
          <div className="mb-6 w-full md:mb-0">
            <Input
              id="name"
              name="name"
              label="Nombre"
              errorMessage={state.errors.name}
            />
          </div>
        </Fields>
      </FormGroup>
    </FormWrapper>
  );
}

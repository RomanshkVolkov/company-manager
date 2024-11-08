'use client';
import useEndActionModalProcess from '@/app/hooks/use-end-action-modal-process';
import { createKitchen } from '@/app/lib/actions/user.actions';
import { hasItems } from '@/app/lib/utils';
import Fields from '@/app/ui/common/fields';
import FormGroup from '@/app/ui/common/form-group';
import FormWrapper from '@/app/ui/common/form-wrapper';
import { ClockIcon } from '@heroicons/react/24/outline';
import { Input } from '@nextui-org/react';
import { useActionState } from 'react';

export default function Form() {
  const initialState = {
    message: '',
    errors: {},
    finishedProcess: false,
  };

  const [state, dispatch, isPending] = useActionState(
    createKitchen,
    initialState
  );
  useEndActionModalProcess({ signal: state?.finishedProcess });
  return (
    <FormWrapper
      dispatch={dispatch}
      message={state?.message}
      hrefCancelled={'back()'}
    >
      <FormGroup title="Información de la cocina" icon={ClockIcon}>
        <Fields>
          <div className="mb-6 w-full md:mb-0">
            <Input
              id="name"
              name="name"
              label="Nombre"
              isInvalid={hasItems(state.errors.name)}
              errorMessage={state.errors?.name}
            />
          </div>
        </Fields>
      </FormGroup>
    </FormWrapper>
  );
}

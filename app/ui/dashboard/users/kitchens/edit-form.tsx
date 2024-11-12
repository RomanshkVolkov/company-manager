'use client';

// framework
import { useActionState, useEffect } from 'react';

// libs
import { BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import { Input } from '@nextui-org/react';

// types and utils
import { ActionState } from '@/app/types/types';
import { Errors } from '@/app/lib/schemas/catalog.schema';
import { editKitchenAction } from '@/app/lib/actions/user.actions';

// components
import Fields from '@/app/ui/common/fields';
import FormGroup from '@/app/ui/common/form-group';
import FormWrapper from '@/app/ui/common/form-wrapper';
import { useRouter } from 'next/navigation';
import { hasItems } from '@/app/lib/utils';

export default function EditForm<T extends Errors>({
  id,
  data,
}: {
  id: number;
  data: { name: string };
}) {
  const { back } = useRouter();

  const bindAction = editKitchenAction.bind(null, id) as (
    _prev: any,
    _formData: FormData
  ) => Promise<ActionState<T>>;

  const initialState = {
    message: '',
    errors: {} as T,
    finishedProcess: false,
  };

  const [state, dispatch, isPending] = useActionState(bindAction, initialState);
  const handleFinishedProcess = () => {
    if (state?.finishedProcess) {
      back();
    }
  };

  useEffect(handleFinishedProcess, [state, back]);
  return (
    <FormWrapper
      dispatch={dispatch}
      hrefCancelled="back()"
      message={state?.message}
      isPending={isPending}
    >
      <FormGroup title="Información de la cocina" icon={BuildingStorefrontIcon}>
        <Fields>
          <div className="mb-4 w-full">
            <Input
              id="name"
              name="name"
              label="Nombre"
              isInvalid={hasItems(state.errors?.name)}
              errorMessage={state.errors?.name}
              defaultValue={data.name}
            />
          </div>
        </Fields>
      </FormGroup>
    </FormWrapper>
  );
}

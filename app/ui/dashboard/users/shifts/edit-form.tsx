'use client';

// framework
import { useActionState, useEffect } from 'react';

// libs
import { ClockIcon } from '@heroicons/react/24/outline';
import { Input } from '@nextui-org/react';

// types and utils
import { Errors } from '@/app/lib/schemas/catalog.schema';
import { ActionState } from '@/app/types/types';
import { editShiftAction } from '@/app/lib/actions/user.actions';

// components
import Fields from '@/app/ui/common/fields';
import FormGroup from '@/app/ui/common/form-group';
import FormWrapper from '@/app/ui/common/form-wrapper';
import { useRouter } from 'next/navigation';

export default function EditForm<T extends Errors>({
  id,
  data,
}: {
  id: number;
  data: { name: string };
}) {
  const { back } = useRouter();

  const bindAction = editShiftAction.bind(null, id) as (
    prev: any,
    formData: FormData
  ) => Promise<ActionState<T>>;

  const initialState: ActionState<T> = {
    message: '',
    errors: {} as T,
    finishedProcess: false,
  };

  const [state, dispatch] = useActionState(bindAction, initialState);
  const handleFinishedProcess = () => {
    if (state?.finishedProcess) {
      back();
    }
  };

  useEffect(handleFinishedProcess, [state]);

  return (
    <FormWrapper
      dispatch={dispatch}
      hrefCancelled="back()"
      message={state?.message}
      isTransparent={true}
    >
      <FormGroup title="Información de la cocina" icon={ClockIcon}>
        <Fields>
          <div className="mb-4 w-full">
            <Input
              id="name"
              name="name"
              label="Nombre"
              errorMessage={state.errors?.name}
              defaultValue={data.name}
            />
          </div>
        </Fields>
      </FormGroup>
    </FormWrapper>
  );
}

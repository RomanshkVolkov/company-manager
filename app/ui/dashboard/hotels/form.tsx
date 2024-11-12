'use client';
import { WrenchIcon } from '@heroicons/react/24/outline';
import Fields from '../../common/fields';
import FormGroup from '../../common/form-group';
import FormWrapper from '../../common/form-wrapper';
import { site } from '@/app/lib/consts';
import { Input } from '@nextui-org/react';
import { updateHostingCenter } from '@/app/lib/actions/hosting-centers.actions';
import { ActionState } from '@/app/types/types';
import { HostingCenterUpdatedErrors } from '@/app/types/dashboard';
import { useActionState } from 'react';

export default function FormHotel<T extends HostingCenterUpdatedErrors>({
  data,
}: {
  data: any;
}) {
  const bindAction = updateHostingCenter.bind(null, data.id);
  const initialState: ActionState<T> = {
    message: '',
    errors: {} as T,
  };
  const [state, dispatch] = useActionState(bindAction, initialState);

  return (
    <FormWrapper
      dispatch={dispatch}
      hrefCancelled={site.generalSettings.path}
      message={state.message}
    >
      <FormGroup title="Datos generales" icon={WrenchIcon}>
        <Fields>
          <div className="mb-4 md:mb-0 md:w-1/2">
            <Input
              id="name"
              name="name"
              label="Nombre"
              defaultValue={data.name}
            />
          </div>
          <div className="mb-4 md:mb-0 md:w-1/2">
            <Input
              id="companyName"
              name="companyName"
              label="Razón social"
              defaultValue={data.companyName}
            />
          </div>
        </Fields>
      </FormGroup>
    </FormWrapper>
  );
}

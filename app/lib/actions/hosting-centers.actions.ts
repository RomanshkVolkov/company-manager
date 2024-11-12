// framework

// libs

// types and utils
import { ActionState } from '@/app/types/types';
import { HostingCenterUpdatedErrors } from '@/app/types/dashboard';
import { apiRequest } from '../server-functions';
import { editAction } from './generic.actions';
import { site } from '../consts';
import { validatedRequest } from '../utils';

// components

export async function getCurrentHostingCenter() {
  const response = await apiRequest('/hosting-center/current', 'GET', true);

  return validatedRequest(response, {});
}

export async function updateHostingCenter<T extends HostingCenterUpdatedErrors>(
  id: number,
  prevState: any,
  formData: FormData
) {
  const data = Object.fromEntries(formData);
  const pathname = '/hosting-center/current';
  const errorMessage = 'Hubo un problema al editar la cocina';

  return (await editAction(
    pathname,
    errorMessage,
    site.generalSettings.path,
    {
      id,
      name: data.name,
      companyName: data.companyName,
    },
    undefined,
    true
  )) as ActionState<T>;
}

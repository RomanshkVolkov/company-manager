'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  debugError,
  reportErrorToSentry,
  validatedRequest,
  validatedSchema,
} from '../utils';
import { Errors } from '../schemas/user.schema';
import { apiRequest } from '../server-functions';
import { CatalogSchema } from '../schemas/catalog.schema';
import { ActionState, Catalog } from '@/app/types/types';
import { site } from '../consts';
import { deleteAction, editAction } from './generic.actions';

export async function GetAllUsers() {
  const response = await apiRequest('/users', 'GET', true, undefined, 1200);

  return validatedRequest(response, []);
}

export async function createUser(
  prevState: any,
  formData: FormData
): Promise<ActionState<Errors>> {
  const data = Object.fromEntries(formData);
  const formKitchens = formData.getAll('kitchenIDs'); // output: ['1', '2', '3'] multiple values

  try {
    const isActive = data?.isActive === '';

    const response = await apiRequest('/users', 'POST', true, {
      username: data.username,
      password: data.password,
      email: data.email,
      name: data.name,
      profileID: +data.profileID,
      isActive,
      kitchenIDs: formKitchens.map((k) => +k),
    });

    if (!response?.success) {
      return {
        errors: response.schema,
        message: response!.message.es,
      };
    }
  } catch (e) {
    reportErrorToSentry(e, 'User Actions');
    return {
      errors: {},
      message:
        'Hubo un problema al crear el usuario, por favor, intente de nuevo o contacte a soporte',
    };
  }

  const path = '/dashboard/settings/users';
  revalidatePath(path);
  redirect(path);
}

export async function editUser(
  id: number,
  prevState: any,
  formData: FormData
): Promise<ActionState<Omit<Errors, 'password'>>> {
  const data = Object.fromEntries(formData);
  const formKitchens = formData.getAll('kitchenIDs'); // output: ['1', '2', '3'] multiple values
  const isActive = data?.isActive === '' || !!data.isActive;
  const request = {
    id: id,
    username: data.username as string,
    email: data.email as string,
    name: data.name as string,
    profileID: +data.profileID,
    shiftID: +data.shiftID,
    isActive,
    kitchenIDs: formKitchens.map((k) => +k),
  };

  try {
    const response = await apiRequest(`/users/${id}`, 'PUT', true, request);

    if (!response.success) {
      return {
        errors: {} as any,
        message: response.message.es,
      };
    }
  } catch (e) {
    reportErrorToSentry(e, 'User Actions');
    return {
      errors: {} as any,
      message:
        'Hubo un problema al editar el usuario, por favor, intente de nuevo o contacte a soporte',
    };
  }

  const path = site.usersSettings.path;
  redirect(path);
}

export async function deleteUser(id: number) {
  const pathname = `/users/${id}`;
  const errorMessage = 'Hubo un problema al eliminar el usuario';
  return await deleteAction(pathname, errorMessage, site.usersSettings.path);
}

export async function getKitchenByID(id: number) {
  const response = await apiRequest<Catalog>(
    `/catalogs/kitchen/${id}`,
    'GET',
    true
  );

  return validatedRequest(response, { id: 0, name: '' });
}

export async function createKitchen(prevState: any, formData: FormData) {
  try {
    const data = Object.fromEntries(formData);
    const validatedData = validatedSchema(data, CatalogSchema);

    if (validatedData.errors) {
      return {
        errors: validatedData.errors,
        message: '',
      };
    }

    const response = await apiRequest('/users/kitchens', 'POST', true, {
      name: validatedData.data.name,
    });

    if (!response.success) {
      return {
        errors: {
          name: [response.schema?.name ?? ''],
        },
        message: response.message.es,
      };
    }
  } catch (e) {
    debugError(e);
    reportErrorToSentry(e, 'User Actions');
    return {
      errors: {},
      message:
        'Hubo un problema al crear la cocina, por favor, intente de nuevo o contacte a soporte',
    };
  }

  const path = '/dashboard/settings/users/create';

  revalidatePath(path);
  return {
    errors: {},
    message: '',
    finishedProcess: true,
  };
}

export async function getShiftByID(id: number) {
  const response = await apiRequest<Catalog>(
    `/catalogs/shift/${id}`,
    'GET',
    true
  );

  return validatedRequest(response, { id: 0, name: '' });
}

export async function createShift(prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData);
  const validatedData = validatedSchema(data, CatalogSchema);

  if (validatedData.errors) {
    return {
      errors: validatedData.errors,
      message: '',
    };
  }

  const response = await apiRequest('/users/shifts', 'POST', true, {
    name: validatedData.data.name,
  });

  if (!response.success) {
    return {
      errors: {
        name: [response.schema?.name ?? ''],
      },
      message: response.message.es,
    };
  }

  const path = '/dashboard/settings/users/create';
  revalidatePath(path);

  return {
    errors: {},
    message: '',
    finishedProcess: true,
  };
}

export async function editShiftAction(
  id: number,
  prevState: any,
  formData: FormData
) {
  const data = Object.fromEntries(formData);
  const pathname = `/catalogs/shift/${id}`;
  const errorMessage = 'Hubo un problema al editar el turno';

  return await editAction(
    pathname,
    errorMessage,
    site.shiftsSettings.path,
    {
      id,
      name: data.name,
    },
    CatalogSchema
  );
}

export async function editKitchenAction<T>(
  id: number,
  prevState: any,
  formData: FormData
): Promise<ActionState<T>> {
  const data = Object.fromEntries(formData);
  const pathname = `/catalogs/kitchen/${id}`;
  const errorMessage = 'Hubo un problema al editar la cocina';

  return (await editAction(
    pathname,
    errorMessage,
    site.kitchensSettings.path,
    {
      id,
      name: data.name,
    },
    CatalogSchema
  )) as ActionState<T>;
}

export async function deleteKitchenAction(id: number) {
  const pathname = `/catalogs/kitchen/${id}`;
  const errorMessage = 'Hubo un problema al eliminar la cocina';
  return await deleteAction(pathname, errorMessage, site.kitchensSettings.path);
}

export async function deleteShiftAction(id: number) {
  const pathname = `/catalogs/shift/${id}`;
  const errorMessage = 'Hubo un problema al eliminar el turno';
  return await deleteAction(pathname, errorMessage, site.shiftsSettings.path);
}

export async function createProfile(prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData);

  const response = await apiRequest('/users/profiles', 'POST', true, {
    name: data.name,
  });

  if (!response.success) {
    return {
      errors: response.schema,
      message: response.message.es,
    };
  }

  const path = '/dashboard/settings/users/create';
  revalidatePath(path);
  redirect(path);
}
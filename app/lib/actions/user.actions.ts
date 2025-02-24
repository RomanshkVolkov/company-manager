'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

import { ActionState, Catalog, GormModel } from '@/app/types/types';
import { CatalogSchema } from '../schemas/catalog.schema';
import {
  EditableUser,
  Permission,
  Profile,
  UsersTable,
} from '@/app/types/user';
import { Errors } from '../schemas/user.schema';
import {
  conditionalParse,
  debugError,
  reportErrorToSentry,
  serializedPathname,
  validatedRequest,
  validatedSchema,
} from '../utils';
import { apiRequest } from '../server-functions';
import { publicRoutes, site } from '../consts';
import { createAction, deleteAction, editAction } from './generic.actions';

export async function getUsers() {
  const response = await apiRequest<UsersTable[]>(
    '/users',
    'GET',
    true,
    undefined,
    1200
  );

  return validatedRequest(response, []);
}

export async function getUserByID(id: string) {
  try {
    const response = await apiRequest<EditableUser>(
      `/users/${id}`,
      'GET',
      true
    );
    response.data.profileID = conditionalParse(response.data.profileID, (n) =>
      n.toString()
    );
    response.data.shiftID = conditionalParse(response.data.shiftID, (n) =>
      n.toString()
    );
    response.data.kitchenIDs = conditionalParse(response.data.kitchenIDs, (k) =>
      k.map((k) => k.toString())
    );
    return validatedRequest<EditableUser>(
      response,
      undefined as any as EditableUser
    );
  } catch (error) {
    reportErrorToSentry(error, 'User Service');
    throw new Error();
  }
}

export async function getProfiles() {
  const response = await apiRequest<(Catalog & GormModel)[]>(
    '/users/profiles',
    'GET',
    true
  );
  return validatedRequest(response, []);
}

export async function getProfileByID(id: number) {
  const response = await apiRequest<Profile>(
    `/users/profile/${id}`,
    'GET',
    true
  );

  return validatedRequest(response, { id: 0, name: '', permissions: [] });
}

export async function createProfile(
  permissions: Permission[],
  prevState: any,
  formData: FormData
) {
  const data = Object.fromEntries(formData);
  const body = {
    name: data.name,
    permissions: permissions.map((p) => ({
      id: p.id,
      writing: p.writing,
    })),
  };

  return await createAction(
    '/users/profile',
    'Hubo un problema al crear el perfil',
    {
      revalidate: site.generalSettings.path,
    },
    body
  );
}

export async function editProfile(
  id: number,
  permissions: Permission[],
  prevState: any,
  formData: FormData
) {
  const data = Object.fromEntries(formData);

  const body = {
    id,
    name: data.name,
    permissions: permissions.map((p) => ({
      id: p.id,
      writing: p.writing,
    })),
  };

  return await editAction(
    '/users/profile',
    'Hubo un problema al editar el perfil',
    [
      site.generalSettings.path,
      serializedPathname(site.editProfile.path, { id }),
    ],
    body,
    undefined,
    true
  );
}

export async function deleteProfile(id: number) {
  const pathname = `/users/profile/${id}`;
  const errorMessage = 'Hubo un problema al eliminar el perfil';
  return await deleteAction(pathname, errorMessage, site.generalSettings.path);
}

export async function getPermisssions() {
  const response = await apiRequest<Permission[]>(
    '/users/permissions',
    'GET',
    true,
    undefined,
    1200
  );

  const data = response.data?.filter((p) => !publicRoutes.includes(p.path));
  response.data = data;

  return validatedRequest(response, []);
}

export async function getShifts() {
  const response = await apiRequest<(Catalog & GormModel)[]>(
    '/users/shifts',
    'GET',
    true
  );
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

export async function getKitchens() {
  const response = await apiRequest<Catalog[]>('/users/kitchens', 'GET', true);

  return validatedRequest(response, []);
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
    [site.shiftsSettings.path, site.usersSettings.path],
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
    [site.kitchensSettings.path, site.usersSettings.path],
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

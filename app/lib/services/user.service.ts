import { unstable_noStore as noStore } from 'next/cache';

import {
  conditionalParse,
  reportErrorToSentry,
  serializeSearchParam,
  validatedRequest,
} from '../utils';

import { DEFAULT_PAGINATION_LIMIT } from '../consts';
import { apiRequest } from '../server-functions';
import { Catalog, GormModel } from '@/app/types/types';
import { DataSource } from '@/app/ui/dashboard/users/table-wrapper';
import { EditableUser } from '@/app/types/user';

// NOTE: Services handles all the business logic and getters. All functions here are intended to be used by actions or server components. Mutating data should be done in actions, so it's important not write use server in this file.

// Probably the getters should be moved to a separate file.

// Getters
export async function getUsers(page: number, query?: string) {
  const limit = DEFAULT_PAGINATION_LIMIT;
  const skip = (page - 1) * limit;
  const search = serializeSearchParam(query || '', ['name', 'email']);
  try {
    const response = await apiRequest<DataSource[]>('/users', 'GET', true);

    return validatedRequest<DataSource[]>(response, []);
  } catch (error) {
    reportErrorToSentry(error, 'User Service');
    throw new Error(); // Used to redirect to error page
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

export async function getKitchens() {
  const response = await apiRequest<(Catalog & GormModel)[]>(
    '/users/kitchens',
    'GET',
    true
  );
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

export async function getClientUsers() {
  try {
  } catch (error) {
    reportErrorToSentry(error, 'User Service');
    throw new Error();
  }
}

export async function getTerminals(id?: string) {
  try {
  } catch (error) {
    reportErrorToSentry(error, 'User Service');
    throw new Error();
  }
}

export async function getAllAssignedTerminals() {
  try {
  } catch (error) {
    reportErrorToSentry(error, 'User Service');
    throw new Error();
  }
}

export async function getTerminalsByUser(id: string) {
  try {
  } catch (error) {
    reportErrorToSentry(error, 'User Service');
    throw new Error();
  }
}

export async function getUserByID(id: string) {
  noStore();
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

// Business logic

/**
 * Checks if the email is already in use by another user. If the userID is provided, it will exclude it from the search.
 */
export async function checkExistingUser(email: string, userID?: string) {
  try {
    const isExist = false;

    if (isExist) {
      return {
        errors: { email: ['Este correo ya está registrado'] },
        message: 'Revisa los campos marcados en rojo',
      };
    }
  } catch (error) {
    reportErrorToSentry(error, 'User Actions');
    return {
      errors: {},
      message:
        'Hubo un problema al verificar el correo, por favor, intente de nuevo o contacte a soporte',
    };
  }
}

export async function updateUserOTP({
  id,
  otp,
  otpExpireDate,
}: {
  id: string;
  otp: string;
  otpExpireDate: Date;
}) {
  try {
  } catch (error) {
    reportErrorToSentry(error, 'User Actions');
    throw new Error();
  }
}

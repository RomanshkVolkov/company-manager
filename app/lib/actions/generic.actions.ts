'use server';
// framework
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// libs

// types and utils
import { ActionState } from '@/app/types/types';
import { auth } from '@/auth';
import { apiRequest } from '@/app/lib/server-functions';
import { commonErrors } from '@/app/lib/consts';
import { reportErrorToSentry, validatedSchema } from '@/app/lib/utils';

// components -- not used section on server or actions

/**
 * POST, PUT and DELETE actions have in common that they verify the response is successful and return a message we don't
 * really need data or validations because these are delegated to the backend to focus the business logic and
 * accountability on the backend.
 */

/**
 *
 * @param pathnameRequest
 * @param errorMessage
 * @param postRequestPaths
 * @param data
 * @param omitRedirect
 * @returns
 */

// generic create action
export async function createAction<T>(
  pathnameRequest: string,
  errorMessage: string,
  postRequestPaths: {
    revalidate?: string;
    redirect?: string;
  },
  data: any,
  omitRedirect: boolean = false
): Promise<ActionState<T>> {
  try {
    const response = await apiRequest<T>(pathnameRequest, 'POST', true, data);

    if (!response.success) {
      return {
        errors: response.schema as T,
        message: response.message.es,
      };
    }

    if (!omitRedirect) {
      if (postRequestPaths.revalidate)
        revalidatePath(postRequestPaths.revalidate);
      if (postRequestPaths.redirect) redirect(postRequestPaths.redirect);
    }

    return {
      errors: {} as T,
      message: '',
      finishedProcess: true,
    };
  } catch (error) {
    console.error(error);
    reportErrorToSentry(error, 'Generic Actions Create');

    return {
      errors: {} as T,
      message: errorMessage,
    };
  }
}

/**
 *
 * @param pathname
 * @param errorMessage
 * @param revalidate
 * @param data
 * @param schema
 * @param omitSchema
 * @returns
 */
// generic updated action
export async function editAction(
  pathname: string,
  errorMessage: string,
  revalidate: string,
  data: any,
  schema: any,
  omitSchema: boolean = false
) {
  try {
    if (!omitSchema) {
      const validatedData = validatedSchema(data, schema);

      if (validatedData.errors) {
        return {
          errors: validatedData.errors,
          message: '',
        };
      }
    }

    const response = await apiRequest(pathname, 'PUT', true, data);

    if (!response.success) {
      return {
        errors: {},
        message: response.message.es,
      };
    }

    revalidatePath(revalidate);
    return {
      errors: {},
      message: '',
      finishedProcess: true,
    };
  } catch (error) {
    reportErrorToSentry(error, 'Generic Actions');
    return {
      errors: {},
      message: errorMessage,
    };
  }
}

/**
 *
 * @param pathname
 * @param errorMessage
 * @param revalidate
 * @returns
 */
// generic delete action
export async function deleteAction(
  pathname: string,
  errorMessage: string,
  revalidate: string
) {
  try {
    const session = await auth();
    if (!session) {
      return commonErrors.SESSION_NOT_FOUND;
    }

    const response = await apiRequest(pathname, 'DELETE', true);

    if (!response.success) {
      return {
        errors: {},
        message: response.message.es,
      };
    }

    revalidatePath(revalidate);

    return {
      errors: {},
      message: '',
    };
  } catch (error) {
    reportErrorToSentry(error, 'Generic Actions');
    return {
      errors: {},
      message: errorMessage,
    };
  }
}

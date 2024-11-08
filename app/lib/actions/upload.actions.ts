'use server';

import { auth } from '@/auth';
import { deleteUpload, processFile } from '@/app/lib/services/upload.service';
import { attachFileToSentry, validateSession } from '@/app/lib/utils';
import { ActionState } from '@/app/types/types';
import { apiRequest } from '../server-functions';

export async function uploadTransactions<T>(
  prevState: any,
  formData: FormData
) {
  try {
    const inputCSV = formData.getAll('file_input_transaction') as File[];
    const comments = formData.get('comments') as string;

    const response = await apiRequest<T>('/transactions', 'POST', true, {});
  } catch (error) {
    formData.getAll('file_input_transaction').forEach(async (file) => {
      if (file instanceof File) {
        await attachFileToSentry(file, error);
      }
    });
  }
}

export async function deleteUploadAction(id: string) {
  try {
    const session = await auth();
    validateSession(session);

    await deleteUpload(id);
  } catch (error: any) {
    console.error(error);
    return {
      errors: {},
      message: error?.message || 'Ha ocurrido un error inesperado',
    };
  }
}

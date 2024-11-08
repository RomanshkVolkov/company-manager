'use server';

import { auth } from '@/auth';
import prisma from '../db/prisma';
import { validateDeposit } from '../services/deposit.service';
import {
  getCurrentUTCTime,
  reportErrorToSentry,
  validateSession,
} from '../utils';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

type FormCreateInputs = {
  clientUserID: string;
  date: string | Date;
  amount: string | number;
};
export async function createDeposit(prevState: any, formData: FormData) {
  try {
    const session = await auth();
    validateSession(session);
    const data = Object.fromEntries(formData) as FormCreateInputs;

    if (data.clientUserID && data.date && data.amount) {
      data.date = new Date(data.date);
      data.amount = parseFloat(data.amount as string);
    }

    const { errors, validatedDeposit } = validateDeposit(data);
    if (!validatedDeposit) {
      return {
        errors,
        message: 'Revisa los campos marcados en rojo',
      };
    }
    const currentDate = getCurrentUTCTime();
    currentDate.setUTCHours(0, 0, 0, 0);
    currentDate.setUTCMinutes(0, 0, 0);
    const createdDeposit = await prisma.deposit.create({
      data: {
        amount: validatedDeposit.amount,
        depositDate: validatedDeposit.date,
        clientID: validatedDeposit.clientUserID,
        userID: session!.user.id,
        comments: validatedDeposit.comments,
        createdAt: currentDate,
      },
    });
    if (!createdDeposit) {
      throw new Error('Error creating deposit');
    }
  } catch (e) {
    reportErrorToSentry(e, 'Deposit Action create');
    return {
      errors: {},
      message:
        'Hubo un problema al crear el deposito, por favor, intente de nuevo o contacte a soporte',
    };
  }
  const path = '/dashboard/deposits';
  revalidatePath(path);
  redirect(path);
}

export async function editDeposit(
  id: string,
  prevState: any,
  formData: FormData
) {
  try {
    const session = await auth();
    validateSession(session);
    const data = Object.fromEntries(formData) as FormCreateInputs;

    if (data.clientUserID && data.date && data.amount) {
      data.date = new Date(data.date.toString().substring(0, 10));
      data.amount = parseFloat(data.amount as string);
    }
    const { errors, validatedDeposit } = validateDeposit(data);
    if (!validatedDeposit) {
      return {
        errors,
        message: 'Revisa los campos marcados en rojo',
      };
    }

    const updatedDeposit = await prisma.deposit.update({
      where: { id },
      data: {
        amount: validatedDeposit.amount,
        depositDate: validatedDeposit.date,
        clientID: validatedDeposit.clientUserID,
        userID: session!.user.id,
        comments: validatedDeposit.comments,
      },
    });
    if (!updatedDeposit) {
      throw new Error('Error updating deposit');
    }
  } catch (e) {
    reportErrorToSentry(e, 'Deposit Action edit');
    return {
      errors: {},
      message:
        'Hubo un problema al editar el deposito, por favor, intente de nuevo o contacte a soporte',
    };
  }
  const path = '/dashboard/deposits';
  revalidatePath(path);
  redirect(path);
}

export async function deleteDepositAction(id: string) {
  try {
    const session = await auth();
    validateSession(session);
    const deposit = await prisma.deposit.delete({
      where: { id },
    });
    if (!deposit) {
      throw new Error('Error deleting deposit');
    }
  } catch (e) {
    reportErrorToSentry(e, 'Deposit Action delete');
    return {
      errors: {},
      message:
        'Hubo un problema al eliminar el deposito, por favor, intente de nuevo o contacte a soporte',
    };
  }
  const path = '/dashboard/deposits';
  revalidatePath(path);
  redirect(path);
}

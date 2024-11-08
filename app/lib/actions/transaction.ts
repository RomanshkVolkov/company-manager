'use server';

import { getTransactions } from '@/app/lib/services/transaction.service';
import { auth } from '@/auth';
import { validateRole } from '../utils';

export async function getExcelTransactions(
  {
    from,
    to,
    query,
  }: {
    from: string;
    to: string;
    query: string;
  },
  _prevState: any,
  _formData: FormData
): Promise<{
  data: any[];
  name: string;
}> {
  const session = await auth();
  if (!session) {
    throw new Error('No session found');
  }
  const isClient = validateRole.client(session!.user.profile.id);
  const name = session!.user.name;
  const transactions = await getTransactions(1, query, from, to, true);

  const data = transactions.data.map((transaction) => {
    const conditionalColumns = isClient
      ? {}
      : {
          'Fecha de carga': transaction.uploadDate,
          'Nombre del archivo': transaction.filename,
        };

    return {
      Referencia: transaction.reference,
      Terminal: transaction.terminal.name,
      'Últimos 4 dígitos': transaction.lastPanDigits,
      'Tipo de tarjeta': transaction.cardType.name,
      Fecha: transaction.date,
      'Monto total': transaction.total,
      Comisión: transaction.commission,
      Estado: transaction.statusTransaction.name,
      ...conditionalColumns,
    };
  });

  return {
    data,
    name,
  };
}

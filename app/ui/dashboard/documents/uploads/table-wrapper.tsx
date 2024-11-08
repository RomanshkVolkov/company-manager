import { DEFAULT_PAGINATION_LIMIT } from '@/app/lib/consts';

import { getUploads } from '@/app/lib/services/upload.service';
import UploadsTable from '@/app/ui/dashboard/transactions/uploads/table';
import { Upload, User } from '@prisma/client';
import { TableColumns } from '@/app/types/types';
import React from 'react';

export type PickDataSource = keyof Upload | 'user' | 'actions';

export type DataSource = Pick<
  Upload & { user: Pick<User, 'name'>; actions: React.ReactNode },
  PickDataSource
>;

export default async function TableWrapper({
  query,
  page,
  date,
}: {
  query?: string;
  page: number;
  date?: { from?: string; to?: string };
}) {
  const uploads = await getUploads(page, query, date?.from, date?.to);

  const totalPages = Math.ceil(uploads.totalItems / DEFAULT_PAGINATION_LIMIT);

  const columns: TableColumns<PickDataSource>[] = [
    { uid: 'filename', name: 'Archivo', align: 'start' },
    { uid: 'type', name: 'Tipo' },
    { uid: 'date', name: 'Fecha de carga' },
    { uid: 'updatedAt', name: 'Fecha de actualización' },
    { uid: 'user', name: 'Usuario carga/actualización' },
    { uid: 'comments', name: 'Comentarios' },
    { uid: 'actions', name: 'Acciones' },
  ];

  return (
    <section className="w-full">
      <UploadsTable
        columns={columns as any}
        data={uploads.data as any}
        totalPages={totalPages}
      />
    </section>
  );
}

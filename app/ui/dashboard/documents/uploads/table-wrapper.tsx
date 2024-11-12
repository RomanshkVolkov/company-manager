// import { DEFAULT_PAGINATION_LIMIT } from '@/app/lib/consts';

// import { TableColumns } from '@/app/types/types';
// import React from 'react';

// export type PickDataSource = 'user' | 'actions';

// export type DataSource = Record<PickDataSource, string>;

// export default async function TableWrapper({
//   query,
//   page,
//   date,
// }: {
//   query?: string;
//   page: number;
//   date?: { from?: string; to?: string };
// }) {
//   const uploads = await getUploads(page, query, date?.from, date?.to);

//    const totalPages = Math.ceil(uploads.totalItems / DEFAULT_PAGINATION_LIMIT);

//  const columns: TableColumns<PickDataSource>[] = [
//  { uid: 'filename', name: 'Archivo', align: 'start' },
//  { uid: 'type', name: 'Tipo' },
//  { uid: 'date', name: 'Fecha de carga' },
//  { uid: 'updatedAt', name: 'Fecha de actualización' },
//  { uid: 'user', name: 'Usuario carga/actualización' },
//  { uid: 'comments', name: 'Comentarios' },
// { uid: 'actions', name: 'Acciones' },
//   ];

//   return (
//     <section className="w-full">
//       {/* <UploadsTable
//         columns={columns as any}
//         data={uploads.data as any}
//
//       /> */}
//     </section>
//   );
// }

import DinamicTable from '@/app/ui/common/table';

import { DEFAULT_PAGINATION_LIMIT, site } from '@/app/lib/consts';
import { TableColumns } from '@/app/types/types';
import { auth } from '@/auth';
import { getDocuments } from '@/app/lib/actions/document.actions';

export type PickDataSource =
  | 'id'
  | 'name'
  | 'table'
  | 'updatedAt'
  | 'createdAt'
  | 'actions';

export type DataSource = {
  id: number;
  name: string;
  table: string;
  updatedAt: string;
  createdAt: string;
};

export default async function TableWrapper({
  query,
  page,
  date,
}: {
  query?: string;
  page: number;
  date?: { from?: string; to?: string };
}) {
  const { data } = await getDocuments<DataSource>();

  const totalPages = Math.ceil(data.length / DEFAULT_PAGINATION_LIMIT);

  const columns: TableColumns<PickDataSource>[] = [
    { uid: 'name', name: 'Nombre', align: 'start' },
    { uid: 'table', name: 'Tabla', align: 'start' },
    { uid: 'updatedAt', name: 'Actualizado', align: 'start' },
    { uid: 'createdAt', name: 'Creado', align: 'start' },
    { uid: 'actions', name: 'Acciones', align: 'center' },
  ];

  const renderFunction = (item: DataSource, columnKey: string) => {};

  return (
    <DinamicTable
      columns={columns as any}
      data={data}
      totalPages={totalPages}
      cellActions={{
        editPath: site.setDocument.path,
        deletePath: site.deleteDocument.path,
      }}
    />
  );
}

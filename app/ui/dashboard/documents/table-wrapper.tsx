import DinamicTable from '@/app/ui/common/table';

import { site } from '@/app/lib/consts';
import { TableColumns } from '@/app/types/types';
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

export default async function TableWrapper() {
  const { data } = await getDocuments<DataSource>();

  const columns: TableColumns<PickDataSource>[] = [
    { uid: 'name', name: 'Nombre', align: 'start' },
    { uid: 'table', name: 'Tabla', align: 'start' },
    { uid: 'updatedAt', name: 'Actualizado', align: 'start' },
    { uid: 'createdAt', name: 'Creado', align: 'start' },
    { uid: 'actions', name: 'Acciones', align: 'center' },
  ];

  return (
    <DinamicTable
      columns={columns as any}
      data={data}
      cellActions={{
        editPath: site.setDocument.path,
        deletePath: site.deleteDocument.path,
      }}
    />
  );
}

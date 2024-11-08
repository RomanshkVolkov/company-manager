import { DEFAULT_PAGINATION_LIMIT } from '@/app/lib/consts';
import { TableColumns } from '@/app/types/types';
import { getProfiles } from '@/app/lib/services/user.service';
import DinamicTable from '@/app/ui/common/table';

export type PickDataSource = 'id' | 'name' | 'createdAt' | 'updatedAt';

export type DataSource = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export default async function TableWrapper({
  query,
  page,
}: {
  query?: string;
  page: number;
  date?: { from?: string; to?: string };
}) {
  const { data } = await getProfiles();
  const totalPages = Math.ceil((data.length || 1) / DEFAULT_PAGINATION_LIMIT);

  const columns: TableColumns<PickDataSource | 'actions'>[] = [
    { uid: 'name', name: 'Nombre' },
    { uid: 'updatedAt', name: 'Actualizado' },
    { uid: 'createdAt', name: 'Creado' },
    { uid: 'actions', name: 'Acciones', align: 'end' },
  ];

  return (
    <div className="w-full">
      <DinamicTable
        columns={columns}
        data={data}
        totalPages={totalPages}
        cellActions={{
          editPath: '#',
          deletePath: '#',
        }}
      />
    </div>
  );
}

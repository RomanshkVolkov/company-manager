// framework

// libs

// types and utils
import { DEFAULT_PAGINATION_LIMIT, site } from '@/app/lib/consts';
import { TableColumns } from '@/app/types/types';
import { getShifts } from '@/app/lib/services/user.service';
export type PickDataSource = 'id' | 'name' | 'updatedAt' | 'createdAt';

// components
import DinamicTable from '@/app/ui/common/table';

export type DataSource = {
  id: number;
  name: string;
  updatedAt: Date;
  createdAt: Date;
};

export default async function TableWrapper({
  query,
  page,
}: {
  query?: string;
  page: number;
  date?: { from?: string; to?: string };
}) {
  const { data } = await getShifts();
  const totalPages = Math.ceil((data.length || 1) / DEFAULT_PAGINATION_LIMIT);

  const columns: TableColumns<PickDataSource | 'actions'>[] = [
    { uid: 'name', name: 'Nombre' },
    { uid: 'updatedAt', name: 'Actualizado' },
    { uid: 'createdAt', name: 'Creado' },
    { uid: 'actions', name: 'Acciones', align: 'center' },
  ];

  return (
    <div className="w-full">
      <DinamicTable
        columns={columns}
        data={data}
        totalPages={totalPages}
        cellActions={{
          editPath: site.settings.modals.editShift,
          deletePath: site.settings.modals.actionRemove('delete-shift'),
        }}
      />
    </div>
  );
}

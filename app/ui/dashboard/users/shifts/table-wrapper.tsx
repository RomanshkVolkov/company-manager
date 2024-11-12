// framework

// libs

// types and utils
import { site } from '@/app/lib/consts';
import { TableColumns } from '@/app/types/types';
import { getShifts } from '@/app/lib/actions/user.actions';
export type PickDataSource = 'id' | 'name' | 'updatedAt' | 'createdAt';

// components
import DinamicTable from '@/app/ui/common/table';
import { serializedPathname } from '@/app/lib/utils';

export type DataSource = {
  id: number;
  name: string;
  updatedAt: Date;
  createdAt: Date;
};

export default async function TableWrapper() {
  const { data } = await getShifts();

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
        cellActions={{
          editPath: site.setShift.path,
          deletePath: serializedPathname(site.settingsActionRemove.path, {
            slugAction: 'delete-shift',
          }),
        }}
      />
    </div>
  );
}

import { TableColumns } from '@/app/types/types';
import { getProfiles } from '@/app/lib/actions/user.actions';
import DynamicTable from '@/app/ui/common/table';
import { site } from '@/app/lib/consts';

export type PickDataSource = 'id' | 'name' | 'createdAt' | 'updatedAt';

export type DataSource = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export default async function TableWrapper() {
  const { data } = await getProfiles();

  const columns: TableColumns<PickDataSource | 'actions'>[] = [
    { uid: 'name', name: 'Nombre' },
    { uid: 'updatedAt', name: 'Actualizado' },
    { uid: 'createdAt', name: 'Creado' },
    { uid: 'actions', name: 'Acciones', align: 'end' },
  ];

  return (
    <div className="w-full">
      <DynamicTable
        columns={columns}
        data={data}
        cellActions={{
          editPath: site.editProfile.path,
          deletePath: site.deleteProfile.path,
        }}
      />
    </div>
  );
}

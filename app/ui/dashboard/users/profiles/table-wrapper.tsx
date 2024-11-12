import { TableColumns } from '@/app/types/types';
import { getProfiles } from '@/app/lib/actions/user.actions';
import DinamicTable from '@/app/ui/common/table';
import { site } from '@/app/lib/consts';

export type PickDataSource = 'id' | 'name' | 'createdAt' | 'updatedAt';

export type DataSource = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

export default async function TableWrapper({
  _query,
  _page,
}: {
  _query?: string;
  _page: number;
  date?: { from?: string; to?: string };
}) {
  const { data } = await getProfiles();

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
        cellActions={{
          editPath: site.editProfile.path,
          deletePath: '#',
        }}
      />
    </div>
  );
}

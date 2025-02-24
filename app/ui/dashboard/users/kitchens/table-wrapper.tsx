import { site } from '@/app/lib/consts';
import { TableColumns } from '@/app/types/types';
import { getKitchens } from '@/app/lib/actions/user.actions';
import DynamicTable from '@/app/ui/common/table';
import { serializedPathname } from '@/app/lib/utils';

export type PickDataSource = 'id' | 'name' | 'updatedAt' | 'createdAt';

export type DataSource = {
  id: number;
  name: string;
  updatedAt: string;
  createdAt: string;
};

export default async function TableWrapper({
  _query,
  _page,
}: {
  _query?: string;
  _page: number;
  date?: { from?: string; to?: string };
}) {
  const { data } = await getKitchens();

  const columns: TableColumns<PickDataSource | 'actions'>[] = [
    { uid: 'name', name: 'Nombre' },
    { uid: 'updatedAt', name: 'Actualizado' },
    { uid: 'createdAt', name: 'Creado' },
    { uid: 'actions', name: 'Acciones', align: 'center' },
  ];

  return (
    <div className="w-full">
      <DynamicTable
        columns={columns}
        data={data as any as DataSource[]}
        cellActions={{
          editPath: site.editKitchen.path,
          deletePath: serializedPathname(site.settingsActionRemove.path, {
            slugAction: 'delete-kitchen',
          }),
        }}
      />
    </div>
  );
}

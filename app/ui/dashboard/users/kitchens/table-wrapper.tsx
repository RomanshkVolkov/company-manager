import { DEFAULT_PAGINATION_LIMIT, site } from '@/app/lib/consts';
import { TableColumns } from '@/app/types/types';
import { getKitchens } from '@/app/lib/services/user.service';
import DinamicTable from '@/app/ui/common/table';
import { serializedPathname } from '@/app/lib/utils';

export type PickDataSource = 'id' | 'name' | 'updatedAt' | 'createdAt';

export type DataSource = {
  id: number;
  name: string;
  updatedAt: string;
  createdAt: string;
};

export default async function TableWrapper({
  query,
  page,
}: {
  query?: string;
  page: number;
  date?: { from?: string; to?: string };
}) {
  const { data } = await getKitchens();
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
        data={data as any as DataSource[]}
        totalPages={totalPages}
        cellActions={{
          editPath: site.setKitchen.path,
          deletePath: serializedPathname(site.settingsActionRemove.path, {
            slugAction: 'delete-kitchen',
          }),
        }}
      />
    </div>
  );
}

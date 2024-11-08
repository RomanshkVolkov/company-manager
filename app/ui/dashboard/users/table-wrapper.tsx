import { DEFAULT_PAGINATION_LIMIT, site } from '@/app/lib/consts';
import { TableColumns } from '@/app/types/types';
import { getUsers } from '@/app/lib/services/user.service';
import DinamicTable from '../../common/table';
import { serializedPathname } from '@/app/lib/utils';

export type PickDataSource =
  | 'id'
  | 'name'
  | 'username'
  | 'email'
  | 'profile'
  | 'isActive';

export type DataSource = {
  id: number;
  username: string;
  name: string;
  email: string;
  isActive: boolean;
  profile: {
    id: number;
    name: string;
    slug: string;
  };
};

export default async function TableWrapper({
  query,
  page,
}: {
  query?: string;
  page: number;
  date?: { from?: string; to?: string };
}) {
  const { data } = await getUsers(page, query);
  const totalPages = Math.ceil((data.length || 1) / DEFAULT_PAGINATION_LIMIT);

  const columns: TableColumns<PickDataSource | 'actions'>[] = [
    { uid: 'name', name: 'Nombre' },
    { uid: 'username', name: 'Usuario' },
    { uid: 'email', name: 'Email' },
    { uid: 'profile', name: 'Perfil', align: 'end' },
    { uid: 'isActive', name: 'Estado', align: 'center' },
    { uid: 'actions', name: 'Acciones', align: 'end' },
  ];

  return (
    <div className="w-full">
      <DinamicTable
        columns={columns}
        data={data}
        totalPages={totalPages}
        cellActions={{
          editPath: site.setUser.path,
          deletePath: serializedPathname(site.settingsActionRemove.path, {
            slugAction: 'delete-user',
          }),
        }}
      />
    </div>
  );
}

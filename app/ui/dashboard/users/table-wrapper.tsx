import { site } from '@/app/lib/consts';
import { TableColumns } from '@/app/types/types';
import { getUsers } from '@/app/lib/actions/user.actions';
import DynamicTable from '../../common/table';
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

export default async function TableWrapper() {
  const { data } = await getUsers();

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
      <DynamicTable
        columns={columns}
        data={data}
        cellActions={{
          editPath: site.editUser.path,
          deletePath: serializedPathname(site.settingsActionRemove.path, {
            slugAction: 'delete-user',
          }),
        }}
      />
    </div>
  );
}

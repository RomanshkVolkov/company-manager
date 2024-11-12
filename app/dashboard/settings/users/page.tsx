// framework
import { Metadata } from 'next';

// libs

// types and utils

// components
import MainWrapper from '@/app/ui/common/main-wrapper';
import TableWrapper from '@/app/ui/dashboard/users/table-wrapper';

export const metadata: Metadata = {
  title: 'Usuarios',
};

export default function Users() {
  return (
    <MainWrapper
      title="Usuarios"
      createItemInfo={{
        href: '/dashboard/settings/users/create',
        label: 'Crear usuario',
      }}
    >
      <TableWrapper />
    </MainWrapper>
  );
}

import { site } from '@/app/lib/consts';
import MainWrapper from '@/app/ui/common/main-wrapper';
import TableWrapper from '@/app/ui/dashboard/users/shifts/table-wrapper';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cocinas',
};

export default function kitchens({
  params,
}: {
  params: {
    query?: string;
    page?: string;
    from?: string;
    to?: string;
  };
}) {
  const page = params?.page ? +params.page : 1;
  const { from, to } = params;

  return (
    <MainWrapper
      title="Turnos"
      createItemInfo={{
        href: site.settings.modals.createShift,
        label: 'Registrar Turno',
      }}
    >
      <TableWrapper query={params?.query} page={page} date={{ from, to }} />
    </MainWrapper>
  );
}

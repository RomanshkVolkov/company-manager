// framework
import { Metadata } from 'next';

// libs

// types and utils
import { getDocumentTables } from '@/app/lib/actions/document.actions';

// components
import MainWrapper from '@/app/ui/common/main-wrapper';
import TableWrapper from '@/app/ui/dashboard/data/table-wrapper';

export const metadata: Metadata = {
  title: 'Retiros',
};

export default async function Data({
  searchParams,
}: {
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  // filters and pagination
  const { page, query } = await searchParams;
  const { data } = await getDocumentTables();

  return (
    <MainWrapper title="Datos">
      <div className="w-full">
        <TableWrapper query={query || ''} page={+(page || 1)} data={data} />
      </div>
    </MainWrapper>
  );
}

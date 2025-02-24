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

export default async function Data() {
  // filters and pagination
  const { data } = await getDocumentTables();

  return (
    <MainWrapper title="Datos">
      <div className="w-full">
        <TableWrapper data={data} />
      </div>
    </MainWrapper>
  );
}

import TableWrapper from '@/app/ui/dashboard/documents/table-wrapper';
import { Metadata } from 'next';
import { site } from '@/app/lib/consts';
import MainWrapper from '@/app/ui/common/main-wrapper';

export const metadata: Metadata = {
  title: 'Documentos',
};

export default function Documents() {
  // filters and pagination
  return (
    <MainWrapper
      title="Documentos"
      createItemInfo={{
        label: site.createDocument.name,
        href: site.createDocument.path,
      }}
    >
      <div className="w-full">
        <TableWrapper />
      </div>
    </MainWrapper>
  );
}

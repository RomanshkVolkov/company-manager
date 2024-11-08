import TableWrapper from '@/app/ui/dashboard/documents/table-wrapper';
import { authorizations } from '@/app/lib/server-functions';
import { Metadata } from 'next';
import { site } from '@/app/lib/consts';
import MainWrapper from '@/app/ui/common/main-wrapper';

export const metadata: Metadata = {
  title: 'Documentos',
};

export default async function Documents({
  searchParams,
}: {
  searchParams: Promise<{
    query?: string;
    page?: string;
    from?: string;
    to?: string;
  }>;
}) {
  // filters and pagination
  const { page, query, from, to } = await searchParams;

  // server util to validate user authorizations
  const { isWritable } = await authorizations('/dashboard/deposits');
  return (
    <MainWrapper
      title="Documentos"
      createItemInfo={{
        label: site.createDocument.name,
        href: site.createDocument.path,
      }}
    >
      <div className="w-full">
        <TableWrapper
          query={query || ''}
          page={+(page || 1)}
          date={{ from, to }}
        />
      </div>
    </MainWrapper>
  );
}

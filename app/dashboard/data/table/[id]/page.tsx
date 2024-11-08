import { getDocumentTableById } from '@/app/lib/actions/document.actions';
import { site } from '@/app/lib/consts';
import MainWrapper from '@/app/ui/common/main-wrapper';
import DinamicTable from '@/app/ui/common/table';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ search?: string; page?: string }>;
};
export default async function Page({ params, searchParams }: Props) {
  const { id } = await params;
  const { search, page } = await searchParams;
  const { data } = await getDocumentTableById(+id);
  const totalPages = Math.ceil((data.table.length || 1) / 10);

  const createLink = site.uploadDocument.path.replace(':documentID', id);
  const linksToPrefetch = [createLink];

  return (
    <MainWrapper
      title={data.document.name}
      breadcrumbList={[
        { label: 'Datos', href: site.data.path },
        { label: `Documento - ${data.document.name}`, href: '#', active: true },
      ]}
      createItemInfo={{
        href: createLink,
        label: 'Cargar datos',
      }}
      linksToPrefetch={linksToPrefetch}
    >
      <div className="w-full">
        <DinamicTable
          columns={data.columns as any}
          data={data.table}
          totalPages={totalPages}
        />
      </div>
    </MainWrapper>
  );
}

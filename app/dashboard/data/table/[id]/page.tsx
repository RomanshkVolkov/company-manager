import { getDocumentTableById } from '@/app/lib/actions/document.actions';
import { site } from '@/app/lib/consts';
import MainWrapper from '@/app/ui/common/main-wrapper';
import DinamicTable from '@/app/ui/common/table';

type Props = {
  params: Promise<{ id: string }>;
};
export default async function Page({ params }: Props) {
  const { id } = await params;
  const { data } = await getDocumentTableById(+id);

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
        <DinamicTable columns={data.columns as any} data={data.table} />
      </div>
    </MainWrapper>
  );
}

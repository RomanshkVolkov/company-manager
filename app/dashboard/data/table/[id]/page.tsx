// framework

// libs

// types and utils
import { getDocumentTableById } from '@/app/lib/actions/document.actions';

// components
import DynamicTable from '@/app/ui/common/table';
import MainWrapper from '@/app/ui/common/main-wrapper';
import { site } from '@/app/lib/consts';
import { serializedPathname } from '@/app/lib/utils';

// nextjs params
// export const revalidate = 3600;
// export const dynamic = 'force-dynamic';
// export const dynamicParams = true;

type Props = {
  params: Promise<{ id: string }>;
};
export default async function Page({ params }: Props) {
  const { id } = await params;
  const { data } = await getDocumentTableById(+id);

  const cols = [...data.columns, { uid: 'actions', name: 'Acciones' }];

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
        <DynamicTable
          columns={cols as any}
          data={data.table}
          cellActions={{
            editPath: serializedPathname(site.editDocumentRecord.path, {
              documentID: data.document.id,
            }),
            deletePath: serializedPathname(site.deleteDocumentRecord.path, {
              documentID: data.document.id,
            }),
          }}
        />
      </div>
    </MainWrapper>
  );
}

// framework

// libs

// types and utils
import { getDocumentById } from '@/app/lib/actions/document.actions';
import { site } from '@/app/lib/consts';

// components
import DocumentFieldsProvider from '@/app/context/document-fields';
import Form from '@/app/ui/dashboard/documents/edit-form';
import MainWrapper from '@/app/ui/common/main-wrapper';

type PageProps = {
  params: Promise<{ id: string }>;
};
export default async function DocumentEditPage({ params }: PageProps) {
  const { id } = await params;

  const document = await getDocumentById(+id);

  return (
    <MainWrapper
      title="Editar documento"
      breadcrumbList={[
        {
          href: site.documentsSettings.path,
          label: site.documentsSettings.name,
        },
        {
          href: '#',
          label: 'Editar documento',
          active: true,
        },
      ]}
    >
      <div className="w-full">
        <DocumentFieldsProvider>
          <Form document={document.data} />
        </DocumentFieldsProvider>
      </div>
    </MainWrapper>
  );
}

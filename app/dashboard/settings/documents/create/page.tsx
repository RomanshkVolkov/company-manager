// framework
import { Metadata } from 'next';

// libs

// types and utils
import { site } from '@/app/lib/consts';

// components
import DocumentFieldsProvider from '@/app/context/document-fields';
import Form from '@/app/ui/dashboard/documents/create-form';
import MainWrapper from '@/app/ui/common/main-wrapper';

export const metadata: Metadata = {
  title: 'Definir documento',
};

export default function Page() {
  return (
    <MainWrapper
      title="Definir documento"
      breadcrumbList={[
        {
          label: site.documentsSettings.name,
          href: site.documentsSettings.path,
        },
        { label: 'Crear', href: '#', active: true },
      ]}
    >
      <div className="w-full">
        <DocumentFieldsProvider>
          <Form />
        </DocumentFieldsProvider>
      </div>
    </MainWrapper>
  );
}

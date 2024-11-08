'use client';

// framework
import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';

// libs
import { CircleStackIcon } from '@heroicons/react/24/outline';

// types and utils
import { Document, PickDataSourceDocumentFields } from '@/app/types/documents';
import { TableColumns } from '@/app/types/types';
import { uploadDocument } from '@/app/lib/actions/document.actions';

// components
import Fields from '@/app/ui/common/fields';
import File from '@/app/ui/common/file';
import FormGroup from '@/app/ui/common/form-group';
import FormWrapper from '@/app/ui/common/form-wrapper';
import DinamicTable from '@/app/ui/common/table';
import SimpleTabs from '@/app/ui/common/simple-tabs';
import useEndActionModalProcess from '@/app/hooks/use-end-action-modal-process';

type Props = {
  document: Document;
};
export default function UploadForm({ document }: Props) {
  const searchParams = useSearchParams();
  const documentID = searchParams.get('documentID');

  const initialState = {
    message: '',
    errors: {} as Record<'file', string[]>,
    finishedProcess: false,
  };

  const bindAction = uploadDocument.bind(null, +(documentID ?? '0'));
  const [state, dispatch] = useActionState(bindAction, initialState);
  useEndActionModalProcess({ signal: state.finishedProcess });

  const form = (
    <FormGroup title="Excel" icon={CircleStackIcon}>
      <Fields>
        <File id="excel" accept="text/xlsx" />
      </Fields>
    </FormGroup>
  );

  const informationTabColumns: TableColumns<PickDataSourceDocumentFields>[] = [
    { uid: 'documentKey', name: 'Campo' },
    {
      uid: 'typeField',
      name: 'Tipo de campo',
    },
  ];

  const informationTabPages = Math.ceil((document.fields.length || 1) / 5);
  const informationTab = (
    <div>
      <h2 className="mb-2 text-2xl font-bold">Información del archivo</h2>
      <div className="w-full gap-4">
        <DinamicTable
          columns={informationTabColumns}
          data={document.fields}
          totalPages={informationTabPages}
          limitRecordsPerPage={5}
        />
      </div>
    </div>
  );

  const tabs = [
    {
      title: 'Cargar archivo',
      content: form,
    },
    {
      title: 'Información',
      content: informationTab,
    },
  ];

  return (
    <FormWrapper
      hrefCancelled="back()"
      dispatch={dispatch}
      message={state.message}
    >
      <SimpleTabs tabs={tabs} />
    </FormWrapper>
  );
}

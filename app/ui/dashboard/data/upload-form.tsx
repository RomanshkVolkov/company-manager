'use client';

// framework
import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';

// libs
import { CircleStackIcon } from '@heroicons/react/24/outline';

// types and utils
import { Document, PickDataSourceDocumentFields } from '@/app/types/documents';
import { APIResponse, TableColumns } from '@/app/types/types';
import { uploadDocument } from '@/app/lib/actions/document.actions';

// components
import DinamicTable from '@/app/ui/common/table';
import Fields from '@/app/ui/common/fields';
import File from '@/app/ui/common/file';
import FormGroup from '@/app/ui/common/form-group';
import FormWrapper from '@/app/ui/common/form-wrapper';
import SimpleTabs from '@/app/ui/common/simple-tabs';
import useEndActionModalProcess from '@/app/hooks/use-end-action-modal-process';

type Props = {
  document: APIResponse<Document>;
};
export default function UploadForm({ document }: Props) {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const initialState = {
    message: '',
    errors: {} as Record<'file', string[]>,
    finishedProcess: false,
  };

  const bindAction = uploadDocument.bind(null, +(id ?? '0'));
  const [state, dispatch] = useActionState(bindAction, initialState);
  useEndActionModalProcess({ signal: state.finishedProcess });

  const form = (
    <div className="min-h-[324px] w-full">
      <FormGroup title="Excel" icon={CircleStackIcon}>
        <Fields>
          <File id="excel" accept="text/xlsx" />
        </Fields>
      </FormGroup>
    </div>
  );

  const detailsTabColumns: TableColumns<PickDataSourceDocumentFields>[] = [
    { uid: 'documentKey', name: 'Campo' },
    {
      uid: 'typeField',
      name: 'Tipo de campo',
    },
  ];

  const detailsTabPages = Math.ceil((document.data.fields.length || 1) / 5);
  const detailsTab = (
    <div className="min-h-[324px] w-full">
      <h2 className="mb-2 text-2xl font-bold">Detalles del archivo</h2>
      <div className="w-full gap-4">
        <DinamicTable
          columns={detailsTabColumns}
          data={document.data.fields}
          totalPages={detailsTabPages}
          limitRecordsPerPage={5}
        />
      </div>
    </div>
  );

  const tipsInformationTabs = [
    'Por defecto, las filas repetidas no se insertarán en la base de datos.',
    'Estas se considerarán como duplicadas sin importar si se cargan en el mismo archivo o no.',
    'Una fila duplicada es aquella que tiene las mismas columnas iguales y aparece más de una vez en el archivo u otro archivo.',
    '¿Qué pasa si cargo un archivo más de una vez?: Si se carga un archivo más de una vez, las filas duplicadas no se insertarán en la base de datos. Y se cerrara el este menú de carga como si se hubiera cargado correctamente.',
  ];
  const informationTab = (
    <div className="min-h-[324px] w-full">
      <h2 className="mb-4 text-2xl font-bold">Información de carga</h2>
      <div className="w-full gap-4">
        {tipsInformationTabs.map((tip, index) => (
          <p key={index} className="mb-2">
            {tip}
          </p>
        ))}
      </div>
    </div>
  );

  const tabs = [
    {
      title: 'Cargar archivo',
      content: form,
    },
    {
      title: 'Detalles',
      content: detailsTab,
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

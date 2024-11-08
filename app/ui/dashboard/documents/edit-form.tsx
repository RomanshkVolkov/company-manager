'use client';

// framework
import { useActionState, useContext, useEffect } from 'react';

// libs
import { CircleStackIcon, TableCellsIcon } from '@heroicons/react/24/outline';
import { Input } from '@nextui-org/react';

// types and utils
import { ActionState } from '@/app/types/types';
import {
  CreateDocument,
  DocumentStrings,
  EditableDocumentWithFields,
} from '@/app/types/forms';
import { createDocument } from '@/app/lib/actions/document.actions';
import { hasItems } from '@/app/lib/utils';
import { site } from '@/app/lib/consts';

// components
import FormWrapper from '@/app/ui/common/form-wrapper';
import FormGroup from '@/app/ui/common/form-group';
import Fields from '@/app/ui/common/fields';
import DocumentFieldsForm from './document-fields-form';
import { DocumentFieldsContext } from '@/app/context/document-fields';

type Props = {
  document: EditableDocumentWithFields;
};
export default function Form({ document }: Props) {
  const initialState: ActionState<Record<DocumentStrings, string[]>> = {
    message: '',
    errors: {} as Record<DocumentStrings, string[]>,
    finishedProcess: false,
  };

  const { fields, setFields } = useContext(DocumentFieldsContext);

  useEffect(() => {
    setFields(document.fields);
  }, []);

  const bindAction = createDocument.bind(null, fields);
  const [state, dispatch] = useActionState(createDocument, initialState);

  return (
    <FormWrapper
      dispatch={dispatch}
      message={state?.message}
      hrefCancelled={site.documentsSettings.path}
    >
      <FormGroup title="Datos generales" icon={CircleStackIcon}>
        <Fields>
          <div className="mb-4 md:mb-0 md:w-1/2">
            <Input
              id="name"
              name="name"
              label="Nombre"
              defaultValue={document.name as string}
              isInvalid={hasItems(state.errors?.name)}
              errorMessage={state.errors?.name}
            />
          </div>
          <div className="mb-4 md:mb-0 md:w-1/2">
            <Input
              id="table"
              name="table"
              label="Nombre de la tabla"
              disabled
              description="Identificador único de la tabla en la base de datos"
              defaultValue={document.table as string}
              isInvalid={hasItems(state.errors.table)}
              errorMessage={state.errors?.table}
            />
          </div>
        </Fields>
      </FormGroup>
      <FormGroup title="Columnas" icon={TableCellsIcon}>
        <Fields>
          <DocumentFieldsForm />
        </Fields>
      </FormGroup>
    </FormWrapper>
  );
}

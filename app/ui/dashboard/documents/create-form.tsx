'use client';

// framework
import { useActionState, useContext } from 'react';

// libs
import { CircleStackIcon, TableCellsIcon } from '@heroicons/react/24/outline';
import { Input } from '@nextui-org/react';

// types and utils
import { ActionState } from '@/app/types/types';
import { DocumentStrings } from '@/app/types/forms';
import { createDocument } from '@/app/lib/actions/document.actions';
import { site } from '@/app/lib/consts';

// components
import FormWrapper from '@/app/ui/common/form-wrapper';
import FormGroup from '@/app/ui/common/form-group';
import Fields from '@/app/ui/common/fields';
import { hasItems } from '@/app/lib/utils';
import DocumentFields from './document-fields-form';
import { DocumentFieldsContext } from '@/app/context/document-fields';

export default function Form() {
  const initialState: ActionState<Record<DocumentStrings, string[]>> = {
    message: '',
    errors: {} as Record<DocumentStrings, string[]>,
    finishedProcess: false,
  };

  const { fields } = useContext(DocumentFieldsContext);
  const bindAction = createDocument.bind(null, fields);
  const [state, dispatch] = useActionState(bindAction, initialState);

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
              isInvalid={hasItems(state.errors?.name)}
              errorMessage={state.errors?.name}
            />
          </div>
          <div className="mb-4 md:mb-0 md:w-1/2">
            <Input
              id="table"
              name="table"
              label="Nombre de la tabla"
              isInvalid={hasItems(state.errors?.table)}
              errorMessage={state.errors?.table}
            />
          </div>
        </Fields>
      </FormGroup>
      <FormGroup title="Columnas" icon={TableCellsIcon}>
        <Fields>
          <div className="flex w-full flex-col justify-center">
            <DocumentFields />
          </div>
        </Fields>
      </FormGroup>
    </FormWrapper>
  );
}

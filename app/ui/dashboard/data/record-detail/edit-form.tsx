'use client';

// framework
import { useActionState, useCallback } from 'react';

// libs
import { DatePicker, Input } from '@nextui-org/react';
import { TableCellsIcon } from '@heroicons/react/24/outline';

// types and utils
import { editRecordDetail } from '@/app/lib/actions/document.actions';
import { hasItems } from '@/app/lib/utils';

// components
import { DocumentRowRecord } from '@/app/types/documents';
import Fields from '@/app/ui/common/fields';
import FormGroup from '@/app/ui/common/form-group';
import FormWrapper from '@/app/ui/common/form-wrapper';
import useEndActionModalProcess from '@/app/hooks/use-end-action-modal-process';

function renderInput({
  field,
  documentKey: label,
  typeField,
  value,
  errors,
}: DocumentRowRecord & { errors?: string[] }) {
  if (typeField.includes('NVARCHAR')) {
    return (
      <Input
        name={field}
        label={label}
        defaultValue={value}
        isInvalid={hasItems(errors)}
        errorMessage={errors?.join(', ')}
      />
    );
  }
  if (typeField.includes('DECIMAL') || typeField.includes('INT')) {
    return (
      <Input
        name={field}
        label={label}
        defaultValue={value}
        type="number"
        isInvalid={hasItems(errors)}
        errorMessage={errors?.join(', ')}
      />
    );
  }
  if (typeField === 'DATETIME') {
    return <DatePicker name={field} label={label} />;
  }
}

type Props = {
  documentID: string;
  id: number;
  fields: DocumentRowRecord[];
};
export default function EditRecordDetailForm({
  documentID,
  id,
  fields,
}: Props) {
  const initialState = {
    errors: {} as Record<string, string[]>,
    message: '',
    finishedProcess: false,
  };

  const bindAction = editRecordDetail.bind(null, +documentID, +id, fields);
  const [state, dispatch] = useActionState(bindAction, initialState);

  useEndActionModalProcess({ signal: state.finishedProcess });

  const form = useCallback(
    () => (
      <Fields>
        <div className="flex w-full flex-wrap gap-2">
          {fields.map((field) => (
            <div className="w-full" key={`${field.id}-${field.field}`}>
              {renderInput({
                id: field.id,
                field: field.field,
                documentKey: field.documentKey,
                typeField: field.typeField,
                value: field.value,
                errors: state?.errors
                  ? ((state!.errors[field.field] ?? []) as string[])
                  : [],
              })}
            </div>
          ))}
        </div>
      </Fields>
    ),
    [fields, state]
  );

  return (
    <FormWrapper dispatch={dispatch} hrefCancelled="back()">
      <FormGroup title="Datos del registro del documento" icon={TableCellsIcon}>
        {form()}
      </FormGroup>
    </FormWrapper>
  );
}

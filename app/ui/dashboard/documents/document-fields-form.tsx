'use client';

// framework
import { useContext } from 'react';
import { useRouter } from 'next/navigation';

// libs
import { Button, Input } from '@nextui-org/react';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

// types and utils
import { DATABASE_TYPES, site } from '@/app/lib/consts';
import { DocumentFields } from '@/app/types/forms';
import { TableColumns } from '@/app/types/types';

// components
import TableByRenderFunction from '@/app/ui/common/table-by-renderfunction';
import { DocumentFieldsContext } from '@/app/context/document-fields';
import InputSelect from '@/app/ui/common/input-select';
import { serializedPathname } from '@/app/lib/utils';

type PickDataSource = 'field' | 'typeField' | 'documentKey' | 'delete';
export default function DocumentFieldsForm() {
  const { fields, setFields } = useContext(DocumentFieldsContext);
  const { push } = useRouter();

  const handleChangueValue = (
    key: PickDataSource,
    value: string,
    id: number
  ) => {
    setFields((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, [key]: value };
        }
        return item;
      })
    );
  };

  const createField = () => {
    setFields((prev) => [
      ...prev,
      {
        id: -(prev.length + 1),
        field: '',
        typeField: '',
        documentKey: '',
      },
    ]);
  };

  const deleteField = (id: number, field: string) => {
    if (id < 0) {
      setFields((prev) => prev.filter((item) => item.id !== id));
      return;
    }
    push(
      serializedPathname(site.deleteDocumentField.path, {
        id,
        field,
      })
    );
  };

  const columns: TableColumns<PickDataSource>[] = [
    { uid: 'field', name: 'Columna', align: 'start' },
    { uid: 'typeField', name: 'Tipo de columna', align: 'start' },
    { uid: 'documentKey', name: 'Clave del documento', align: 'start' },
    { uid: 'delete', name: 'Eliminar', align: 'center' },
  ];

  const renderFunction = (item: DocumentFields, columnKey: PickDataSource) => {
    switch (columnKey) {
      case 'field':
        return (
          <Input
            id="field"
            label="Columna"
            variant="underlined"
            defaultValue={item.field}
            {...(item.id > 0 && { disabled: true })}
            required
            min={3}
            onChange={(e) =>
              handleChangueValue('field', e.target.value, item.id)
            }
          />
        );
      case 'typeField':
        return (
          <InputSelect
            id="typeField"
            label="Tipo de columna"
            variant="underlined"
            options={DATABASE_TYPES}
            defaultValue={String(
              DATABASE_TYPES.find((type) => type.name === item.typeField)?.id
            )}
            disabled={item.id > 0}
            onChange={(value) => {
              handleChangueValue('typeField', value.name, item.id);
            }}
          />
        );
      case 'documentKey':
        return (
          <Input
            id="documentKey"
            label="Clave del documento"
            variant="underlined"
            defaultValue={item.documentKey}
            required
            min={3}
            onChange={(e) =>
              handleChangueValue('documentKey', e.target.value, item.id)
            }
          />
        );
      case 'delete':
        return (
          <Button
            onClick={() => deleteField(item.id, item.field)}
            color="danger"
            isIconOnly
          >
            <TrashIcon width={24} />
          </Button>
        );
      default:
        return item[columnKey];
    }
  };

  return (
    <div className="w-full">
      <div className="mb-2 flex w-full justify-end">
        <Button onClick={createField} endContent={<PlusIcon width={24} />}>
          Agregar campo
        </Button>
      </div>
      <TableByRenderFunction
        columns={columns}
        data={fields}
        totalPages={1}
        renderFunction={renderFunction}
      />
    </div>
  );
}

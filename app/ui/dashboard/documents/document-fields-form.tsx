'use client';

import { TableColumns } from '@/app/types/types';
import TableByRenderFunction from '../../common/table-by-renderfunction';
import { DocumentFields } from '@/app/types/forms';
import { Button, Input } from '@nextui-org/react';
import { useContext } from 'react';
import { DocumentFieldsContext } from '@/app/context/document-fields';
import InputSelect from '../../common/input-select';
import { DATABASE_TYPES } from '@/app/lib/consts';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

type PickDataSource = 'field' | 'typeField' | 'documentKey' | 'delete';
export default function DocumentFieldsForm() {
  const { fields, setFields } = useContext(DocumentFieldsContext);

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
    setFields((prev) => {
      const length = prev.length;
      return [
        ...prev,
        {
          id: length * 5000 + 1,
          field: '',
          typeField: '',
          documentKey: '',
        },
      ];
    });
  };

  const deleteField = (id: number) => {
    setFields((prev) => prev.filter((item) => item.id !== id));
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
            onChange={(e) =>
              handleChangueValue('documentKey', e.target.value, item.id)
            }
          />
        );
      case 'delete':
        return (
          <Button
            onClick={() => deleteField(item.id)}
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

import InputSelect from './input-select';
import { Catalog } from '@/app/types/types';
import { Button, Tooltip } from '@nextui-org/react';
import { PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function SelectCrud({
  id,
  label,
  defaultValue,
  description,
  multiple,
  options,
  hrefCrud,
}: {
  id: string;
  label: string;
  defaultValue?: string[] | string;
  description?: string;
  multiple?: boolean;
  options: Catalog[];
  hrefCrud: string;
}) {
  return (
    <div className="flex w-full items-center">
      <Tooltip content={`Crear ${label.toLowerCase()}`} placement="top">
        <Button href={hrefCrud} className="mb-[24px] mr-2" isIconOnly as={Link}>
          <PlusIcon width={24} height={24} />
        </Button>
      </Tooltip>
      <InputSelect
        id={id}
        label={label}
        options={options ?? []}
        defaultValue={defaultValue as any}
        description={description}
        multiple={multiple}
      />
    </div>
  );
}

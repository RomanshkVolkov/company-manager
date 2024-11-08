'use client';

import { Catalog } from '@/app/types/types';
import { Autocomplete, AutocompleteItem } from '@nextui-org/react';

export default function InputAutocomplete({
  id,
  label,
  options,
}: {
  id: string;
  label: string;
  options: Catalog[];
}) {
  return (
    <Autocomplete id={id} name={id} label={label} defaultItems={options}>
      {(option) => (
        <AutocompleteItem key={option.id} value={option.id}>
          {option.name}
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
}

'use client';

import { Catalog } from '@/app/types/types';
import { Select, SelectItem } from '@nextui-org/react';
import React from 'react';

export default function InputSelect({
  id,
  label,
  variant,
  className,
  options,
  defaultValue,
  description,
  disabled,
  multiple,
  onChange,
}: {
  id: string;
  label: string;
  variant?: 'flat' | 'bordered' | 'underlined' | 'faded';
  className?: string;
  options: Catalog[];
  defaultValue?: Set<string>;
  description?: string;
  disabled?: boolean;
  multiple?: boolean;
  onChange?: (_value: Catalog | string) => void;
}) {
  return (
    <Select
      id={id}
      name={id}
      label={label}
      variant={variant}
      className={className}
      selectionMode={multiple ? 'multiple' : 'single'}
      isDisabled={disabled}
      onChange={(e) => {
        if (onChange) {
          const { value } = e.target;

          if (multiple) {
            return onChange(value);
          }

          const item = options.find((option) => option.id === +value)!;
          onChange(item);
        }
      }}
      description={description}
      defaultSelectedKeys={
        defaultValue ? new Set([...defaultValue]) : undefined
      }
    >
      {options.map((option) => (
        <SelectItem key={option.id} value={option.id}>
          {option.name}
        </SelectItem>
      ))}
    </Select>
  );
}

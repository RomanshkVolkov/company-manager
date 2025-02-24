'use client';

// framework
import React, { useCallback } from 'react';

// libs
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';

import { TableProps } from '@/types/common';

export default function DynamicTable<DataSource = any>({
  columns,
  data,
  renderfunction,
}: TableProps<DataSource & { id: string | number }>) {
  const renderCell = useCallback(renderfunction, [renderfunction]);

  return (
    <div className="w-full">
      <Table isStriped isHeaderSticky aria-labelledby="dinamic-table">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={String(column.key)}
              align={column.align || 'start'}
              className={column.key === 'actions' ? 'text-center' : ''}
            >
              {column.label.replace(/_/g, ' ').toUpperCase()}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={data}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(item, columnKey as keyof DataSource)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}


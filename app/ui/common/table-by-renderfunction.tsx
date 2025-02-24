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
} from '@nextui-org/react';

// types and utils
import { TableProps } from '@/app/types/types';

// components
import SearchFilter from '@/app/ui/common/search-filter';
import Pagination from '@/app/ui/common/pagination';
import DateFilter from '@/app/ui/common/date-filter';

export default function TableByRenderFunction<
  PickDataSource extends string,
  DataSource = any,
>({
  columns,
  data,
  totalPages,
  filters,
  renderFunction,
}: TableProps<DataSource & { id: string | number }> & {
  renderFunction: (
    _item: DataSource,
    _columnKey: PickDataSource
  ) => React.ReactNode;
}) {
  const enableSearchFilter = Boolean(filters?.search);
  const enableDateFilter = Boolean(filters?.date);

  const searchFilter = (
    <div className="col-span-2 grid gap-2 md:flex md:justify-between">
      {enableSearchFilter && (
        <SearchFilter data={{ key: 'search', label: 'Buscar' }} />
      )}
      {enableDateFilter && <DateFilter />}
    </div>
  );

  const pagination = <Pagination totalPages={totalPages ?? 1} />;

  const renderCell = useCallback(renderFunction, [renderFunction, data]);

  return (
    <div className="w-full">
      <Table
        isStriped
        isHeaderSticky
        aria-labelledby="dinamic-table"
        topContent={searchFilter}
        bottomContent={pagination}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.align || 'start'}
              className={column.uid === 'actions' ? 'text-center' : ''}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={data}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(item, columnKey.toString() as PickDataSource)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

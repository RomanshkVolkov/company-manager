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
  Tooltip,
} from '@nextui-org/react';

// types and utils
import { TableProps } from '@/app/types/types';

// components
import SearchFilter from '@/app/ui/common/search-filter';
import Pagination from '@/app/ui/common/pagination';
import DateFilter from '@/app/ui/common/date-filter';
import {
  normalizeDate,
  serializedPageData,
  serializedPathname,
} from '@/app/lib/utils';
import TableColumnActions from './table-column-actions';
import { useSearchParams } from 'next/navigation';

export default function DinamicTable<
  PickDataSource extends string,
  DataSource = any,
>({
  columns,
  data,
  totalPages,
  cellActions,
  filters,
  limitRecordsPerPage = 15,
}: TableProps<DataSource & { id: string | number }>) {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';
  const page = searchParams.get('page') || '1';

  const enableSearchFilter = Boolean(filters?.search);
  const enableDateFilter = Boolean(filters?.date);
  const commonKeys = ['createdAt', 'updatedAt'];

  const searchFilter = (
    <div className="col-span-2 grid gap-2 md:flex md:justify-between">
      {enableSearchFilter && (
        <SearchFilter data={{ key: 'search', label: 'Buscar' }} />
      )}
      {enableDateFilter && <DateFilter />}
    </div>
  );

  const pagination = <Pagination totalPages={totalPages} />;

  const commonRenderFunction = (
    item: DataSource,
    columnKey: PickDataSource
  ) => {
    if (columnKey === 'actions') {
      const { id, name } = item as any;
      const editPath = serializedPathname(cellActions?.editPath ?? '#', { id });

      const deletePath = serializedPathname(cellActions?.deletePath ?? '#', {
        id,
        name,
      });
      return <TableColumnActions editPath={editPath} deletePath={deletePath} />;
    }

    const value = item[columnKey as any as keyof DataSource];
    const isDateCell =
      columnKey.toLowerCase().includes('date') ||
      columnKey.toLowerCase().includes('fecha');

    if (commonKeys.includes(columnKey) || isDateCell) {
      return normalizeDate(String(value));
    }

    return String(value);
  };

  const renderCell = useCallback(commonRenderFunction, []);

  const handlePaginatedData = () =>
    serializedPageData<DataSource & { id: string | number }>(
      data,
      +(page ?? '0'),
      limitRecordsPerPage
    );
  const tableData = useCallback(handlePaginatedData, [data, page]);

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
              {column.name.replace(/_/g, ' ')}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={tableData()}>
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

'use client';

// framework
import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';

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
import { serializedMaxLenghtCell } from '@/app/lib/utils';

// components

import SearchFilter from '@/app/ui/common/search-filter';
import Pagination from '@/app/ui/common/pagination';
// import { DataSource, PickDataSource } from './table-wrapper';
import DateFilter from '@/app/ui/common/date-filter';
import DeleteButton from '@/app/ui/common/delete-button';

export default function TransactionsTable({ columns, data }: TableProps<any>) {
  const searchFilter = (
    <div className="col-span-2 grid gap-2 md:flex md:justify-between">
      <SearchFilter data={{ key: 'query', label: 'Buscar' }} />
      <DateFilter />
    </div>
  );

  const pagination = <Pagination totalPages={1} />;

  const renderCell = useCallback((item: any, columnKey: any) => {
    const cell = item[columnKey];

    switch (columnKey) {
      case 'filename':
        const value = cell?.toString() || '';
        const fifteenChars = serializedMaxLenghtCell(value);
        const format = value.substring(value.length - 3);
        return (
          <Tooltip content={value}>{`${fifteenChars}...${format}`}</Tooltip>
        );
      case 'user':
        return item.user.name || '';
      case 'actions':
        return (
          <div className="relative flex items-center justify-center gap-2">
            <DeleteAction id={item.id} filename={item.filename} />
          </div>
        );
      default:
        return cell?.toString() || '';
    }
  }, []);

  return (
    <div className="w-full">
      <Table
        isStriped
        isHeaderSticky
        aria-labelledby="uploads-table"
        topContent={searchFilter}
        bottomContent={pagination}
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align={column?.align || 'center'}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={data}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(item, columnKey.toString() as any)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function DeleteAction({ id, filename }: { id: string; filename: string }) {
  const router = useRouter();
  const handleDelete = () => {
    router.push(`/dashboard/delete-upload/${id}?name=${filename}`);
  };

  return (
    <form action={handleDelete}>
      <DeleteButton href="" />
    </form>
  );
}

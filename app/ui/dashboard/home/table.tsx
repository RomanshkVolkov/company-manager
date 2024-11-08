'use client';

import React, { Key, useState } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Autocomplete,
  AutocompleteItem,
  RangeValue,
} from '@nextui-org/react';
import { DateValue, today } from '@internationalized/date';
import clsx from 'clsx';
import { formatToPrice } from '../../../lib/utils';
import { Terminal, User } from '@prisma/client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import DateFilter, { stringToCalendarDate } from '../../common/date-filter';

type Sale = {
  date: string;
  sales: number;
  commission: number;
  balance: number;
  totalDeposits: number;
  availableBalance: number;
};

const columns = [
  {
    key: 'date',
    label: 'FECHA',
  },
  {
    key: 'sales',
    label: 'VENTAS',
  },
  {
    key: 'commission',
    label: 'COMISIÓN',
  },
  {
    key: 'balance',
    label: 'SALDO',
  },
  {
    key: 'serviceCost',
    label: '% SERVICIO',
  },
  {
    key: 'serviceCostAmount',
    label: 'MONTO % SERVICIO',
  },
  {
    key: 'totalDeposits',
    label: 'RETIROS',
  },
  {
    key: 'availableBalance',
    label: 'SALDO DISPONIBLE',
  },
  {
    key: 'cumulativeBalance',
    label: 'SALDO ACUMULADO',
  },
];

interface Props {
  sales: Sale[];
  clients: Pick<User, 'id' | 'name'>[];
  terminals: Terminal[];
  isAdmin?: boolean;
  clientServiceCost?: number;
}

export default function HomeTable({
  sales,
  clients,
  terminals,
  isAdmin = false,
  clientServiceCost,
}: Props) {
  // TEMPORAL CLIENT PAGINATION
  const [page, setPage] = useState(1);
  const rowsPerPage = 15;
  const pages = Math.ceil(sales.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return sales.slice(start, end);
  }, [page, sales]);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { replace } = useRouter();

  const [client, setClient] = React.useState<React.Key>(
    searchParams.get('client') || ''
  );
  const [terminal, setTerminal] = React.useState<React.Key>(
    searchParams.get('terminal') || ''
  );

  const renderCell = React.useCallback((sale: Sale, columnKey: React.Key) => {
    const cellValue = sale[columnKey as keyof Sale];

    switch (columnKey) {
      case 'date':
        return cellValue;
      default:
        if (typeof cellValue === 'number') {
          return formatToPrice(cellValue);
        }
        return cellValue;
    }
  }, []);

  const defaultFromDate =
    stringToCalendarDate(searchParams.get('from')) ||
    today('utc').add({ months: -1 });
  const defaultToDate =
    stringToCalendarDate(searchParams.get('to')) || today('utc');

  const params = new URLSearchParams(searchParams);

  const handleDateChange = (value: RangeValue<DateValue>) => {
    const { start, end } = value;
    const from = stringToCalendarDate(start?.toString());
    const to = stringToCalendarDate(end?.toString());
    params.set('from', from?.toString() || '');
    params.set('to', to?.toString() || '');
    replace(`${pathname}?${params.toString()}`);
    setPage(1);
  };

  const handleClientChange = (value: Key | null) => {
    setTerminal('');
    params.delete('terminal');
    if (value === null) {
      setClient('');
      params.delete('client');
      replace(`${pathname}?${params.toString()}`);
    } else if (typeof value === 'string') {
      setClient(value);
      params.set('client', value);
      replace(`${pathname}?${params.toString()}`);
    }
  };

  const handleTerminalChange = (value: Key | null) => {
    if (value === null) {
      setTerminal('');
      params.delete('terminal');
      replace(`${pathname}?${params.toString()}`);
    } else if (typeof value === 'string') {
      setTerminal(value);
      params.set('terminal', value);
      replace(`${pathname}?${params.toString()}`);
    }
  };
  return (
    <Table
      aria-label="Example table with dynamic content"
      isStriped
      topContent={
        <div className="flex flex-col gap-2 lg:flex-row">
          {isAdmin && (
            <>
              <Autocomplete
                defaultItems={clients}
                onSelectionChange={handleClientChange}
                selectedKey={client as any}
                label="Cliente"
                className="w-full lg:max-w-xs"
              >
                {(item) => (
                  <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
                )}
              </Autocomplete>
            </>
          )}
          <Autocomplete
            defaultItems={terminals}
            label="Terminales"
            className="w-full lg:max-w-xs"
            onSelectionChange={handleTerminalChange}
            selectedKey={terminal as any}
          >
            {(item) => (
              <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>
            )}
          </Autocomplete>
          <DateFilter
            label="Periodo"
            onChange={handleDateChange}
            defaultFromValue={defaultFromDate}
            defaultToValue={defaultToDate}
          />
        </div>
      }
      bottomContent={
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            color="secondary"
            page={page}
            total={pages}
            onChange={(page) => setPage(page)}
          />
        </div>
      }
    >
      <TableHeader
        columns={columns.filter((column) => {
          if (
            clientServiceCost === undefined &&
            (column.key === 'serviceCost' || column.key === 'serviceCostAmount')
          ) {
            return false;
          }
          return true;
        })}
      >
        {(column) => (
          <TableColumn
            className={clsx({
              'text-right': column.key !== 'date',
            })}
            key={column.key}
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={items}>
        {(item) => (
          <TableRow key={item.date}>
            {(columnKey) => (
              <TableCell
                className={clsx({
                  'text-right': columnKey !== 'date',
                })}
              >
                {renderCell(item, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

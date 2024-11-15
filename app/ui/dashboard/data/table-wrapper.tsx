'use client';

import { site } from '@/app/lib/consts';
import { CommonFields, TableColumns } from '@/app/types/types';
import TableByRenderFunction from '../../common/table-by-renderfunction';
import { normalizeDate, serializedPathname } from '@/app/lib/utils';
import { Link, Tooltip } from '@nextui-org/react';
import { EyeIcon } from '@heroicons/react/24/outline';

export type PickDataSource = 'id' | 'name' | 'createdAt' | 'updatedAt';

export type DataSource = Record<PickDataSource, string>;

type Props = {
  data: CommonFields[];
};
export default function TableWrapper({ data }: Props) {
  const columns: TableColumns<PickDataSource | 'showReport'>[] = [
    { uid: 'name', name: 'Nombre del reporte' },
    { uid: 'updatedAt', name: 'Actualizado' },
    { uid: 'createdAt', name: 'Creado', align: 'end' },
    { uid: 'showReport', name: 'Ver datos', align: 'center' },
    // { uid: 'showReport', name: '', align: 'center' },
  ];

  const renderFunction = (
    item: DataSource,
    columnKey: PickDataSource | 'showReport'
  ) => {
    switch (columnKey) {
      case 'createdAt':
      case 'updatedAt':
        return normalizeDate(item[columnKey]);
      case 'showReport':
        return (
          <Tooltip content="Ver datos" placement="top">
            <Link
              href={serializedPathname(site.dataTable.path, { id: item.id })}
            >
              <EyeIcon width={24} />
            </Link>
          </Tooltip>
        );
      default:
        return item[columnKey];
    }
  };

  return (
    <TableByRenderFunction
      columns={columns}
      data={data as any as DataSource[]}
      renderFunction={renderFunction}
    />
  );
}

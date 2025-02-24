import { getReports } from '@/app/lib/actions/document.actions';
import { TableColumns } from '@/app/types/types';
import MainWrapper from '@/app/ui/common/main-wrapper';
import DynamicTable from '@/app/ui/common/table';

export default async function Page() {
  const reports = await getReports();

  const columns: TableColumns<'name' | 'createdAt' | 'updatedAt' | 'link'>[] = [
    { uid: 'name', name: 'Nombre' },
    { uid: 'createdAt', name: 'Fecha de creación' },
    { uid: 'updatedAt', name: 'Fecha de actualización' },
    { uid: 'link', name: 'Ver reporte', align: 'center' },
  ];

  return (
    <MainWrapper title="Reportes">
      <div className="w-full">
        <DynamicTable columns={columns} data={reports.data} />
      </div>
    </MainWrapper>
  );
}

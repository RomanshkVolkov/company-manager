import { getReportByID } from '@/app/lib/actions/document.actions';
import { site } from '@/app/lib/consts';
import SimpleLineChart from '@/app/ui/charts/line/simple-line-chart';
import MainWrapper from '@/app/ui/common/main-wrapper';
import DynamicTable from '@/app/ui/common/table';

type Props = {
  params: Promise<{ id: string }>;
};
export default async function Page({ params }: Props) {
  const { id } = await params;
  const report = await getReportByID(+id);

  return (
    <MainWrapper
      title={report.data.report.name}
      breadcrumbList={[
        { label: 'Reportes', href: site.reports.path },
        { label: `${report.data.report.name}`, href: '#', active: true },
      ]}
    >
      <div className="w-full">
        <DynamicTable columns={report.data.columns} data={report.data.table} />
      </div>
      <div className="mt-4 grid w-full grid-cols-1 md:grid-cols-2">
        <SimpleLineChart
          data={report.data.table}
          xAxisKey="date"
          lines={[{ dataKey: 'cost', stroke: '#8884d8', name: 'Costo' }]}
        />
      </div>
    </MainWrapper>
  );
}

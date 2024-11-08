import { Prisma } from '@prisma/client';
import HomeTable from './table';
import {
  getClientUsers,
  isAdminTypeUser,
  isClientTypeUser,
  isRootTypeUser,
} from '@/app/lib/services/user.service';
import DailyTransactionsLineChart from '../../charts/line/daily-transactions';
import { UserSession } from '@/app/types/types';
import { User } from 'next-auth';
import { DashboardService } from '../../../lib/services/dashboard.service';

type TableWrapperProps = {
  user: UserSession & User;
  clientFilter: Prisma.Sql;
  terminalFilter: Prisma.Sql;
  clientServiceCost?: number;
  isCommissionApplicable: boolean;
  searchParams?: {
    from?: string;
    to?: string;
    client?: string;
    terminal?: string;
  };
};

const formatter = new Intl.DateTimeFormat('en-US', {
  month: '2-digit',
  day: '2-digit',
  timeZone: 'UTC',
});

export default async function TableWrapper({
  user,
  clientFilter,
  terminalFilter,
  clientServiceCost,
  isCommissionApplicable,
  searchParams,
}: TableWrapperProps) {
  const isClient = isClientTypeUser(user.profile.id);

  const cumulativeResults = await DashboardService.getCumulativeResults({
    params: searchParams,
    terminalFilter,
    clientFilter,
    clientServiceCost: clientServiceCost || 0,
    isCommissionApplicable,
  });

  cumulativeResults.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    }
    if (a.date > b.date) {
      return -1;
    }
    return 0;
  });

  const terminals = await DashboardService.selectTerminals({
    userID: user.id,
    isClient,
    selectedClient: searchParams?.client,
  });

  const formattedDataChart = DashboardService.formatDataChart(
    cumulativeResults,
    formatter
  );

  return (
    <>
      <div className="mb-4">
        <HomeTable
          isAdmin={
            isRootTypeUser(user.profile.id) || isAdminTypeUser(user.profile.id)
          }
          sales={cumulativeResults}
          clients={isClient ? [] : await getClientUsers()}
          terminals={terminals}
          clientServiceCost={clientServiceCost}
        />
      </div>
      <div>
        <DailyTransactionsLineChart data={formattedDataChart} />
      </div>
    </>
  );
}

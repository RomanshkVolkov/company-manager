import { Prisma } from '@prisma/client';
import { Card, CardBody } from '@nextui-org/react';
import {
  PresentationChartLineIcon,
  PercentBadgeIcon,
  CurrencyDollarIcon,
  ArrowUpTrayIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';
import { formatToPrice } from '@/app/lib/utils';
import { UserSession } from '@/app/types/types';
import { User } from 'next-auth';
import { isClientTypeUser } from '@/app/lib/services/user.service';
import clsx from 'clsx';
import { PrismaSumResult } from '@/app/types/dashboard';
import { DashboardService } from '@/app/lib/services/dashboard.service';
import {
  fetchMonthlyClientBalance,
  fetchMonthlySales,
} from '@/app/lib/db/data/dashboard';

type HighlightsProps = {
  user: UserSession & User;
  clientServiceCost: number;
  isCommissionApplicable: boolean;
  clientFilter: Prisma.Sql;
  searchParams?: {
    from?: string;
    to?: string;
    client?: string;
    terminal?: string;
  };
};

export default async function DashboardHighlights({
  user,
  clientServiceCost,
  isCommissionApplicable,
  clientFilter,
  searchParams,
}: HighlightsProps) {
  const isClient = isClientTypeUser(user.profile.id);

  const terminals = await DashboardService.selectTerminals({
    userID: user.id,
    isClient,
    selectedClient: searchParams?.client,
  });

  const globalTerminalFilter =
    terminals.length > 0
      ? Prisma.raw(
          `/*AND*/ WHERE t."terminal_id" IN (${terminals.map((terminal) => `'${terminal.id}'`).join(', ')}) AND t."status_transaction_id" = 1`
        )
      : Prisma.raw('WHERE FALSE');

  const monthlySales = await fetchMonthlySales({
    terminalFilter: globalTerminalFilter,
    clientServiceCost,
    isCommissionApplicable,
  });

  const monthlyClientBalance = await fetchMonthlyClientBalance({
    terminalFilter: globalTerminalFilter,
    clientFilter,
    clientServiceCost,
    isCommissionApplicable,
  });

  const [salesData] = monthlySales;
  const { totalSales, totalCommission, totalServiceCost } = salesData;
  const [clientBalance] = monthlyClientBalance;
  const { totalDeposits, availableBalance } = clientBalance;

  const formatToNumber = (value: PrismaSumResult | null) =>
    value ? value.toNumber() : 0;

  const formattedValues = {
    totalSales: formatToNumber(totalSales),
    totalCommission: formatToNumber(totalCommission),
    totalServiceCost: formatToNumber(totalServiceCost),
    totalDeposits: formatToNumber(totalDeposits),
    availableBalance: formatToNumber(availableBalance),
  };

  const formattedResults = {
    totalSales: formatToPrice(formattedValues.totalSales),
    totalCommission: formatToPrice(formattedValues.totalCommission),
    totalServiceCost: formatToPrice(formattedValues.totalServiceCost),
    totalDeposits: formatToPrice(formattedValues.totalDeposits),
    availableBalance: formatToPrice(formattedValues.availableBalance),
  };

  return (
    <>
      <p className="mb-2 text-sm">Datos históricos</p>
      <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <DashboardCard
          label="Ventas"
          value={formattedResults.totalSales}
          icon={PresentationChartLineIcon}
        />
        <DashboardCard
          label="Comisión"
          value={formattedResults.totalCommission}
          icon={PercentBadgeIcon}
        />
        <DashboardCard
          label="Costo servicio"
          value={
            isClient || searchParams?.client
              ? formattedResults.totalServiceCost
              : 'No aplica'
          }
          icon={CurrencyDollarIcon}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <DashboardCard
          label="Retiros"
          value={formattedResults.totalDeposits}
          icon={ArrowUpTrayIcon}
          gradient
        />
        <DashboardCard
          label="Disponible"
          value={
            isClient || searchParams?.client
              ? formattedResults.availableBalance
              : 'No aplica'
          }
          icon={BanknotesIcon}
          gradient
        />
      </div>
    </>
  );
}

type DashboardCardProps = {
  label: string;
  value: string;
  gradient?: boolean;
  icon?: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, 'ref'> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & React.RefAttributes<SVGSVGElement>
  >;
};
function DashboardCard({
  label,
  value,
  gradient = false,
  icon,
}: DashboardCardProps) {
  const Icon = icon;
  return (
    <Card
      className={clsx(
        gradient && 'bg-gradient-to-r from-[#5a1e9c] via-[#6a239f] to-[#7828c8]'
      )}
    >
      <CardBody className="p-6">
        <div className="mb-2 flex items-center gap-2">
          {Icon && (
            <Icon width={24} className={clsx(gradient && 'text-white')} />
          )}
          <p className={clsx('text-lg font-light', gradient && 'text-white')}>
            {label}
          </p>
        </div>
        <p
          className={clsx(
            'text-3xl font-medium',
            gradient ? 'text-white' : 'text-primary'
          )}
        >
          {value}
        </p>
      </CardBody>
    </Card>
  );
}

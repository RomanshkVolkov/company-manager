export const dynamic = 'force-dynamic';

/* eslint-disable quotes */
import { auth } from '@/auth';
import { getTerminalsByUser } from '../lib/services/user.service';

import DashboardHighlights from '../ui/dashboard/home/highlights';
import TableWrapper from '../ui/dashboard/home/table-wrapper';

interface Props {
  searchParams?: {
    from?: string;
    to?: string;
    client?: string;
    terminal?: string;
  };
}

export default async function Dashboard({ searchParams }: Props) {
  const session = await auth();

  if (!session) {
    return null;
  }

  const { user } = session;

  return (
    <main className="">
      <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>
      <div className="w-full">
        <div className="mb-8">
          {/* <DashboardHighlights
            user={user}
            clientServiceCost={Number(client?.serviceCost || 0)}
            isCommissionApplicable={client?.isCommissionApplicable || false}
            clientFilter={clientFilter}
            searchParams={searchParams}
          /> */}
        </div>

        {/*<Suspense key={`table-${Object.values(searchParams || {}).join('-')}`}>*/}
        {/* <TableWrapper
          user={user}
          clientServiceCost={
            client?.serviceCost ? Number(client.serviceCost) : undefined
          }
          isCommissionApplicable={client?.isCommissionApplicable || false}
          clientFilter={clientFilter}
          terminalFilter={terminalFilter}
          searchParams={searchParams}
        /> */}
      </div>
    </main>
  );
}

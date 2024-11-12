export const dynamic = 'force-dynamic';

/* eslint-disable quotes */
import { auth } from '@/auth';

interface Props {
  _searchParams?: {
    [key: string]: string;
  };
}

export default async function Dashboard({ _searchParams }: Props) {
  const session = await auth();

  if (!session) {
    return null;
  }

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

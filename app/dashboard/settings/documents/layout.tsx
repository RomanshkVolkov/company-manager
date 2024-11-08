import { site } from '@/app/lib/consts';
import TableSkeleton from '@/app/ui/common/table-skeleton';
import GenericTabs from '@/app/ui/dashboard/generic-tabs';
import { Suspense } from 'react';

export default function Layout({
  children,
  modals,
}: Readonly<{ children: React.ReactNode; modals: React.ReactNode }>) {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      <Suspense fallback={<TableSkeleton />}>
        <div className="w-full">{children}</div>
      </Suspense>
      {modals}
    </div>
  );
}

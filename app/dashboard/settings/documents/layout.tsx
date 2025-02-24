import TableSkeleton from '@/app/ui/skeletons/table-skeleton';
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

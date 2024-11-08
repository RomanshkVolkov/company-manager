import React, { Suspense } from 'react';
import TableSkeleton from '@/app/ui/common/table-skeleton';

type Props = {
  children: React.ReactNode;
  modals?: React.ReactNode;
};
export default function Layout({ children, modals }: Props) {
  return (
    <>
      <Suspense fallback={<TableSkeleton />}>{children}</Suspense>
      {modals}
    </>
  );
}

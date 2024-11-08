import { Suspense } from 'react';
import TableSkeleton from '../common/table-skeleton';

export default function TableSkeletonProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<TableSkeleton />}>{children}</Suspense>;
}

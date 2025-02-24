import { Card, Skeleton } from '@nextui-org/react';

export default function TableSkeleton() {
  const rows = 20;
  return (
    <div className="mt-2 w-full">
      <div className="flex w-full justify-between">
        <Skeleton className="h-10 w-64 rounded-lg" />
        <Skeleton className="h-10 w-36 rounded-lg" />
      </div>
      <Card className="mt-3 w-full p-4" radius="sm">
        <div className="mt-3 flex w-full justify-between">
          <Skeleton className="h-9 w-40 rounded-lg" />
          <Skeleton className="h-9 w-44 rounded-lg" />
        </div>
        <div className="mt-6">
          {Array.from({ length: rows }).map((_, index) => (
            <div key={`table_skeleton_row_${index}`} className="h-10">
              <Skeleton className="h-8 rounded-lg" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

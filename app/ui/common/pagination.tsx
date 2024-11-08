'use client';

import { Pagination as NextUIPagination } from '@nextui-org/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function Pagination({ totalPages = 1 }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = searchParams.get('page') || 1;
  const { replace } = useRouter();

  const handleChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
      {totalPages > 1 && (
        <NextUIPagination
          color="secondary"
          total={totalPages}
          initialPage={1}
          page={+page}
          showControls={totalPages > 1}
          onChange={handleChange}
        />
      )}
    </>
  );
}

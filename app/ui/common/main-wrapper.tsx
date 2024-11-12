'use client';

import usePrefetch from '@/app/hooks/use-prefetch';
// framework

// libs

// types and utils

// components
import Breadcrumbs, { Breadcrumb } from '@/app/ui/common/breadcrumbs';
import CreateLinkButton from '@/app/ui/common/create-button';
import HeaderWrapper from '@/app/ui/common/header-wrapper';

export default function MainWrapper({
  children,
  createItemInfo,
  title,
  breadcrumbList,
  linksToPrefetch,
}: {
  children: React.ReactNode;
  createItemInfo?: { label: string; href: string };
  title: string;
  breadcrumbList?: Breadcrumb[];
  linksToPrefetch?: string[];
}) {
  usePrefetch(linksToPrefetch ?? []);

  return (
    <main>
      <section className="flex flex-col items-center">
        <HeaderWrapper>
          <h1 className="text-4xl">{title}</h1>
          {createItemInfo ? (
            <CreateLinkButton
              href={createItemInfo.href}
              label={createItemInfo.label}
            />
          ) : (
            <div />
          )}
        </HeaderWrapper>
        {breadcrumbList && (
          <div className="flex w-full justify-start">
            <Breadcrumbs breadcrumbs={breadcrumbList} />
          </div>
        )}
        {children}
      </section>
    </main>
  );
}

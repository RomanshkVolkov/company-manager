'use client';
import { normalizePathnameByLevel } from '@/app/lib/utils';
import { Tab, Tabs } from '@nextui-org/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function VerticalTabs({
  links,
  position = 'horizontal',
}: {
  links: { name: string; path: string }[];
  position?: 'horizontal' | 'vertical';
}) {
  const pathname = usePathname();
  const currentLevelPathname = normalizePathnameByLevel(pathname, 3);

  return (
    <div className="flex w-full flex-col">
      <Tabs
        isVertical={position === 'vertical'}
        selectedKey={currentLevelPathname}
      >
        {links.map((link) => (
          <Tab key={link.path} title={link.name} href={link.path} as={Link} />
        ))}
      </Tabs>
    </div>
  );
}

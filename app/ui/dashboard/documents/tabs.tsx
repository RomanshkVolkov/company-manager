'use client';
import { Tabs, Tab, Link } from '@nextui-org/react';
import { usePathname } from 'next/navigation';

type TabList = {
  name: string;
  href: string;
};
export default function LayoutTabs({ tabs }: { tabs: TabList[] }) {
  const pathname = usePathname();
  if (pathname.includes('create')) return null;
  return (
    <Tabs variant="underlined" selectedKey={pathname}>
      {tabs.map((tab) => (
        <Tab key={tab.href} href={tab.href} title={tab.name} as={Link} />
      ))}
    </Tabs>
  );
}

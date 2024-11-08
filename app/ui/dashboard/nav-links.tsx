'use client';

import { site } from '@/app/lib/consts';
import { validateRole } from '@/app/lib/utils';
import {
  HomeIcon,
  Cog6ToothIcon,
  DocumentCheckIcon,
  CircleStackIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: site.home.name, href: site.home.path, icon: HomeIcon },
  {
    name: 'Configuración',
    href: site.generalSettings.path,
    icon: Cog6ToothIcon,
    isAdminRoute: true,
  },
  {
    name: site.data.name,
    href: site.data.path,
    icon: CircleStackIcon,
  },
  {
    name: site.reports.name,
    href: site.reports.path,
    icon: DocumentCheckIcon,
  },
];

export default function NavLinks({ userRole }: { userRole: number }) {
  const pathname = usePathname();

  const filteredLinks = [...links].filter((link) => {
    if (link.isAdminRoute) {
      return validateRole.admin(userRole) || validateRole.root(userRole);
    }
    return true;
  });

  return (
    <>
      {filteredLinks.map((link) => {
        const LinkIcon = link.icon;
        const pathSegments = pathname.split('/');
        const isTab = pathSegments.length > 2;
        pathSegments.shift();
        const isCurrentActive = isTab
          ? link.href.startsWith(`/${pathSegments[0]}/${pathSegments[1]}`)
          : pathname === link.href;

        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-lg bg-background p-3 text-sm font-medium hover:bg-sky-100 hover:text-primary-600 dark:hover:bg-sky-950 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-sky-100 text-primary-600 dark:bg-sky-950': isCurrentActive,
              }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}

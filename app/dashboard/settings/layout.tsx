// framework

// libs

// types and utils
import { site } from '@/app/lib/consts';

// components
import GenericTabs from '@/app/ui/dashboard/generic-tabs';

export default function Layout({
  children,
  catalogs,
}: Readonly<{ children: React.ReactNode; catalogs: React.ReactNode }>) {
  const tabs = [
    { name: site.generalSettings.name, path: site.generalSettings.path },
    { name: site.usersSettings.name, path: site.usersSettings.path },
    { name: site.documentsSettings.name, path: site.documentsSettings.path },
  ];

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="w-auto">
        <GenericTabs links={tabs} />
      </div>
      <div className="w-full">{children}</div>
      {catalogs}
    </div>
  );
}

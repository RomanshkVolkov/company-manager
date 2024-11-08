import SideNav from '@/app/ui/dashboard/sidenav';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Waste Wise',
    default: 'Waste Wise',
  },
  description: 'Dashboard para gestion de waste wise y asociados',
  metadataBase: new URL('https://wastewise.com'),
};

export default function Layout({
  delete: deleteModal,
  auth,
  children,
}: {
  delete: React.ReactNode;
  auth: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none bg-white dark:bg-black md:w-64">
        <SideNav />
      </div>
      <div className="relative flex-grow p-6 md:overflow-y-auto md:p-10 md:pl-5">
        {children}
      </div>
      <div>{deleteModal}</div>
      <div>{auth}</div>
    </div>
  );
}

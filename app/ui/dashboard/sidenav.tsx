import Link from 'next/link';
import { auth, signOut } from '@/auth';
import NavLinks from './nav-links';
import LogoutButton from '../common/logout-button';
import { redirect } from 'next/navigation';
import ChangePasswordButton from '../common/change-pass-button';
import { site } from '@/app/lib/consts';

export default async function SideNav() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex max-h-24 min-h-20 items-center justify-center rounded-lg bg-primary-500 p-4 dark:bg-primary-500 md:h-32"
        href="/"
      >
        <div className="w-full text-white">
          <h1 className="mb-1 text-center text-xl">WASTE WISE</h1>
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks userRole={session.user.profile.id} />
        <div className="hidden h-auto w-full grow justify-end rounded-lg bg-background p-2 md:flex md:flex-col">
          {session.user.name}
          <Link
            className="cursor-pointer text-sm text-primary-600 hover:underline"
            href={site.changePassword}
          >
            Cambiar contraseña
          </Link>
        </div>
        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/login' });
          }}
        >
          <div className="flex gap-2">
            <ChangePasswordButton />
            <LogoutButton />
          </div>
        </form>
      </div>
    </div>
  );
}

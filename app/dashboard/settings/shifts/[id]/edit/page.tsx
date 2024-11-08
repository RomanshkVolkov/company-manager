import { site } from '@/app/lib/consts';
import {
  getKitchens,
  getProfiles,
  getShifts,
  getUserByID,
} from '@/app/lib/services/user.service';
import MainWrapper from '@/app/ui/common/main-wrapper';
import Form from '@/app/ui/dashboard/users/edit-form';
import { auth } from '@/auth';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Editar usuario',
};

export default async function EditUser({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const token = session?.user.token as string;

  const [user, profiles, shifts, kitchens] = await Promise.all([
    getUserByID(token, id),
    getProfiles(token),
    getShifts(token),
    getKitchens(token),
  ]);

  if (user?.data.id !== +id) notFound();

  return (
    <MainWrapper
      title="Editar usuario"
      breadcrumbList={[
        { label: 'Usuarios', href: site.settings.shifts },
        { label: 'Editar', href: '#', active: true },
      ]}
    >
      <div className="w-full">
        <Form
          user={user.data}
          profiles={profiles.data}
          shifts={shifts.data}
          kitchens={kitchens.data}
        />
      </div>
    </MainWrapper>
  );
}

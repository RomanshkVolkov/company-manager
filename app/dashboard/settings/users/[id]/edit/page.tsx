import { site } from '@/app/lib/consts';
import {
  getKitchens,
  getProfiles,
  getShifts,
  getUserByID,
} from '@/app/lib/actions/user.actions';
import MainWrapper from '@/app/ui/common/main-wrapper';
import Form from '@/app/ui/dashboard/users/edit-form';
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

  const [user, profiles, shifts, kitchens] = await Promise.all([
    getUserByID(id),
    getProfiles(),
    getShifts(),
    getKitchens(),
  ]);

  if (user?.data.id !== +id) notFound();

  return (
    <MainWrapper
      title="Editar usuario"
      breadcrumbList={[
        { label: 'Usuarios', href: site.usersSettings.path },
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

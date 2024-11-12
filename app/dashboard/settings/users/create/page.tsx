import {
  getKitchens,
  getProfiles,
  getShifts,
} from '@/app/lib/actions/user.actions';
import { site } from '@/app/lib/consts';

import MainWrapper from '@/app/ui/common/main-wrapper';
import Form from '@/app/ui/dashboard/users/create-form';
import { auth } from '@/auth';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crear usuario',
};

export default async function CreateUser() {
  const session = await auth();
  if (
    !session ||
    (session.user.profile.slug !== 'admin' &&
      session.user.profile.slug !== 'root')
  ) {
    return { redirect: { destination: '/login', permanent: false } };
  }

  const profiles = await getProfiles();
  const shifts = await getShifts();
  const kitchens = await getKitchens();

  return (
    <MainWrapper
      title="Crear usuario"
      breadcrumbList={[
        { label: site.usersSettings.name, href: site.usersSettings.path },
        { label: 'Crear', href: '#', active: true },
      ]}
    >
      <div className="w-full">
        <Form
          profiles={profiles.data}
          shifts={shifts.data}
          kitchens={kitchens.data}
        />
      </div>
    </MainWrapper>
  );
}

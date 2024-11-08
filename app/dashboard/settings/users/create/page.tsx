import { site } from '@/app/lib/consts';
import {
  getKitchens,
  getProfiles,
  getShifts,
  getTerminals,
} from '@/app/lib/services/user.service';
import Breadcrumbs from '@/app/ui/common/breadcrumbs';
import MainWrapper from '@/app/ui/common/main-wrapper';
import Form from '@/app/ui/dashboard/users/create-form';
import { auth } from '@/auth';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crear usuario',
};

export default async function CreateUser() {
  const session = await auth();
  if (!session) {
    return { redirect: { destination: '/login', permanent: false } };
  }
  const token = session.user.token;
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

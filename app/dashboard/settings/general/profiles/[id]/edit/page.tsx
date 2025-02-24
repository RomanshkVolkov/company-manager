import {
  getPermisssions,
  getProfileByID,
} from '@/app/lib/actions/user.actions';
import { site } from '@/app/lib/consts';
import { serializedPathname } from '@/app/lib/utils';
import MainWrapper from '@/app/ui/common/main-wrapper';
import EditProfileForm from '@/app/ui/dashboard/users/profiles/edit-form';

type Props = {
  params: Promise<{
    id: string;
  }>;
};
export default async function Page({ params }: Props) {
  const { id } = await params;
  const profile = await getProfileByID(+id);
  const permissions = await getPermisssions();

  return (
    <MainWrapper
      title="Profile"
      breadcrumbList={[
        { label: site.generalSettings.name, href: site.generalSettings.path },
        {
          label: site.editProfile.name,
          href: serializedPathname(site.editProfile.path, { id }),
          active: true,
        },
      ]}
    >
      <div className="w-full">
        <EditProfileForm
          profile={profile.data}
          permissions={permissions.data}
        />
      </div>
    </MainWrapper>
  );
}

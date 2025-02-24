import { getPermisssions } from '@/app/lib/actions/user.actions';
import { site } from '@/app/lib/consts';
import MainWrapper from '@/app/ui/common/main-wrapper';
import CreateProfileForm from '@/app/ui/dashboard/users/profiles/create-form';

export default async function CreateProfilePage() {
  const permissions = await getPermisssions();
  return (
    <MainWrapper
      title="Profile"
      breadcrumbList={[
        { label: site.generalSettings.name, href: site.generalSettings.path },
        {
          label: site.createProfile.name,
          href: site.createProfile.path,
          active: true,
        },
      ]}
    >
      <div className="w-full">
        <CreateProfileForm permissions={permissions.data} />
      </div>
    </MainWrapper>
  );
}

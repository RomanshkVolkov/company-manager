import { getProfileByID } from '@/app/lib/actions/user.actions';
import MainWrapper from '@/app/ui/common/main-wrapper';
import EditFormProfile from '@/app/ui/dashboard/users/profiles/edit-form';

type Props = {
  params: Promise<{
    id: string;
  }>;
};
export default async function Page({ params }: Props) {
  const { id } = await params;
  const profile = await getProfileByID(+id);
  return (
    <MainWrapper title="Profile">
      <div className="w-full">
        <EditFormProfile profile={profile.data} />
      </div>
    </MainWrapper>
  );
}

// framework

// libs

// types and utils
import { getShiftByID } from '@/app/lib/actions/user.actions';

// components
import CustomModal from '@/app/ui/common/custom-modal';
import EditForm from '@/app/ui/dashboard/users/shifts/edit-form';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data } = await getShiftByID(+id);

  return (
    <CustomModal title="Editar Cocina" closeButton="hide">
      <EditForm id={+id} data={data} />
    </CustomModal>
  );
}

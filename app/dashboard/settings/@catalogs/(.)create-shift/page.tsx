import CustomModal from '@/app/ui/common/custom-modal';
import Form from '@/app/ui/dashboard/users/shifts/create-form';

export default function Page() {
  return (
    <CustomModal title="Crear Turno" closeButton="hide">
      <Form />
    </CustomModal>
  );
}

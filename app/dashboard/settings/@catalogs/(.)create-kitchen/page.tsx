import CustomModal from '@/app/ui/common/custom-modal';
import Form from '@/app/ui/dashboard/users/kitchens/create-form';

export default function Page() {
  return (
    <CustomModal title="Crear Cocina" closeButton="hide">
      <Form />
    </CustomModal>
  );
}

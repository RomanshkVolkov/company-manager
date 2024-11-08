import CustomModal from '@/app/ui/common/custom-modal';
import CreateProfileForm from '@/app/ui/dashboard/users/profiles/create-form';

export default function CreateProfile() {
  return (
    <CustomModal title="Crear Perfil" closeButton="hide">
      <CreateProfileForm />
    </CustomModal>
  );
}

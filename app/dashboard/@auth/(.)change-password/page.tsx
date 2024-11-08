'use client';
import FormChangePassword from '@/app/ui/change-password/form';
import CustomModal from '@/app/ui/common/custom-modal';

export default function ResetPassword() {
  return (
    <CustomModal title="Cambiar contraseña">
      <FormChangePassword />
    </CustomModal>
  );
}

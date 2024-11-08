import DeleleteModal from '@/app/ui/common/delete-modal';
import { deleteUser } from '@/app/lib/actions/user.actions';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ name?: string }>;
}) {
  const { id } = await params;
  const queryParams = await searchParams;

  return (
    <DeleleteModal
      title={`Eliminar a ${queryParams?.name}`}
      deleteAction={async () => {
        'use server';
        return await deleteUser(id);
      }}
    >
      <p>¿Estás seguro que deseas eliminar este usuario?</p>
    </DeleleteModal>
  );
}

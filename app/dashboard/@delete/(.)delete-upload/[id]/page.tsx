import DeleleteModal from '@/app/ui/common/delete-modal';
import { deleteUploadAction } from '@/app/lib/actions/upload.actions';
import { getAssociedTransactionsByUploadID } from '@/app/lib/services/upload.service';

export default async function Page({
  params: { id },
  searchParams,
}: {
  params: { id: string };
  searchParams?: { name?: string };
}) {
  const quantity = await getAssociedTransactionsByUploadID(id);

  return (
    <DeleleteModal
      title={`Eliminar carga ${searchParams?.name}`}
      deleteAction={async () => {
        'use server';
        return await deleteUploadAction(id);
      }}
    >
      <p>¿Estás seguro que deseas eliminar esta carga?</p>
      <p className="text-sm">
        Esta acción eliminara todas las transacciones asociadas a la carga.
      </p>
      <div className="flex justify-center">
        <strong>{quantity}</strong>
        <p className="ml-2">Transacciones asociadas</p>
      </div>
    </DeleleteModal>
  );
}

import DeleleteModal from '@/app/ui/common/delete-modal';
import { deleteDepositAction } from '@/app/lib/actions/deposit.actions';
import VerticalDetailRow from '@/app/ui/common/vertical-detail-row';

export default function Page({
  params: { id },
  searchParams,
}: {
  params: { id: string };
  searchParams?: { name?: string; amount?: string; date?: string };
}) {
  return (
    <DeleleteModal
      title={'Eliminar registro de deposito'}
      deleteAction={async () => {
        'use server';
        return await deleteDepositAction(id);
      }}
    >
      <p>¿Estás seguro que deseas eliminar este deposito?</p>
      <div className="w-full">
        <VerticalDetailRow label="Tienda" detail={searchParams?.name || ''} />
        <VerticalDetailRow
          label="Cantidad"
          detail={searchParams?.amount || ''}
        />
        <VerticalDetailRow
          label="Fecha de deposito"
          detail={searchParams?.date || ''}
        />
      </div>
    </DeleleteModal>
  );
}

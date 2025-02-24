import DeleleteModal from '@/app/ui/common/delete-modal';
import { deleteDetailRecord } from '@/app/lib/actions/document.actions';

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ documentID: string }>;
};
export default async function Page({ params, searchParams }: Props) {
  const { id } = await params;
  const { documentID } = await searchParams;

  const bindAction = deleteDetailRecord.bind(null, +id, +documentID);
  return (
    <DeleleteModal title="Eliminar fila" deleteAction={bindAction} id={id}>
      <div></div>
    </DeleleteModal>
  );
}

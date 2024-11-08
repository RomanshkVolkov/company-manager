import { getDocumentById } from '@/app/lib/actions/document.actions';
import CustomModal from '@/app/ui/common/custom-modal';

export default async function ModalEditFormat({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const loadParams = await params;
  const { id } = loadParams;

  const document = await getDocumentById(+id);

  return (
    <CustomModal title="Editar Formato" closeButton="hide">
      <h1>modal de editar</h1>
    </CustomModal>
  );
}

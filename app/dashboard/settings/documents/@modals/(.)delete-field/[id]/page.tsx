import { deleteFieldDocument } from '@/app/lib/actions/document.actions';
import DeleleteModal from '@/app/ui/common/delete-modal';

type Params = { id: string };
type Props = {
  params: Promise<Params>;
  searchParams: Promise<{ field: string }>;
};
export default async function DeleteDocumentField({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  const { field } = await searchParams;
  const bindAction = deleteFieldDocument.bind(null, +id);

  return (
    <DeleleteModal title="Eliminar campo" deleteAction={bindAction}>
      <div className="flex gap-2">
        <p className="text-sm text-gray-600">
          ¿Estás seguro que deseas eliminar este campo?
        </p>
        <span>{field}</span>
      </div>
    </DeleleteModal>
  );
}

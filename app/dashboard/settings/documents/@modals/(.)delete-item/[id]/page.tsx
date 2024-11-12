import { deleteDocument } from '@/app/lib/actions/document.actions';
import DeleleteModal from '@/app/ui/common/delete-modal';

type Params = { id: string };
type Props = {
  params: Promise<Params>;
  searchParams: Promise<{ name: string }>;
};
export default async function DeleteDocument({ params, searchParams }: Props) {
  const { id } = await params;
  const { name } = await searchParams;
  const bindAction = deleteDocument.bind(null, +id);

  return (
    <DeleleteModal title="Eliminar campo" deleteAction={bindAction}>
      <div className="flex flex-col">
        <div className="flex gap-2">
          <p className="text-gray-600 dark:text-gray-400">
            ¿Estás seguro que deseas eliminar el documento &quot;
            <strong>{name}</strong>&quot;?
          </p>
        </div>
        <div className="mt-4 text-sm">
          <p className="text-gray-600 dark:text-gray-400">
            Esta acción eliminará los datos y cualquier carga relacionada con el
            documento
          </p>
        </div>
      </div>
    </DeleleteModal>
  );
}

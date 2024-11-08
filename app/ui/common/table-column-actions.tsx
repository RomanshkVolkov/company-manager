import EditLinkButton from './edit-button';
import DeleteButton from './delete-button';

type Props = {
  editPath?: string;
  deletePath?: string;
};
export default function TableColumnActions({ editPath, deletePath }: Props) {
  return (
    <div className="relative flex items-center justify-center gap-2">
      {editPath && <EditLinkButton href={editPath} />}
      {deletePath && <DeleteButton href={deletePath} />}
    </div>
  );
}

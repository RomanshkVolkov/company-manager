// framework

// libs

// types and utils
import { getDocumentById } from '@/app/lib/actions/document.actions';

// components
import CustomModal from '@/app/ui/common/custom-modal';
import UploadForm from '@/app/ui/dashboard/data/upload-form';

type Props = {
  searchParams: Promise<Record<string, string>>;
};
export default async function UploadDocument({ searchParams }: Props) {
  const { id } = await searchParams;
  const document = await getDocumentById(+id);

  return (
    <CustomModal title="Cargar documento" closeButton="hide">
      <UploadForm document={document} />
    </CustomModal>
  );
}

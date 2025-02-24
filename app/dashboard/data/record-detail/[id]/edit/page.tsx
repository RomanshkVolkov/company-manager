// framework
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

// libs

// types and utils
import { getRecordByID } from '@/app/lib/actions/document.actions';

// components
import MainWrapper from '@/app/ui/common/main-wrapper';
import EditRecordDetailForm from '@/app/ui/dashboard/data/record-detail/edit-form';

export const metadata: Metadata = {
  title: 'Editar depósito',
};

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ documentID: string }>;
};
export default async function EditRecordDetail({
  params,
  searchParams,
}: Props) {
  const { id } = await params;
  const { documentID } = await searchParams;
  const fields = await getRecordByID(+id, +documentID);
  if (fields.data.length <= 0) notFound();

  return (
    <MainWrapper title="Editar depósito">
      <div className="w-full">
        <EditRecordDetailForm
          id={+id}
          documentID={documentID}
          fields={fields.data}
        />
      </div>
    </MainWrapper>
  );
}

import DeleleteModal from '@/app/ui/common/delete-modal';
import { modalsData } from '@/app/lib/modals-data';
import { notFound } from 'next/navigation';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; id: string }>;
  searchParams: Promise<{ name: string }>;
}) {
  const { slug, id } = await params;
  const queryParams = await searchParams;

  const modalDeleteInformation = modalsData[slug as keyof typeof modalsData];

  if (
    modalDeleteInformation === undefined ||
    modalDeleteInformation.action === undefined
  ) {
    notFound();
  }

  const { title, action, message } = modalDeleteInformation;

  if (message === undefined) {
    notFound();
  }

  return (
    <DeleleteModal
      title={title}
      deleteAction={async () => {
        'use server';
        return await action(+id);
      }}
      id={id}
    >
      <p>{message.replace('{{name}}', `"${queryParams?.name}"`)}</p>
    </DeleleteModal>
  );
}

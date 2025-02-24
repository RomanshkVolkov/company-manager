import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';
import { Button } from '@nextui-org/react';
import { site } from '@/app/lib/consts';
import { serializedPathname } from '@/app/lib/utils';

type Props = {
  params: Promise<{ id: string }>;
};
export default async function NotFound({ params }: Props) {
  const { id } = await params;

  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <FaceFrownIcon className="w-20 text-gray-400" />
      <h2 className="text-4xl font-semibold">404 Not Found</h2>
      <p className="text-xl">
        No se pudo encontrar la tabla del documento solicitado.
      </p>
      <Button
        color="primary"
        variant="flat"
        size="lg"
        href={serializedPathname(site.dataTable.path, { id })}
        as={Link}
      >
        Regresar
      </Button>
    </main>
  );
}

import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';
import { Button } from '@nextui-org/react';

export default function CustomNotFound({
  message,
  backHref,
}: {
  message: string;
  backHref: string;
}) {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <FaceFrownIcon className="w-20 text-gray-400" />
      <h2 className="text-4xl font-semibold">404 Not Found</h2>
      <p className="text-xl">{message}</p>
      <Button
        color="primary"
        variant="flat"
        size="lg"
        href={backHref}
        as={Link}
      >
        Regresar
      </Button>
    </main>
  );
}

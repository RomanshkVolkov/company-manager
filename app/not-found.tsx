import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';
import { Button } from '@nextui-org/react';

export default function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <FaceFrownIcon className="w-20 text-gray-400" />
      <h2 className="text-4xl font-semibold">404 Not Found</h2>
      <p className="text-xl">No se pudo encontrar la pagina solicitada.</p>
      <Button
        color="primary"
        variant="flat"
        size="lg"
        href="/dashboard"
        as={Link}
      >
        Regresar
      </Button>
    </main>
  );
}

'use client';

import { PowerIcon } from '@heroicons/react/24/outline';
import { Button } from '@nextui-org/react';
import { useFormStatus } from 'react-dom';

export default function LogoutButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      className="relative flex w-full grow items-center gap-2 text-sm font-medium text-white transition-all md:flex-none md:justify-center"
      color="secondary"
      size="lg"
      variant="shadow"
      type="submit"
      isLoading={pending}
      isIconOnly
    >
      <span className="hidden md:inline-block">Cerrar sesión</span>
      <PowerIcon className="w-6 md:absolute md:right-4 md:ml-auto" />
    </Button>
  );
}

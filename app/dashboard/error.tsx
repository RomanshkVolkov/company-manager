'use client';

import { Button } from '@nextui-org/react';
import { FaceFrownIcon } from '@heroicons/react/24/outline';

type Props = {
  error: Error;
  reset: () => void;
};
export default function Error({ reset }: Props) {
  return (
    <div className="grid h-screen place-content-center px-4">
      <div className="text-center">
        <FaceFrownIcon className="mx-auto w-20 text-gray-400" />

        <p className="text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          ¡Ups!
        </p>

        <p className="my-4 text-gray-500">Ha ocurrido un error inesperado</p>

        <Button
          color="primary"
          variant="flat"
          size="lg"
          onClick={() => reset()}
        >
          Intenta de nuevo
        </Button>
      </div>
    </div>
  );
}

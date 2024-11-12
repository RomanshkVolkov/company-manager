'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// this hook is used to close modal when the action is finished need to pass the param (omitRedirect: boolean) on genic action
// este hook se usa para cerrar el modal cuando la acción ha finalizado, es necesario pasar el parametro (omitRedirect: boolean) redirección en la acción generica
// reference generic actions on -> /app/lib/actions/generic.actions.ts
export default function useEndActionModalProcess({
  signal,
}: {
  signal?: boolean;
}) {
  const { back } = useRouter();

  useEffect(() => {
    if (signal) {
      back();
    }
  }, [signal, back]);

  return null;
}

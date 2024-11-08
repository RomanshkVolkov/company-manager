import Link from 'next/link';
import { FaceFrownIcon } from '@heroicons/react/24/outline';
import { Button } from '@nextui-org/react';
import CustomNotFound from '@/app/ui/common/not-found';
import { site } from '@/app/lib/consts';

export default function NotFound() {
  return (
    <CustomNotFound
      message="No se pudo encontrar el usuario solicitado."
      backHref={site.settings.users}
    />
  );
}

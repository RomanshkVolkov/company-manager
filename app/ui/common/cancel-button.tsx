'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@nextui-org/react';

export default function CancelButton({
  label,
  href,
}: {
  label?: string;
  href: string;
}) {
  const { back } = useRouter();
  const isBackFunction = href === 'back()';

  const handleClick = () => {
    if (href === 'back()') {
      back();
    }
  };

  return (
    <Button
      className="mr-2"
      color="danger"
      variant="flat"
      onClick={isBackFunction ? handleClick : undefined}
      href={!isBackFunction ? href : undefined}
      as={!isBackFunction ? Link : undefined}
    >
      {label || 'Cancelar'}
    </Button>
  );
}

'use client';

import { KeyIcon } from '@heroicons/react/24/outline';
import { Button } from '@nextui-org/react';
import Link from 'next/link';

export default function ChangePasswordButton() {
  return (
    <Button
      className="relative flex w-full grow items-center gap-2 text-sm font-medium text-white transition-all md:hidden"
      color="primary"
      size="lg"
      variant="shadow"
      isIconOnly
      href="/dashboard/change-password"
      as={Link}
    >
      <KeyIcon className="w-6 md:absolute md:right-4 md:ml-auto" />
    </Button>
  );
}

'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { Input, Button } from '@nextui-org/react';
import {
  EyeIcon,
  EyeSlashIcon,
  ArrowLongRightIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { authenticate } from '@/app/lib/actions/auth.actions';

export default function Form() {
  const [state, dispatch, isPending] = useActionState(authenticate, undefined);
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <form action={dispatch}>
      <Input
        id="username"
        data-testid="username-field"
        label="Usuario"
        name="username"
        type="text"
        disabled={isPending}
        className="mb-4"
        isClearable
        isRequired
      />
      <Input
        data-testid="password-field"
        name="password"
        label="Contraseña"
        id="password"
        minLength={6}
        disabled={isPending}
        className="mb-2"
        type={isVisible ? 'text' : 'password'}
        isRequired
        endContent={
          <button
            data-testid="toggle-password"
            className="focus:outline-none"
            type="button"
            onClick={toggleVisibility}
          >
            {isVisible ? (
              <EyeSlashIcon
                className="pointer-events-none text-2xl text-default-400"
                width={20}
              />
            ) : (
              <EyeIcon
                className="pointer-events-none text-2xl text-default-400"
                width={20}
              />
            )}
          </button>
        }
      />
      <div className="mb-6">
        <Link href="/forgot-password">
          <span className="text-sm text-gray-500 hover:text-primary-500 hover:underline">
            ¿Olvidaste tu contraseña?
          </span>
        </Link>
      </div>
      <LoginButton pending={isPending} />
      <div className="mt-2 flex gap-1" aria-live="polite" aria-atomic="true">
        {state && (
          <>
            <XCircleIcon className="h-5 w-5 text-danger" />
            <p className="text-sm text-danger">{state}</p>
          </>
        )}
      </div>
    </form>
  );
}

function LoginButton({ pending }: { pending: boolean }) {
  return (
    <Button
      data-testid="submit-button"
      type="submit"
      color="primary"
      className="relative m-auto w-full"
      size="lg"
      variant="shadow"
      aria-disabled={pending}
      isDisabled={pending}
      isLoading={pending}
    >
      Acceder
      <ArrowLongRightIcon className="absolute right-4 ml-auto w-6" />
    </Button>
  );
}

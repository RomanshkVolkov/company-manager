'use client';

import { Input, Button } from '@nextui-org/react';
import { useFormStatus } from 'react-dom';
import {
  ArrowLongLeftIcon,
  ArrowLongRightIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  KeyIcon,
  LockClosedIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import {
  resetPassword,
  sendRecoveryCode,
  validateOTP,
} from '@/app/lib/actions/auth.actions';
import OTPInput from './otp-input';
import { useActionState, useEffect, useState } from 'react';
import Link from 'next/link';
import { hasItems } from '@/app/lib/utils';
import InputCredentials from '../common/input-credentials';

export default function Forms() {
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const handlerCode = {
    value: otp,
    setValue: setOtp,
  };

  const [usernameState, usernameDispatch] = useActionState(sendRecoveryCode, {
    errors: {},
    step: '',
    message: '',
  });

  useEffect(() => {
    if (usernameState.step) {
      setStep(usernameState.step);
    }
  }, [usernameState]);

  return (
    <div>
      {step === 'email' && (
        <>
          <Link href="/login">
            <ArrowLongLeftIcon width={30} className="mb-4" />
          </Link>
          <div className="mb-2 items-center md:flex">
            <UserIcon width={30} className="mr-2 flex text-primary-500" />
            <h2 data-testid="username-title" className="text-2xl">
              Correo electrónico
            </h2>
          </div>
          <p className="mb-6 text-gray-500">
            No te preocupes, te ayudaremos a recuperar tu contraseña, solo
            necesitamos el correo electrónico que usas para iniciar sesión.
          </p>
          <form action={usernameDispatch}>
            <Input
              data-testid="username-field"
              id="username"
              label="Usuario"
              type="text"
              name="username"
              className="mb-4"
              isInvalid={hasItems(usernameState.errors.username)}
              errorMessage={usernameState.errors.username?.join(', ')}
              isClearable
              isRequired
            />
            <NextButton />
            <div
              className="mt-4 flex gap-1"
              aria-live="polite"
              aria-atomic="true"
            >
              {usernameState.message && (
                <>
                  <ExclamationCircleIcon className="h-5 w-5 text-danger-400" />
                  <p className="text-sm text-danger-400">
                    {usernameState.message}
                  </p>
                </>
              )}
            </div>
          </form>
        </>
      )}
      {step === 'otp' && (
        <OTPForm
          username={usernameState.username}
          setStep={setStep}
          otp={handlerCode}
        />
      )}
      {step === 'password' && (
        <PasswordForm username={usernameState.username} otp={otp} />
      )}
    </div>
  );
}

function OTPForm({
  username,
  setStep,
  otp,
}: {
  username?: string;
  setStep: (_step: 'email' | 'otp' | 'password') => void;
  otp: {
    value: string[];
    setValue: React.Dispatch<React.SetStateAction<string[]>>;
  };
}) {
  const validateOTPWithUser = validateOTP.bind(null, username || '');
  const [state, dispatch] = useActionState(validateOTPWithUser, null);

  useEffect(() => {
    if (state?.username) {
      setStep('password');
    }
  }, [setStep, state]);

  return (
    <>
      <ArrowLongLeftIcon
        data-testid="back-to-username"
        width={30}
        className="mb-4"
        role="button"
        onClick={() => {
          setStep('email');
        }}
      />
      <div className="mb-2 items-center md:flex">
        <KeyIcon width={30} className="mr-2 flex text-primary-500" />
        <h2 data-testid="otp-code-title" className="text-2xl">
          Código de seguridad
        </h2>
      </div>
      <p className="mb-6 text-gray-500">
        Si el correo está registrado, recibirás un correo electrónico con un
        código de 6 dígitos para recuperar tu contraseña.
      </p>
      <form action={dispatch}>
        <fieldset>
          <div className="mb-4 flex w-full gap-2">
            <OTPInput otp={otp.value} setOtp={otp.setValue} />
          </div>
        </fieldset>

        <NextButton isDisabled={otp.value.some((code) => code === '')} />
        <div className="mt-2 flex gap-1" aria-live="polite" aria-atomic="true">
          {state?.errors.otp && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-danger-400" />
              <p className="text-sm text-danger-400">{state.errors.otp}</p>
            </>
          )}
        </div>
      </form>
    </>
  );
}

function PasswordForm({ username, otp }: { username?: string; otp: string[] }) {
  const resetPassWithUser = resetPassword.bind(
    null,
    username || '',
    otp.join('')
  );
  const [state, dispatch] = useActionState(resetPassWithUser, null);

  return (
    <>
      {!state?.done && (
        <>
          <div className="mb-2 items-center md:flex">
            <LockClosedIcon width={30} className="mr-2 flex text-primary-500" />
            <h2 data-testid="password-title" className="text-2xl">
              Nueva contraseña
            </h2>
          </div>
          <p className="mb-6 text-gray-500">
            ¡Casi listo! Ingresa tu nueva contraseña para continuar.
          </p>
          <form action={dispatch}>
            <fieldset>
              <div className="mb-4 flex w-full flex-col gap-2">
                <InputCredentials
                  id="password"
                  data-testid="password-field"
                  label="Contraseña"
                  errorMessage="La contraseña es requerida"
                />
                <InputCredentials
                  data-testid="password-confirm-field"
                  id="confirmPassword"
                  label="Confirmar contraseña"
                  errorMessage="Las contraseñas no coinciden"
                />
              </div>
            </fieldset>

            <AcceptButton />
            <div
              className="mt-2 flex gap-1"
              aria-live="polite"
              aria-atomic="true"
            >
              {state?.errors.password && (
                <>
                  <ExclamationCircleIcon className="h-5 w-5 text-danger-400" />
                  <p className="text-sm text-danger-400">
                    {state.errors.password}
                  </p>
                </>
              )}
            </div>
            <div
              className="mt-2 flex gap-1"
              aria-live="polite"
              aria-atomic="true"
            >
              {state?.errors.confirmPassword && (
                <>
                  <ExclamationCircleIcon className="h-5 w-5 text-danger-400" />
                  <p className="text-sm text-danger-400">
                    {state.errors.confirmPassword}
                  </p>
                </>
              )}
            </div>
          </form>
        </>
      )}
      {state?.done && (
        <>
          <div className="mb-2 items-center md:flex">
            <CheckCircleIcon
              width={30}
              className="mr-2 flex text-primary-500"
            />
            <h2 data-testid="password-updated-title" className="text-2xl">
              Contraseña actualizada
            </h2>
          </div>
          <p className="mb-6 text-gray-500">
            ¡Felicidades! Haz terminado el proceso, ahora puedes iniciar sesión
            con tu nueva contraseña.
          </p>
          <Button
            data-testid="login-button-redirect"
            className="relative m-auto"
            href="/login"
            color="primary"
            size="lg"
            variant="shadow"
            as={Link}
            fullWidth
          >
            Iniciar sesión
            <ArrowLongRightIcon className="absolute right-4 ml-auto w-6" />
          </Button>
        </>
      )}
    </>
  );
}

function NextButton({ isDisabled }: { isDisabled?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button
      data-testid="submit-button"
      type="submit"
      color={isDisabled ? 'default' : 'primary'}
      className="relative m-auto w-full"
      size="lg"
      variant="shadow"
      aria-disabled={pending}
      isDisabled={pending || isDisabled}
      isLoading={pending}
    >
      Siguiente
      <ArrowLongRightIcon className="absolute right-4 ml-auto w-6" />
    </Button>
  );
}

function AcceptButton({ isDisabled }: { isDisabled?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button
      data-testid="submit-button"
      type="submit"
      color={isDisabled ? 'default' : 'primary'}
      className="relative m-auto w-full"
      size="lg"
      variant="shadow"
      aria-disabled={pending}
      isDisabled={pending || isDisabled}
      isLoading={pending}
    >
      Aceptar
      <ArrowLongRightIcon className="absolute right-4 ml-auto w-6" />
    </Button>
  );
}

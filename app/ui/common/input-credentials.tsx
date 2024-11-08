'use client';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Input } from '@nextui-org/react';
import { useState } from 'react';

export default function InputCredentials({
  id = 'password',
  label = 'Contrseña',
  isInvalid = false,
  errorMessage = '',
}: {
  id?: string;
  label?: string;
  isInvalid?: boolean;
  errorMessage?: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  return (
    <Input
      data-testid="password-field"
      id={id}
      name={id}
      label={label}
      minLength={6}
      className="mb-2"
      isInvalid={isInvalid}
      errorMessage={errorMessage}
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
  );
}

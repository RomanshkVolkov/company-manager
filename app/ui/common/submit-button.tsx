'use client';

import { Button } from '@nextui-org/react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { useFormStatus } from 'react-dom';

/**
 * A button component that submits a form and includes a check circle icon.
 * Uses the useFormStatus hook to automatically disable the button when the form is pending and show a loading spinner.
 */

export default function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      data-testid="submit-button"
      aria-disabled={pending}
      color="success"
      variant="shadow"
      type="submit"
      isLoading={pending}
      isDisabled={pending}
      endContent={<CheckCircleIcon className="w-6" />}
    >
      {label}
    </Button>
  );
}

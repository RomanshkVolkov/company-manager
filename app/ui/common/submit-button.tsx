'use client';

import { Button } from '@nextui-org/react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

/**
 * A button component that submits a form and includes a check circle icon.
 * Uses the useFormStatus hook to automatically disable the button when the form is pending and show a loading spinner.
 */
type Props = {
  label: string;
  isPending?: boolean;
};
export default function SubmitButton({ label, isPending }: Props) {
  return (
    <Button
      data-testid="submit-button"
      aria-disabled={isPending}
      color="success"
      variant="shadow"
      type="submit"
      isLoading={isPending}
      isDisabled={isPending}
      endContent={<CheckCircleIcon className="w-6" />}
    >
      {label}
    </Button>
  );
}

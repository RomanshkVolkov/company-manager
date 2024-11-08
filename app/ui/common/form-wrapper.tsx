'use client';

import SubmitButton from '@/app/ui/common/submit-button';
import Form from '@/app/ui/common/form';
import FormError from '@/app/ui/common/form-error';
import CancelButton from '@/app/ui/common/cancel-button';

export default function FormWrapper({
  children,
  dispatch,
  message,
  hrefCancelled,
  isTransparent,
}: {
  children: React.ReactNode;
  dispatch: (payload: any) => void;
  message?: string;
  hrefCancelled: string;
  isTransparent?: boolean;
}) {
  return (
    <Form action={dispatch} isTransparent={isTransparent}>
      {children}
      <FormError>
        {message && <p className="w-full text-danger">{message}</p>}
        <div className="flex w-full justify-between sm:justify-end">
          <CancelButton href={hrefCancelled} />
          <SubmitButton label="Guardar" />
        </div>
      </FormError>
    </Form>
  );
}
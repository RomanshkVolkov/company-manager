'use client';

import CancelButton from '@/app/ui/common/cancel-button';
import Form from '@/app/ui/common/form';
import FormError from '@/app/ui/common/form-error';
import SubmitButton from '@/app/ui/common/submit-button';

type Props = {
  children: React.ReactNode;
  dispatch: (_payload: any) => void;
  message?: string;
  hrefCancelled: string;
  isPending?: boolean;
};
export default function FormWrapper({
  children,
  dispatch,
  message,
  hrefCancelled,
}: Props) {
  return (
    <Form action={dispatch}>
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

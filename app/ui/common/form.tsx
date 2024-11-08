/**
 * A basic form component. It has aria-describedby set to "form-error" to use with FormError component.
 */

import Form from 'next/form';

export default function FormComponent({
  children,
  isTransparent,
  action,
  ...props
}: {
  children: React.ReactNode;
  isTransparent?: boolean;
  action?: string | ((payload: any) => void);
} & React.HTMLProps<HTMLFormElement>) {
  const classes = isTransparent
    ? 'bg-transparent'
    : 'bg-white border dark:bg-black dark:shadow-black dark:border-none';
  return (
    <Form
      action={action as any}
      aria-describedby="form-error"
      className="rounded-xl p-6 shadow-xl md:px-10 md:py-8"
      noValidate
      {...props}
    >
      {children}
    </Form>
  );
}

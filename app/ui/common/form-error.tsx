/**
 * FormError component is used to display form errors. It has aria-live and aria-atomic attributes set to "polite" and "true" respectively. It also has an id set to "form-error" to be used with aria-describedby attribute in the FormComponent.
 */

export default function FormError({ children }: { children: React.ReactNode }) {
  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      id="form-error"
      className="flex items-center justify-between"
    >
      {children}
    </div>
  );
}

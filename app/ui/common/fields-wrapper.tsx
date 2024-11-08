/**
 * A wrapper for form fields. It's a flex container with a gap of 4.
 */

export default function FieldsWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex flex-wrap gap-4">{children}</div>;
}

/**
 * Wrapper for form fields that are in the same row.
 */

export default function Fields({ children }: { children: React.ReactNode }) {
  return <div className="w-full gap-4 md:flex">{children}</div>;
}

export default function VerticalDetailRow({
  label,
  detail,
}: {
  label: string;
  detail: string;
}) {
  return (
    <div className="grid w-full grid-cols-2">
      <span className="mr-2">{label}</span>
      <span>{detail}</span>
    </div>
  );
}

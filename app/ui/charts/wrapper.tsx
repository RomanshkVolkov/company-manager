type Props = { title: string; children: React.ReactNode };
export default function ChartWrapper({ title, children }: Props) {
  return (
    <div className="flex w-full">
      <div className="flex w-full justify-start">
        <h1 className="text-3xl">{title}</h1>
      </div>
      <div className="flex w-full">{children}</div>
    </div>
  );
}

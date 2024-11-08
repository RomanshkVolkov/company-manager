/**
 * A legend for a form fieldset.
 */

export default function FormLegend({
  children,
  icon,
  description,
}: {
  children: React.ReactNode;
  icon: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, 'ref'> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & React.RefAttributes<SVGSVGElement>
  >;
  description?: string;
}) {
  const Icon = icon;
  return (
    <div className="flex-wrap items-start md:flex">
      <Icon className="mr-2 w-8 stroke-1 text-primary-500" />
      <legend className="text-lg text-primary-500">{children}</legend>
      {description && (
        <p className="mt-1 w-full text-sm font-medium text-gray-700 dark:text-gray-300">
          {description}
        </p>
      )}
    </div>
  );
}

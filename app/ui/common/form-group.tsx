import FieldsWrapper from './fields-wrapper';
import FormLegend from './form-legend';

export default function FormGroup({
  children,
  title,
  icon,
}: {
  children: React.ReactNode;
  title: string;
  icon: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, 'ref'> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & React.RefAttributes<SVGSVGElement>
  >;
}) {
  return (
    <fieldset className="mb-8">
      <div className="mb-6">
        <FormLegend icon={icon}>{title}</FormLegend>
      </div>
      <FieldsWrapper>{children}</FieldsWrapper>
    </fieldset>
  );
}

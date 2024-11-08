import { PlusIcon } from '@heroicons/react/24/outline';
import { Button } from '@nextui-org/react';
import Link from 'next/link';

/**
 * A button component that links to a specified URL and includes an icon.
 * Renders a full button with children and icon for larger screens, and an icon-only button for smaller screens.
 * @param href - The URL to link to
 * @param children - The children to render inside the button.
 * @param icon - The icon to render inside the button. Defaults to PlusIcon.
 */

export default function CreateLinkButton({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon?: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, 'ref'> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & React.RefAttributes<SVGSVGElement>
  >;
}) {
  const Icon = icon || PlusIcon;
  return (
    <>
      <Button
        className="hidden md:flex"
        color="primary"
        variant="flat"
        size="lg"
        type="button"
        href={href}
        as={Link}
      >
        {label}
        <Icon className="w-6" />
      </Button>
      <Button
        className="md:hidden"
        color="primary"
        variant="flat"
        size="lg"
        type="button"
        href={href}
        as={Link}
        isIconOnly
      >
        <Icon className="w-6" />
      </Button>
    </>
  );
}

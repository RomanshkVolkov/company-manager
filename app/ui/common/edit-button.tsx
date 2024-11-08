import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { Button, Link, Tooltip } from '@nextui-org/react';

/**
 * A button component that links to a specified URL and includes an edit icon.
 * Renders an icon-only button.
 * @param href - The URL to link to
 */

export default function EditLinkButton({ href }: { href: string }) {
  return (
    <Tooltip content="Editar">
      <Button href={href} as={Link} isIconOnly>
        <PencilSquareIcon className="w-5" />
      </Button>
    </Tooltip>
  );
}

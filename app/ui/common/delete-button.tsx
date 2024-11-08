import { TrashIcon } from '@heroicons/react/24/outline';
import { Button, Link, Tooltip } from '@nextui-org/react';

type Props = {
  href: string;
};
export default function DeleteButton({ href }: Props) {
  return (
    <Tooltip content="Eliminar" color="danger">
      <Button color="danger" isIconOnly href={href} as={Link}>
        <TrashIcon className="w-5" />
      </Button>
    </Tooltip>
  );
}

'use client';

import { txtToHash } from '@/app/lib/utils';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';

type DeleteAction = () => Promise<
  | {
      errors: Record<string, string[]>;
      message: string;
    }
  | undefined
>;

export default function DeleleteModal({
  children,
  title,
  deleteAction,
  showDelete = true,
}: {
  children: React.ReactNode;
  title: string;
  deleteAction: DeleteAction;
  showDelete?: boolean;
}) {
  const { onOpenChange } = useDisclosure();
  const router = useRouter();
  const toastRef = txtToHash(title);

  return (
    <Modal
      className="max-w-[500px]"
      onOpenChange={onOpenChange}
      onClose={() => router.back()}
      isOpen
    >
      <ModalContent>
        {(_onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>{children}</ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                variant="light"
                onPress={() => router.back()}
              >
                Cerrar
              </Button>
              {showDelete && (
                <DeleteAction deleteAction={deleteAction} toastRef={toastRef} />
              )}
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}

function DeleteAction({
  deleteAction,
  toastRef,
}: {
  deleteAction: DeleteAction;
  toastRef: string;
}) {
  const router = useRouter();

  const handleDelete = async () => {
    const state = await deleteAction();
    if (state?.message) {
      toast.error(state.message, { id: `delete-error-${toastRef}` });
    } else {
      toast.success('Eliminado correctamente', {
        id: `delete-success-${toastRef}`,
      });
    }
    router.back();
  };

  return (
    <form action={handleDelete}>
      <DeleteButton />
    </form>
  );
}

function DeleteButton() {
  const { pending } = useFormStatus();
  return (
    <Button color="danger" type="submit" isLoading={pending}>
      Eliminar
    </Button>
  );
}

'use client';

// framework
import { useContext } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter, useSearchParams } from 'next/navigation';

// libs
import { toast } from 'sonner';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@nextui-org/react';

// types and utils
import { PendingReloadContext } from '@/app/context/pending-reload';
import { txtToHash } from '@/app/lib/utils';

// components

type DeleteAction = () => Promise<{
  errors: Record<string, string[]>;
  message: string;
} | void>;

export default function DeleleteModal({
  children,
  title,
  deleteAction,
  showDelete = true,
  id,
}: {
  children: React.ReactNode;
  title: string;
  deleteAction: DeleteAction;
  showDelete?: boolean;
  id: string;
}) {
  const { onOpenChange } = useDisclosure();
  const { back } = useRouter();
  const searchParams = useSearchParams();
  const toastRef = txtToHash(title);

  const closeModal = searchParams.get('close-modal');

  return (
    <Modal
      className="max-w-[500px]"
      onOpenChange={onOpenChange}
      onClose={() => back()}
      isOpen={!closeModal}
    >
      <ModalContent>
        {(_onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>{children}</ModalBody>
            <ModalFooter>
              <Button color="primary" variant="light" onPress={() => back()}>
                Cerrar
              </Button>
              {showDelete && (
                <DeleteAction
                  deleteAction={deleteAction}
                  toastRef={toastRef}
                  itemDeleted={id}
                />
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
  itemDeleted,
}: {
  deleteAction: DeleteAction;
  toastRef: string;
  itemDeleted: string;
}) {
  const { setPendingNavigationAction } = useContext(PendingReloadContext);

  const handleDelete = async () => {
    const state = await deleteAction();
    if (state?.message) {
      toast.error(state.message, { id: `delete-error-${toastRef}` });
    } else {
      toast.success('Eliminado correctamente', {
        id: `delete-success-${toastRef}`,
      });
    }
    setPendingNavigationAction((prevState) => ({
      ...prevState,
      itemDeleted,
      back: true,
    }));
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

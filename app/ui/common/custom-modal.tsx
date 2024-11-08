'use client';

// framework
import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

// libs
import {
  Button,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';

// types and utils

// components

export default function CustomModal({
  title,
  children,
  closeButton = 'show',
}: {
  title: string;
  children: React.ReactNode;
  closeButton?: 'show' | 'hide';
}) {
  const pathname = usePathname();
  const { back } = useRouter();

  const handleCloseModal = () => {
    back();
  };

  const onKeyClose = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCloseModal();
    }
  };

  const loadAddCloseEvent = () => {
    const body = document.querySelector('body');

    body?.addEventListener('keyup', onKeyClose);

    return () => {
      body?.removeEventListener('keyup', onKeyClose);
    };
  };

  useEffect(loadAddCloseEvent, []);
  const { onOpenChange } = useDisclosure();

  return (
    <dialog>
      <Modal
        className="max-w-[720px] p-2 md:p-4"
        onOpenChange={onOpenChange}
        onClose={handleCloseModal}
        isOpen
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>{title}</ModalHeader>
              {children}
              {closeButton === 'show' ? (
                <ModalFooter className="py-2">
                  <Button color="primary" variant="light" onClick={onClose}>
                    Cerrar
                  </Button>
                </ModalFooter>
              ) : (
                <div className="mb-4" />
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </dialog>
  );
}

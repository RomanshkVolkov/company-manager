// framework

// libs

// types and utils
import {
  deleteKitchenAction,
  deleteShiftAction,
  deleteUser,
} from '@/app/lib/actions/user.actions';

type ModalInformation = {
  [key: string]: {
    title: string;
    message?: string;
    action?: (id: number) => Promise<{
      message: string;
      errors: any;
    }>;
    component?: (id: number) => React.ReactNode;
  };
};

// components

export const modalsData: ModalInformation = {
  'delete-kitchen': {
    title: 'Eliminar Cocina',
    action: deleteKitchenAction,
    message: '¿Estás seguro que deseas eliminar {{name}}?',
  },
  'delete-shift': {
    title: 'Eliminar Turno',
    action: deleteShiftAction,
    message: '¿Estás seguro que deseas eliminar {{name}}?',
  },
  'delete-user': {
    title: 'Eliminar Usuario',
    action: deleteUser,
    message: '¿Estás seguro que deseas eliminar {{name}}?',
  },
};

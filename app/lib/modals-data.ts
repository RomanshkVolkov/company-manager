// framework

// libs

// types and utils
import {
  deleteKitchenAction,
  deleteProfile,
  deleteShiftAction,
  deleteUser,
} from '@/app/lib/actions/user.actions';

type ModalInformation = {
  [key: string]: {
    title: string;
    message?: string;
    action?: (_id: number) => Promise<
      | {
          message: string;
          errors: any;
        }
      | undefined
    >;
    component?: (_id: number) => React.ReactNode | undefined;
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
  profile: {
    title: 'Eliminar Perfil',
    message: '¿Estás seguro que deseas eliminar {{name}}?',
    action: deleteProfile,
  },
};

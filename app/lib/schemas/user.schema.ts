import { z } from 'zod';

export const BaseSchema = z.object({
  name: z
    .string({
      message: 'Nombre inválido.',
    })
    .min(3, {
      message: 'Por favor, ingresa un nombre.',
    }),
  serviceCost: z.string().optional(),
  email: z.string().email({
    message: 'Por favor, ingresa un correo válido.',
  }),
  profileID: z.string().min(1, {
    message: 'Por favor, selecciona un tipo de usuario.',
  }),
  isActive: z.string().optional(),
  isCommissionApplicable: z.string().optional(),
  password: z.string().min(6, {
    message: 'Por favor, ingresa una contraseña de al menos 6 caracteres.',
  }),
});

export const CreateUserSchema = BaseSchema.refine(
  (data) => {
    const { serviceCost } = data;
    const isValidCost = !isNaN(Number(serviceCost)) && Number(serviceCost) >= 0;
    return isValidCost || serviceCost === undefined;
  },
  {
    message: 'Por favor, ingresa un costo de servicio válido.',
    path: ['serviceCost'],
  }
);

export const EditUserSchema = BaseSchema.omit({ password: true }).refine(
  (data) => {
    const { serviceCost } = data;
    const isValidCost = !isNaN(Number(serviceCost)) && Number(serviceCost) >= 0;
    return isValidCost || serviceCost === undefined;
  },
  {
    message: 'Por favor, ingresa un costo de servicio válido.',
    path: ['serviceCost'],
  }
);

export const TerminalSchema = z.array(
  z.string().uuid({
    message: 'Por favor, selecciona una terminal válida.',
  })
);

export interface Errors {
  profileID?: string[] | undefined;
  name?: string[] | undefined;
  shiftID?: string[] | undefined;
  email?: string[] | undefined;
  kitchenIDs?: string[] | undefined;
  username?: string[] | undefined;
  password?: string[] | undefined;
  isActive?: string[] | undefined;
}

export type ResetValues = {
  profileID: string;
  name: string;
  shiftID: string;
  email: string;
  kitchenIDs: string[];
  username: string;
  password: string;
  isActive: string;
};

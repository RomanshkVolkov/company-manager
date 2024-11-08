import { z } from 'zod';

export const BaseSchema = z.object({
  name: z.string().min(3, {
    message: 'Por favor, ingresa un nombre.',
  }),
});

export const CatalogSchema = BaseSchema;

export interface Errors {
  name?: string[] | undefined;
}

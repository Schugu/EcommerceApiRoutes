import { z } from 'zod';

export const cartItemSchema = z.object({
  product_id: z.number({
    invalid_type_error: "El campo 'product' debe ser un número.",
    required_error: "El campo 'product' es requerido."
  })
    .min(1, { message: "La cantidad debe ser mayor a 0." })
    .positive({ message: "La cantidad debe ser un número positivo." })
    .int({ message: "La cantidad debe ser un número entero." }),

  quantity: z.number({
    invalid_type_error: "El campo 'quantity' debe ser un número.",
    required_error: "El campo 'quantity' es requerido."
  })
    .min(1, { message: "La cantidad debe ser mayor a 0." })
    .positive({ message: "La cantidad debe ser un número positivo." })
    .int({ message: "La cantidad debe ser un número entero." })
    .max(999, { message: "La cantidad no puede ser mayor a 999." }),
}).strict();

export const cartSchema = z.object({
  user_id: z.number({
    invalid_type_error: "El campo 'user_id' debe ser un número.",
    required_error: "El campo 'user_id' es requerido."
  })
    .min(1, { message: "La cantidad debe ser mayor a 0." })
    .positive({ message: "La cantidad debe ser un número positivo." })
    .int({ message: "La cantidad debe ser un número entero." })
}).strict();

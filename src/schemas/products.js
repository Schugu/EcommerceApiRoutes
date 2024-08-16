import { z } from 'zod';

export const productSchema = z.object({
  title: z.string({
    invalid_type_error: "El campo 'title' debe ser texto.",
    required_error: "El campo 'title' es requerido."
  })
    .max(100, { message: "El título no puede tener más de 100 caracteres." }),

  description: z.string({
    invalid_type_error: "El campo 'description' debe ser texto.",
    required_error: "El campo 'description' es requerido."
  })
    .max(500, { message: "La descripción no puede tener más de 500 caracteres." }),

  code: z.string({
    invalid_type_error: "El campo 'code' debe ser texto.",
    required_error: "El campo 'code' es requerido."
  }),

  price: z.number({
    invalid_type_error: "El campo 'price' debe ser un número.",
    required_error: "El campo 'price' es requerido."
  })
    .min(0.01, { message: "El precio debe ser mayor que 0." }),

  stock: z.number({
    invalid_type_error: "El campo 'stock' debe ser un número.",
    required_error: "El campo 'stock' es requerido."
  })
    .nonnegative({ message: "El stock no debe ser un número negativo." })
    .int({ message: "El stock debe ser un número entero." })
    .max(999, { message: "El stock no puede ser mayor a 999." }),

  category: z.string({
    invalid_type_error: "El campo 'category' debe ser texto.",
    required_error: "El campo 'category' es requerido."
  })
    .max(50, { message: "La categoría no puede tener más de 50 caracteres." }),

  thumbnails: z.array(z.string(), {
    invalid_type_error: "Thumbnails debe ser un array.",
  }).default([]),
}).strict(); 



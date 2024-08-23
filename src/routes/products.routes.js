import { Router } from 'express';

import { validateSchema, validateSchemaPartial } from "../middlewares/validateSchema.js";
import { productSchema } from "../schemas/products.js";

import { ProductController } from "../controllers/products.controller.js";

const router = Router();

router.post('/products', validateSchema(productSchema), ProductController.newProduct);

router.get('/products', ProductController.getAll);

router.get('/products/:productId', ProductController.getById);

router.patch('/products/:productId', validateSchemaPartial(productSchema), ProductController.update);

router.delete('/products/:productId', ProductController.delete);

export default router;

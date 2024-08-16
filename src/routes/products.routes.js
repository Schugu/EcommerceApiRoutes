import { Router } from 'express';

import { validateSchema, validateSchemaPartial } from "../middlewares/validateSchema.js";
import { productSchema } from "../schemas/products.js";

import { newProduct, getProducts, getProduct, updateProduct, deleteProduct } from "../controllers/products.controller.js";

const router = Router();

router.post('/products', validateSchema(productSchema), newProduct);

router.get('/products', getProducts);

router.get('/products/:productId', getProduct);

router.put('/products/:productId', validateSchemaPartial(productSchema), updateProduct);

router.delete('/products/:productId', deleteProduct);

export default router;

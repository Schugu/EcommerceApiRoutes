import { Router } from 'express';

import { validateSchema, validateSchemaPartial } from "../middlewares/validateSchema.js";
import { cartItemSchema, cartSchema } from "../schemas/carts.js";

import { CartController } from "../controllers/carts.controller.js";

const router = Router();

router.post('/carts', validateSchema(cartSchema), CartController.newCart);

router.post('/carts/:cartId/product', validateSchema(cartItemSchema), CartController.addProduct);

router.get('/carts', CartController.getAll);

router.get('/carts/:cartId', CartController.getById);

router.get('/carts/:cartId/product/:productId', CartController.getProduct);

router.delete('/carts/:cartId', CartController.delete);

router.delete('/carts/:cartId/product/:productId', CartController.deleteProduct);

export default router;
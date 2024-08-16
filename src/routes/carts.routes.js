import { Router } from 'express';

import { validateSchema, validateSchemaPartial } from "../middlewares/validateSchema.js";
import { cartItemSchema, cartSchema } from "../schemas/carts.js";

import {
  getCarts,
  newCart,
  getCart,
  deleteCart,
  newProductOnCart,
  getProductOnCart,
  updateProductOnCart,
  deleteProductOnCart
} from "../controllers/carts.controller.js";

const router = Router();

router.post('/carts', validateSchema(cartSchema), newCart);

router.get('/carts', getCarts);

router.get('/carts/:cartId', getCart);

router.delete('/carts/:cartId', deleteCart);

router.get('/carts/:cartId/product/:productId', getProductOnCart);

router.put('/carts/:cartId/product/:productId', validateSchemaPartial(cartItemSchema), updateProductOnCart);

router.post('/carts/:cartId/product', validateSchema(cartItemSchema), newProductOnCart);

router.delete('/carts/:cartId/product/:productId', deleteProductOnCart);


export default router;

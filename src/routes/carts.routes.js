import { Router } from 'express';

import { validateSchema } from "../middlewares/validateSchema.js";
import { cartItemSchema, cartSchema } from "../schemas/carts.js";

import { CartController } from "../controllers/carts.controller.js";


export const createCartRouter = ({ cartModel }) => {
  const cartsRouter = Router();

  const cartController = new CartController({ cartModel });


  cartsRouter.post('/carts', validateSchema(cartSchema), cartController.newCart);
  cartsRouter.post('/carts/:cartId/product', validateSchema(cartItemSchema), cartController.addProduct);

  cartsRouter.get('/carts', cartController.getAll);
  cartsRouter.get('/carts/:cartId', cartController.getById);
  cartsRouter.get('/carts/:cartId/product/:productId', cartController.getProduct);

  cartsRouter.delete('/carts/:cartId', cartController.delete);
  cartsRouter.delete('/carts/:cartId/product/:productId', cartController.deleteProduct);

  return cartsRouter;
}
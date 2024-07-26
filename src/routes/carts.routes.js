import { Router } from 'express';

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

router.post('/carts/new', newCart);

router.get('/carts', getCarts);

router.get('/carts/:cartId', getCart);

router.delete('/carts/:cartId', deleteCart);

router.get('/carts/:cartId/product/:productId', getProductOnCart);

router.put('/carts/:cartId/product/:productId', updateProductOnCart);

router.post('/carts/:cartId/product/new', newProductOnCart);

router.delete('/carts/:cartId/product/:productId', deleteProductOnCart);


export default router;

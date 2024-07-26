import { Router } from 'express';

import { newProduct, getProducts, getProduct, updateProduct, deleteProduct } from "../controllers/products.controller.js";

const router = Router();

router.post('/products/new', newProduct);

router.get('/products', getProducts);

router.get('/products/:productId', getProduct);

router.put('/products/:productId', updateProduct);

router.delete('/products/:productId', deleteProduct);

export default router;

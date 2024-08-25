import { Router } from 'express';

import { validateSchema, validateSchemaPartial } from "../middlewares/validateSchema.js";
import { productSchema } from "../schemas/products.js";

import { ProductController } from "../controllers/products.controller.js";


export const createProductRouter = ({ productModel }) => {
  const productsRouter = Router();

  const productController = new ProductController({ productModel });


  productsRouter.post('/products', validateSchema(productSchema), productController.newProduct);

  productsRouter.get('/products', productController.getAll);

  productsRouter.get('/products/:productId', productController.getById);

  productsRouter.patch('/products/:productId', validateSchemaPartial(productSchema), productController.update);

  productsRouter.delete('/products/:productId', productController.delete);

  return productsRouter;
}
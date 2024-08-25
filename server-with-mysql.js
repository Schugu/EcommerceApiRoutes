import { createApp } from "./src/app.js";
import { ProductModel } from './src/models/mysql/product.js';
import { CartModel } from './src/models/mysql/cart.js'

createApp({ productModel: ProductModel, cartModel: CartModel });
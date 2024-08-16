import fs from 'fs';
import moment from "moment"
import { validateCart, validateCartPartial } from "../schemas/carts.js";

const filePath = 'src/dataBase/carts.json';

const readCartsFromFile = () => {
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (error) {
    console.error("Error al leer el archivo:", error);
    return [];
  }
};

const writeCartsFromFile = (users) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error al escribir en el archivo:", error);
  }
};

export const newCart = (req, res) => {

  let { products } = req.body;

  if (!products) {
    return res.status(400).json({ message: "Faltan campos requeridos." });
  }

  for (const item of products) {
    const result = validateCart(item);

    if (result.error) {
      return res.status(400).json({ error: JSON.parse(result.error.message) });
    }
  }

  const newCart = {
    id: Date.now(),
    Time: moment().format('YYYY-MM-DD HH:mm:ss'),
    products
  };

  const dataCarts = readCartsFromFile();
  dataCarts.push(newCart);
  writeCartsFromFile(dataCarts);

  res.status(201).json({ message: "Carrito creado exitosamente.", cart: newCart });
};

export const getCarts = (req, res) => {
  const dataCarts = readCartsFromFile();
  res.send(dataCarts);
};

export const getCart = (req, res) => {
  const cartId = parseInt(req.params.cartId, 10);

  if (isNaN(cartId)) {
    return res.status(400).json({ message: "ID de carrito inválido. Debe ser un número." });
  }

  const dataCarts = readCartsFromFile();
  const cartFound = dataCarts.find((cart) => cart.id === cartId);

  if (!cartFound) {
    return res.status(404).json({ message: `No se encontró el carrito con el ID: ${cartId}.` });
  }

  res.json(cartFound);
};

export const deleteCart = (req, res) => {
  const cartId = parseInt(req.params.cartId, 10);

  if (isNaN(cartId)) {
    return res.status(400).json({ message: "ID de carrito inválido. Debe ser un número." });
  }

  const dataCarts = readCartsFromFile();
  const cartIndex = dataCarts.findIndex((cart) => cart.id === cartId);

  if (cartIndex === -1) {
    return res.status(404).json({ message: `No se encontró el carrito con el ID: ${cartId}.` });
  }

  const [deletedCart] = dataCarts.splice(cartIndex, 1);
  writeCartsFromFile(dataCarts);

  res.status(200).json({ message: `Carrito con el ID: ${cartId} eliminado exitosamente.`, deletedCart });
};

export const newProductOnCart = (req, res) => {
  const cartId = parseInt(req.params.cartId, 10);

  if (isNaN(cartId)) {
    return res.status(400).json({ message: "ID de carrito inválido. Debe ser un número." });
  }

  const dataCarts = readCartsFromFile();
  const cartFound = dataCarts.find((cart) => cart.id === cartId);

  if (!cartFound) {
    return res.status(404).json({ message: `No se encontró el carrito con el ID: ${cartId}.` });
  }

  const result = validateCart(req.body);

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const { product, quantity } = result.data;

  const productIndex = cartFound.products.findIndex((item) => item.product === product);

  if (productIndex === -1) {
    const newProduct = { product, quantity };

    cartFound.products.push(newProduct);
    writeCartsFromFile(dataCarts);
    return res.status(201).json({ message: "Producto agregado al carrito exitosamente.", newProduct });
  } else {
    cartFound.products[productIndex].quantity += quantity;
    writeCartsFromFile(dataCarts);
    return res.status(200).json({ message: "Cantidad del producto actualizada exitosamente.", updatedProduct: cartFound.products[productIndex] });
  }
};

export const getProductOnCart = (req, res) => {
  const cartId = parseInt(req.params.cartId, 10);

  if (isNaN(cartId)) {
    return res.status(400).json({ message: "ID de carrito inválido. Debe ser un número." });
  }

  const dataCarts = readCartsFromFile();
  const cartFound = dataCarts.find((cart) => cart.id === cartId);

  if (!cartFound) {
    return res.status(404).json({ message: `No se encontró el carrito con el ID: ${cartId}` });
  }

  const productFound = cartFound.products.find((item) => item.product === req.params.productId);

  if (productFound) {
    return res.json(productFound);
  } else {
    return res.status(404).json({ message: `No existe ningún producto con el ID: ${req.params.productId}` });
  }
};

export const updateProductOnCart = (req, res) => {
  const cartId = parseInt(req.params.cartId, 10);

  if (isNaN(cartId)) {
    return res.status(400).json({ message: "ID de carrito inválido. Debe ser un número." });
  }

  const dataCarts = readCartsFromFile();
  const cartFound = dataCarts.find((cart) => cart.id === cartId);

  if (!cartFound) {
    return res.status(404).json({ message: `No existe ningún carrito con el ID: ${cartId}` });
  }

  const result = validateCartPartial(req.body);
  if (result.error) {
    return res.status(400).json({ error: result.error.format() });
  }

  const { quantity } = result.data;
  const productId = req.params.productId;

  const productIndex = cartFound.products.findIndex((item) => item.product === productId);

  if (productIndex === -1) {
    return res.status(404).json({ message: `No existe ningún producto con el ID: ${productId}` });
  }

  let productUpdated = false;
  const updateMessages = {};

  if (quantity !== undefined && cartFound.products[productIndex].quantity !== quantity) {
    const oldQuantity = cartFound.products[productIndex].quantity;
    updateMessages.quantity = `${oldQuantity} => ${quantity}`;
    cartFound.products[productIndex].quantity = quantity;
    productUpdated = true;
  }

  if (!productUpdated) {
    return res.status(304).json({ message: "No se realizaron cambios." });
  }

  cartFound.updated = moment().format('YYYY-MM-DD HH:mm:ss');
  writeCartsFromFile(dataCarts);
  return res.status(200).json({ message: `Producto con el ID: ${productId} actualizado exitosamente.`, updates: updateMessages });
};

export const deleteProductOnCart = (req, res) => {
  const cartId = parseInt(req.params.cartId, 10);
  const productId = req.params.productId;

  if (isNaN(cartId)) {
    return res.status(400).json({ message: "ID de carrito inválido. Debe ser un número." });
  }

  const dataCarts = readCartsFromFile();
  const cartFound = dataCarts.find((cart) => cart.id === cartId);

  if (!cartFound) {
    return res.status(404).json({ message: `No se encontró el carrito con el ID: ${cartId}` });
  }

  const productIndex = cartFound.products.findIndex((item) => item.product === productId);

  if (productIndex === -1) {
    return res.status(404).json({ message: `No se encontró el producto con el ID: ${productId} en el carrito.` });
  }

  cartFound.products.splice(productIndex, 1);
  writeCartsFromFile(dataCarts);

  return res.status(200).json({ message: `Producto con el ID: ${productId} eliminado del carrito con el ID: ${cartId}.` });
};

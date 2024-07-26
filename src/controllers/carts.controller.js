import fs from 'fs';

const filePath = 'src/dataBase/carts.json';

const readUsersFromFile = () => {
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

const writeUsersToFile = (users) => {
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
    const { product, quantity } = item;

    if (!product || typeof product !== "string") {
      return res.status(400).json({ message: "El campo 'product' debe ser un texto." });
    }

    if (typeof quantity !== "number" || quantity < 1) {
      return res.status(400).json({ message: "El campo 'quantity' debe ser un número y debe ser mayor a 0." });
    }
  }

  const id = Date.now();

  const newCart = { id, products };

  const dataCarts = readUsersFromFile();
  dataCarts.push(newCart);
  writeUsersToFile(dataCarts);

  res.status(201).json({ message: "Carrito creado exitosamente.", cart: newCart });
};

export const getCarts = (req, res) => {
  const dataCarts = readUsersFromFile();
  res.send(dataCarts);
};

export const getCart = (req, res) => {
  const cartId = parseInt(req.params.cartId, 10);

  if (isNaN(cartId)) {
    return res.status(400).json({ message: "ID de carrito inválido. Debe ser un número." });
  }

  const dataCarts = readUsersFromFile();
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

  const dataCarts = readUsersFromFile();
  const cartIndex = dataCarts.findIndex((cart) => cart.id === cartId);

  if (cartIndex === -1) {
    return res.status(404).json({ message: `No se encontró el carrito con el ID: ${cartId}.` });
  }

  const [deletedCart] = dataCarts.splice(cartIndex, 1);
  writeUsersToFile(dataCarts);

  res.status(200).json({ message: `Carrito con el ID: ${cartId} eliminado exitosamente.`, deletedCart });
};

export const newProductOnCart = (req, res) => {
  const cartId = parseInt(req.params.cartId, 10);

  if (isNaN(cartId)) {
    return res.status(400).json({ message: "ID de carrito inválido. Debe ser un número." });
  }

  const dataCarts = readUsersFromFile();
  const cartFound = dataCarts.find((cart) => cart.id === cartId);

  if (!cartFound) {
    return res.status(404).json({ message: `No se encontró el carrito con el ID: ${cartId}.` });
  }

  const { product, quantity } = req.body;

  if (!product || typeof product !== "string") {
    return res.status(400).json({ message: "El campo 'product' debe ser un texto." });
  }

  if (typeof quantity !== "number" || quantity < 1) {
    return res.status(400).json({ message: "El campo 'quantity' debe ser un número y debe ser mayor a 0." });
  }

  const productIndex = cartFound.products.findIndex((item) => item.product === product);

  if (productIndex === -1) {
    const newProduct = { product, quantity };

    cartFound.products.push(newProduct);
    writeUsersToFile(dataCarts);
    return res.status(201).json({ message: "Producto agregado al carrito exitosamente.", newProduct });
  } else {
    cartFound.products[productIndex].quantity += quantity;
    writeUsersToFile(dataCarts);
    return res.status(200).json({ message: "Cantidad del producto actualizada exitosamente.", updatedProduct: cartFound.products[productIndex] });
  }
};

export const getProductOnCart = (req, res) => {
  const cartId = parseInt(req.params.cartId, 10);

  if (isNaN(cartId)) {
    return res.status(400).json({ message: "ID de carrito inválido. Debe ser un número." });
  }

  const dataCarts = readUsersFromFile();
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

  const dataCarts = readUsersFromFile();
  const cartFound = dataCarts.find((cart) => cart.id === cartId);

  const { quantity } = req.body;

  if (typeof quantity !== "number" || quantity < 1) {
    return res.status(400).json({ message: "El campo 'quantity' debe ser un número y debe ser mayor a 0." });
  }

  const productIndex = cartFound.products.findIndex((item) => item.product === req.params.productId);

  if (productIndex === -1) {
    return res.status(404).json({ message: `No existe ningún producto con el ID: ${req.params.productId}` });
  }

  let productUpdated = false;
  const updateMessages = {};

  if (cartFound.products[productIndex].quantity !== quantity) {
    const oldQuantity = cartFound.products[productIndex].quantity;
    updateMessages.quantity = `${oldQuantity} => ${quantity}`;
    cartFound.products[productIndex].quantity = quantity;
    productUpdated = true;
  }

  if (!productUpdated) {
    return res.status(304).json({ message: "No se realizaron cambios." });
  }

  writeUsersToFile(dataCarts);
  return res.status(200).json({ message: `Producto con el ID: ${req.params.productId} actualizado exitosamente.`, updates: updateMessages });
};

export const deleteProductOnCart = (req, res) => {
  const cartId = parseInt(req.params.cartId, 10);
  const productId = req.params.productId;

  if (isNaN(cartId)) {
    return res.status(400).json({ message: "ID de carrito inválido. Debe ser un número." });
  }

  const dataCarts = readUsersFromFile();
  const cartFound = dataCarts.find((cart) => cart.id === cartId);

  if (!cartFound) {
    return res.status(404).json({ message: `No se encontró el carrito con el ID: ${cartId}` });
  }

  const productIndex = cartFound.products.findIndex((item) => item.product === productId);

  if (productIndex === -1) {
    return res.status(404).json({ message: `No se encontró el producto con el ID: ${productId} en el carrito.` });
  }

  cartFound.products.splice(productIndex, 1);
  writeUsersToFile(dataCarts);

  return res.status(200).json({ message: `Producto con el ID: ${productId} eliminado del carrito con el ID: ${cartId}.` });
};

import fs from 'fs';
import moment from "moment"
import validateProduct from "../schemas/products.js";

const filePath = 'src/dataBase/products.json';

const readProductsFromFile = () => {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading or parsing the file:', error);
    return []; // Retorna un array vacío en caso de error
  }
};

const writeProductsToFile = (products) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to the file:', error);
  }
};

export const getProducts = (req, res) => {
  const { code, category, title } = req.query;
  const dataProducts = readProductsFromFile();

  if (code) {
    const filterProducts = dataProducts.filter(
      product => product.code.includes(code)
    )
    return res.json(filterProducts);
  }

  if (category) {
    const filterProducts = dataProducts.filter(
      product => product.category.toLowerCase() === category.toLowerCase()
    );
    return res.json(filterProducts);
  }

  if (title) {
    const filterProducts = dataProducts.filter(
      product => product.title.toLowerCase() === title.toLowerCase()
    );
    return res.json(filterProducts);
  }

  res.json(dataProducts); // Cambiado a .json para un retorno más estándar
};

export const getProduct = (req, res) => {
  const productId = parseInt(req.params.productId, 10);

  if (isNaN(productId)) {
    return res.status(400).json({ message: "ID de producto inválido. Debe ser un número." });
  }

  const dataProducts = readProductsFromFile();
  const productFound = dataProducts.find((product) => product.id === productId);

  if (productFound) {
    return res.json(productFound);
  } else {
    return res.status(404).json({ message: `No existe ningún producto con el ID: ${productId}` });
  }
};

export const newProduct = (req, res) => {
  const result = validateProduct(req.body);

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const dataProducts = readProductsFromFile();
  if (dataProducts.some((product) => product.code === result.data.code)) {
    return res.status(400).json({ message: `El producto con el código ${result.data.code} ya existe.` });
  }

  const newProduct = {
    id: Date.now(),
    status: true,
    Time: moment().format('YYYY-MM-DD HH:mm:ss'),
    ...result.data
  };

  dataProducts.push(newProduct);
  writeProductsToFile(dataProducts);

  res.status(201).json(newProduct);
};

export const deleteProduct = (req, res) => {
  const productId = parseInt(req.params.productId, 10);

  if (isNaN(productId) || productId < 1) {
    return res.status(400).json({ message: "El ID debe ser un número mayor a 0." });
  }

  const dataProducts = readProductsFromFile();
  const productIndex = dataProducts.findIndex((product) => product.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({ message: `No existe ningún producto con el ID: ${productId}` });
  }

  const [deletedProduct] = dataProducts.splice(productIndex, 1);
  writeProductsToFile(dataProducts);

  res.status(200).json({ message: `Producto con ID ${productId} eliminado`, deletedProduct });
};

export const updateProduct = (req, res) => {
  const productId = parseInt(req.params.productId, 10);

  if (isNaN(productId) || productId < 1) {
    return res.status(400).json({ message: "El ID debe ser un número mayor a 0." });
  }

  const dataProducts = readProductsFromFile();
  const productIndex = dataProducts.findIndex((product) => product.id === productId);

  if (productIndex === -1) {
    return res.status(404).json({ message: `No existe ningún producto con el ID: ${productId}` });
  }

  const result = validateProduct(req.body);

  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  let { title, description, code, price, stock, category, thumbnails } = result.data;


  const arraysAreEqual = (arr1, arr2) => {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((value, index) => value === arr2[index]);
  };

  let productUpdated = false;
  const updateMessages = {};

  // Comparar y actualizar propiedades
  if (dataProducts[productIndex].title !== title) {
    const oldTitle = dataProducts[productIndex].title;
    updateMessages.title = `${oldTitle} => ${title}`;
    dataProducts[productIndex].title = title;
    productUpdated = true;
  }

  if (dataProducts[productIndex].description !== description) {
    const oldDescription = dataProducts[productIndex].description;
    updateMessages.description = `${oldDescription} => ${description}`;
    dataProducts[productIndex].description = description;
    productUpdated = true;
  }

  if (dataProducts[productIndex].code !== code) {
    const oldCode = dataProducts[productIndex].code;
    updateMessages.code = `${oldCode} => ${code}`;
    dataProducts[productIndex].code = code;
    productUpdated = true;
  }

  if (dataProducts[productIndex].price !== price) {
    const oldPrice = dataProducts[productIndex].price;
    updateMessages.price = `${oldPrice} => ${price}`;
    dataProducts[productIndex].price = price;
    productUpdated = true;
  }

  if (dataProducts[productIndex].stock !== stock) {
    const oldStock = dataProducts[productIndex].stock;
    updateMessages.stock = `${oldStock} => ${stock}`;
    dataProducts[productIndex].stock = stock;
    productUpdated = true;
  }

  if (dataProducts[productIndex].category !== category) {
    const oldCategory = dataProducts[productIndex].category;
    updateMessages.category = `${oldCategory} => ${category}`;
    dataProducts[productIndex].category = category;
    productUpdated = true;
  }

  if (!arraysAreEqual(dataProducts[productIndex].thumbnails, thumbnails)) {
    const oldThumbnails = dataProducts[productIndex].thumbnails;
    updateMessages.thumbnails = `${JSON.stringify(oldThumbnails)} => ${JSON.stringify(thumbnails)}`;
    dataProducts[productIndex].thumbnails = thumbnails;
    productUpdated = true;
  }

  if (!productUpdated) {
    return res.status(304).end();
  }

  writeProductsToFile(dataProducts);
  return res.status(200).json({ Modificaciones: updateMessages });
};

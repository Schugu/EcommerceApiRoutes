import fs from 'fs';
import moment from "moment"

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

  res.json(dataProducts);
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
  const { code } = req.body;
  
  const dataProducts = readProductsFromFile();

  if (dataProducts.some((product) => product.code === code)) {
    return res.status(400).json({ message: `El producto con el código ${code} ya existe.` });
  }

  const newProduct = {
    id: Date.now(),
    status: true,
    Time: moment().format('YYYY-MM-DD HH:mm:ss'),
    ...req.body
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

  const product = dataProducts[productIndex];
  const updateMessages = {};
  let productUpdated = false;

  const arraysAreEqual = (arr1, arr2) => arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);

  const updateField = (field, newValue) => {
    if (newValue !== undefined) { // Solo actualizar si newValue está definido
      if (field === "thumbnails") {
        if (!arraysAreEqual(product[field] || [], newValue)) {
          updateMessages[field] = `${JSON.stringify(product[field])} => ${JSON.stringify(newValue)}`;
          product[field] = newValue;
          productUpdated = true;
        }
      } else if (product[field] !== newValue) {
        updateMessages[field] = `${product[field]} => ${newValue}`;
        product[field] = newValue;
        productUpdated = true;
      }
    }
  };

  ["title", "description", "code", "price", "stock", "category", "thumbnails"].forEach(field => updateField(field, req.body[field]));

  if (!productUpdated) {
    return res.status(304).end();
  }

  product.updated = moment().format('YYYY-MM-DD HH:mm:ss');
  dataProducts[productIndex] = product;
  writeProductsToFile(dataProducts);

  return res.status(200).json({ Modificaciones: updateMessages, actualizado: product.updated });
};
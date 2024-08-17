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
    return [];
  }
};

const dataProducts = readProductsFromFile();

const writeProductsToFile = (products) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to the file:', error);
  }
};

export class ProductModel {
  static async getAll({ code, category, title }) {
    if (code) {
      return dataProducts.filter(
        product => product.code.includes(code)
      );
    }

    if (category) {
      return dataProducts.filter(
        product => product.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (title) {
      return dataProducts.filter(
        product => product.title.toLowerCase() === title.toLowerCase()
      );
    }

    return dataProducts;
  }

  static async getById({ productId }) {
    const productFound = dataProducts.find((product) => product.id === productId);

    if (!productFound) {
      return { notFound: true };
    }

    return productFound;
  }

  static async newProduct(input) {
    if (dataProducts.some((product) => product.code === input.code)) {
      return { found: true };
    }

    const newProduct = {
      id: Date.now(),
      status: true,
      Time: moment().format('YYYY-MM-DD HH:mm:ss'),
      ...input
    };

    dataProducts.push(newProduct);
    writeProductsToFile(dataProducts);

    return newProduct;
  }

  static async deleteProduct({ productId }) {
    const productIndex = dataProducts.findIndex((product) => product.id === productId);

    if (productIndex === -1) {
      return { notFound: true };
    }

    const [deletedProduct] = dataProducts.splice(productIndex, 1);
    writeProductsToFile(dataProducts);

    return deletedProduct;
  }

  static async updateProduct(input, productId) {
    const productIndex = dataProducts.findIndex((product) => product.id === productId);

    if (productIndex === -1) {
      return { notFound: true };
    }

    const product = dataProducts[productIndex];
    const updateMessages = {};
    let productUpdated = false;

    const arraysAreEqual = (arr1, arr2) =>
      arr1.length === arr2.length && arr1.every((value, index) => value === arr2[index]);

    const updateField = (field, newValue) => {
      if (newValue !== undefined) {
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

    ["title", "description", "code", "price", "stock", "category", "thumbnails"].forEach(field =>
      updateField(field, input[field])
    );

    if (!productUpdated) {
      return { updated: false };
    }

    product.updated = moment().format('YYYY-MM-DD HH:mm:ss');
    dataProducts[productIndex] = product;
    writeProductsToFile(dataProducts);

    return { updated: true, Modificaciones: updateMessages, actualizado: product.updated };
  }
}
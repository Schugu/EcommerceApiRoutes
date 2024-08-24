import fs from 'fs';
import moment from "moment"

const filePath = 'src/dataBase/carts.json';

const readCartsFromFile = () => {
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

const dataCarts = readCartsFromFile();

const writeCartsFromFile = (products) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to the file:', error);
  }
};

export class CartModel {
  static async getAll() {
    return dataCarts;
  }

  static async getById({ cartId }) {
    const cartFound = dataCarts.find((cart) => cart.id === cartId);

    if (!cartFound) {
      return { notFound: true };
    }

    return cartFound;
  }

  static async newCart(input) {
    const newCart = {
      id: Date.now(),
      Time: moment().format('YYYY-MM-DD HH:mm:ss'),
      ...input
    };

    dataCarts.push(newCart);
    writeCartsFromFile(dataCarts);
    return newCart;
  }

  static async deleteCart({ cartId }) {
    const cartIndex = dataCarts.findIndex((cart) => cart.id === cartId);

    if (cartIndex === -1) {
      return { notFound: true };
    }

    const [deletedCart] = dataCarts.splice(cartIndex, 1);
    writeCartsFromFile(dataCarts);
    return deletedCart
  }

  static async newProduct(input, cartId) {
    const { product, quantity } = input;

    const cartFound = dataCarts.find((cart) => cart.id === cartId);

    if (!cartFound) {
      return { notFound: true };
    }

    const productIndex = cartFound.products.findIndex((item) => item.product === product);

    if (productIndex === -1) {
      const newProduct = { product, quantity };
      cartFound.products.push(newProduct);
      writeCartsFromFile(dataCarts);
      return { newProduct, status: 'created' };
    } else {
      cartFound.products[productIndex].quantity += quantity;
      writeCartsFromFile(dataCarts);
      return { updatedProduct: cartFound.products[productIndex], status: 'updated' };
    }
  }

  static async getProductOnCart({ cartId, productId }) {
    const cartFound = dataCarts.find((cart) => cart.id === cartId);

    if (!cartFound) {
      return { notFound: true };
    }

    const productFound = cartFound.products.find((item) => item.product === productId);

    if (!productFound) {
      return { productNotFound: true };
    }

    return productFound;
  }

  static async updateProductOnCart({ cartId, productId, quantity }) {
    const cartFound = dataCarts.find((cart) => cart.id === cartId);

    if (!cartFound) {
      return { notFound: true };
    }

    const productIndex = cartFound.products.findIndex((item) => item.product === productId);

    if (productIndex === -1) {
      return { productNotFound: true };
    }

    let productUpdated = false;
    const updateMessages = {};

    if (quantity !== undefined && quantity !== cartFound.products[productIndex].quantity) {
      const oldQuantity = cartFound.products[productIndex].quantity;
      updateMessages.quantity = `${oldQuantity} => ${quantity}`;
      cartFound.products[productIndex].quantity = quantity;
      productUpdated = true;
    }

    if (!productUpdated) {
      return { productUpdated: false };
    }

    cartFound.updated = moment().format('YYYY-MM-DD HH:mm:ss');
    writeCartsFromFile(dataCarts);

    return { productUpdated: true, updates: updateMessages };
  }

  static async deleteProductOnCart({ cartId, productId }) {
    const cartFound = dataCarts.find((cart) => cart.id === cartId);

    if (!cartFound) {
      return { notFound: true };
    }

    const productIndex = cartFound.products.findIndex((item) => item.product === productId);

    if (productIndex === -1) {
      return { productNotFound: true };
    }

    const [deletedProduct] = cartFound.products.splice(productIndex, 1);
    writeCartsFromFile(dataCarts);

    return deletedProduct;
  }
}
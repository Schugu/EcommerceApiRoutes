import mysql from "mysql2/promise";
import moment from "moment"

const config = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  database: 'ecommercedb'
}

const connection = await mysql.createConnection(config);

export class CartModel {
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

  static async getAll({ cart_id, product_id, quantity }) {
    if (cart_id) {
      const [dataCarts] = await connection.query(
        `SELECT * FROM cart_items WHERE cart_id = ?`,
        [cart_id]
      );

      if (dataCarts.length === 0) {
        return null;
      }

      return dataCarts;
    }

    if (product_id) {
      const [dataCarts] = await connection.query(
        `SELECT * FROM cart_items WHERE product_id = ?`,
        [product_id]
      );

      if (dataCarts.length === 0) {
        return null;
      }

      return dataCarts;
    }

    if (quantity) {
      const [dataCarts] = await connection.query(
        `SELECT * FROM cart_items WHERE quantity = ?`,
        [quantity]
      );

      if (dataCarts.length === 0) {
        return null;
      }

      return dataCarts;
    }


    const [dataCarts] = await connection.query(
      'SELECT id, cart_id, product_id, quantity FROM cart_items'
    )

    return dataCarts;
  }

  static async getById({ cartId }) {
    const [dataCarts] = await connection.query(
      `SELECT p.id, ci.quantity FROM cart_items ci
        JOIN product p ON ci.product_id = p.id WHERE ci.cart_id = ?;`,
      [cartId]
    );

    if (dataCarts.length === 0) {
      return null;
    }

    return dataCarts;
  }

  static async getProduct({ cartId, productId }) {
    const [cartFound] = await connection.query(
      `SELECT id FROM carts WHERE id = ?;`,
      [cartId]
    );

    if (cartFound.length === 0) {
      return { notFound: true };
    }

    const [productFound] = await connection.query(
      `SELECT p.title, ci.quantity FROM cart_items ci
        JOIN product p ON ci.product_id = p.id WHERE
        ci.cart_id = 1 AND p.id = ?;`,
      [productId]
    );

    if (!productFound) {
      return { productNotFound: true };
    }

    const [product] = await connection.query(
      `SELECT c.id AS cart_id, p.title as product, ci.quantity, p.price as price_per_unit
        FROM carts c
        JOIN cart_items ci ON c.id = ci.cart_id
        JOIN product p ON ci.product_id = p.id
        WHERE c.id = 1 AND p.id = 2;`
    );

    return product;
  }

  static async updateProduct({ cartId, productId, quantity }) {
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

  static async delete({ cartId }) {
    const cartIndex = dataCarts.findIndex((cart) => cart.id === cartId);

    if (cartIndex === -1) {
      return { notFound: true };
    }

    const [deletedCart] = dataCarts.splice(cartIndex, 1);
    writeCartsFromFile(dataCarts);
    return deletedCart
  }

  static async deleteProduct({ cartId, productId }) {
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
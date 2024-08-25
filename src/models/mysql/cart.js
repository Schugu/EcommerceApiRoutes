import mysql from "mysql2/promise";

const config = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  database: 'ecommercedb'
}

const connection = await mysql.createConnection(config);

export class CartModel {
  // GESTIÓN DE CARRITOS
  static async newCart(input) {
    const [cartFound] = await connection.query(
      `SELECT * FROM carts WHERE user_id = (?)`,
      [input.user_id]
    );

    if (cartFound.length >= 1) {
      return null;
    }

    try {
      await connection.query(
        'INSERT INTO carts (user_id) VALUES (?)', [input.user_id]
      );

      const [cartFound] = await connection.query(
        `SELECT * FROM carts WHERE user_id = (?)`,
        [input.user_id]
      );

      return cartFound;

    } catch (error) {
      throw new Error('Error al crear un nuevo carrito.');
    }
  }

  static async getAll({ user_id }) {
    if (user_id) {
      const [dataCart] = await connection.query(
        `SELECT * FROM carts WHERE user_id = ?`,
        [user_id]
      );

      if (dataCart.length === 0) {
        return null;
      }

      return dataCart;
    }

    try {
      const [dataCarts] = await connection.query(
        'SELECT id, user_id, created_at FROM carts'
      )

      return dataCarts;
    } catch (error) {
      throw new Error("Error al encontrar los carritos.");
    }

  }

  static async getById({ cartId }) {
    console.log(cartId)
    try {
      const [cartFound] = await connection.query(
        `SELECT * FROM cart_items WHERE cart_id = ?`,
        [cartId]
      );

      if (cartFound.length === 0) {
        return null;
      }

      return cartFound;
    } catch (error) {
      throw new Error("Error al encontrar el carrito.")
    }
  }

  static async delete({ cartId }) {
    const [cartFound] = await connection.query(
      `SELECT * FROM carts WHERE id = (?)`,
      [cartId]
    );

    if (cartFound.length === 0) {
      return null;
    }

    try {
      await connection.query(
        `DELETE FROM carts WHERE id = ?`,
        [cartId]
      );

      return cartFound;
    } catch (error) {
      throw new Error('Error al eliminar el producto.')
    }
  }


  // GESTIÓN DE PRODUCTOS DE CARRITOS
  static async addProduct({ input, cartId }) {
    const { product_id, quantity } = input;

    const [cartFound] = await connection.query(
      `SELECT * FROM carts WHERE id = ?`,
      [cartId]
    );

    if (cartFound.length === 0) {
      return { cartNotFound: true };
    }

    const [productFound] = await connection.query(
      `SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?`, [cartId, product_id]
    );

    if (productFound.length === 0) {
      const newProduct = { product_id, quantity };

      try {
        await connection.query(
          `INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)`,
          [cartId, product_id, quantity]
        );

        return { newProduct, status: 'created' };
      } catch (error) {
        throw new Error('Error al añadir el producto.');
      }
    } else {
      const newQuantity = quantity + productFound[0].quantity;
      const updatedProduct = { product_id, quantity: newQuantity };

      try {
        await connection.query(
          `UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?`,
          [newQuantity, cartId, product_id]
        );

        return { updatedProduct, status: 'updated' };

      } catch (error) {
        throw new Error('Error al actualizar el producto.');
      }
    };
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
      `SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?`, [cartId, productId]
    );

    if (productFound.length === 0) {
      return { productNotFound: true };
    }

    const [product] = await connection.query(
      `SELECT c.id AS cart_id, p.*, ci.quantity, p.price as price_per_unit
        FROM carts c
        JOIN cart_items ci ON c.id = ci.cart_id
        JOIN product p ON ci.product_id = p.id
        WHERE c.id = (?) AND p.id = (?);`, [cartId, productId]
    );

    return product;
  }

  static async deleteProduct({ cartId, productId }) {
    const [cartFound] = await connection.query(
      `SELECT * FROM carts WHERE id = ?`,
      [cartId]
    );

    if (cartFound.length === 0) {
      return { cartNotFound: true };
    }

    const [productFound] = await connection.query(
      `SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?`, [cartId, productId]
    );

    if (productFound.length === 0) {
      return { productNotFound: true };
    } else {
      try {
        await connection.query(
          `DELETE FROM cart_items
           WHERE cart_id = ? AND product_id = ?`,
          [cartId, productId]
        );
        return productFound;
      } catch (error) {
        throw new Error("Error al eliminar el producto.")
      }
    }
  }
}
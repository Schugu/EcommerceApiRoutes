import moment from "moment"
import mysql from "mysql2/promise";

const config = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'ecommercedb'
}

const connection = await mysql.createConnection(config);

export class ProductModel {
  static async newProduct(input) {
    const { title, description, code, price, stock, category } = input;

    const [productFound] = await connection.query(
      `SELECT * FROM product WHERE LOWER(code) = LOWER(?)`,
      [code]
    );

    if (productFound.length >= 1) {
      return null;
    }

    try {
      await connection.query(
        'INSERT INTO product (title, description, code, price, stock, category) VALUES (?, ?, ?, ?, ?, ?)',
        [title, description, code, price, stock, category]
      );
      const [productFound] = await connection.query(
        `SELECT * FROM product WHERE LOWER(code) = LOWER(?)`,
        [code]
      );
      return productFound;

    } catch (error) {
      throw new error('Error al crear un nuevo producto.');
    }
  }

  static async getAll({ code, category, title }) {
    if (code) {
      const [dataProducts] = await connection.query(
        `SELECT * FROM product WHERE LOWER(code) = LOWER(?)`,
        [code]
      );

      if (dataProducts.length === 0) {
        return null;
      }

      return dataProducts;
    }

    if (category) {
      const [dataProducts] = await connection.query(
        `SELECT * FROM product WHERE LOWER(category) = LOWER(?)`,
        [category]
      );

      if (dataProducts.length === 0) {
        return null;
      }

      return dataProducts;
    }

    if (title) {
      const [dataProducts] = await connection.query(
        `SELECT * FROM product WHERE LOWER(title) = LOWER(?)`,
        [title]
      );

      if (dataProducts.length === 0) {
        return null;
      }

      return dataProducts;
    }

    const [dataProducts] = await connection.query(
      'SELECT id, title, description, code, price, status, stock, category FROM product'
    )

    return dataProducts;
  }

  static async getById({ productId }) {
    const [dataProducts] = await connection.query(
      `SELECT * FROM product WHERE id = ?`,
      [productId]
    );

    if (dataProducts.length === 0) {
      return null;
    }

    return dataProducts;
  }

  static async update(input, productId) {
    const { title, description, code, price, stock, category } = input;

    const [dataProducts] = await connection.query(
      `SELECT * FROM product WHERE id = ?`,
      [productId]
    );

    if (dataProducts.length === 0) {
      return null;
    }

    const [existingCode] = await connection.query(
      `SELECT * FROM product WHERE LOWER(code) = LOWER(?) AND id != ?`,
      [code, productId]
    );

    if (existingCode.length > 0) {
      return null;
    }

    try {
      await connection.query(
        `UPDATE product
            SET title = ?, description = ?, code = ?, price = ?, stock = ?, category = ?, updated = ?
            WHERE id = ?`,
        [title, description, code, price, stock, category, moment().format('YYYY-MM-DD HH:mm:ss'), productId]
      );

      const [productFound] = await connection.query(
        `SELECT * FROM product WHERE id = ?`,
        [productId]
      );

      return productFound;
    } catch (error) {
      throw new Error('Error al actualizar este producto.');
    }
  }

  static async delete({ productId }) {
    const [productFound] = await connection.query(
      `SELECT * FROM product WHERE id = (?)`,
      [productId]
    );

    if (productFound.length === 0) {
      return null;
    }

    try {
      await connection.query(
        `DELETE FROM product WHERE id = ?`,
        [productId]
      );


      return productFound;
    } catch (error) {
      throw new error('Error al eliminar el producto.')
    }

  }
}
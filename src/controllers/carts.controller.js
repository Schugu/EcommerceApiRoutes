import { CartModel } from "../models/mysql/cart.js";


export class CartController {
  static async newCart(req, res) {
    try {
      const result = await CartModel.newCart(req.body);

      if (!result) {
        return res.status(400).json({ message: `Error al crear el carrito.` });
      }

      return res.status(201).json({ message: "Carrito creado exitosamente.", cart: result });
    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  }

  static async addProduct(req, res) {
    const cartId = parseInt(req.params.cartId, 10);

    if (isNaN(cartId)) {
      return res.status(400).json({ message: "ID de carrito inválido. Debe ser un número." });
    }

    try {
      const result = await CartModel.addProduct({ input: req.body, cartId });

      if (!result) {
        return res.status(400).json({ message: `Error al añadir el producto.` });
      }

      if (result.cartNotFound) {
        return res.status(404).json({ message: `No se encontró el carrito con el ID: ${cartId}.` });
      }

      if (result.status === 'created') {
        return res.status(201).json({
          message: "Producto agregado al carrito exitosamente.",
          product: result.newProduct
        });
      }

      if (result.status === 'updated') {
        return res.status(200).json({
          message: "Cantidad del producto actualizada exitosamente.",
          product: result.updatedProduct
        });
      }
    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  }

  static async getAll(req, res) {
    const { user_id } = req.query;

    try {
      const result = await CartModel.getAll({ user_id });

      if (!result) {
        return res.status(400).json({ message: "No se encontraron carritos." });
      }

      res.json(result);

    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  }

  static async getById(req, res) {
    const cartId = parseInt(req.params.cartId, 10);

    if (isNaN(cartId)) {
      return res.status(400).json({ message: "ID de carrito inválido. Debe ser un número." });
    }

    try {
      const result = await CartModel.getById({ cartId });

      if (!result) {
        return res.status(404).json({ message: `No se encontró el carrito con el ID: ${cartId}.` });
      }

      res.json(result);
    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  }

  static async getProduct(req, res) {
    const cartId = parseInt(req.params.cartId, 10);
    const productId = req.params.productId;

    if (isNaN(cartId)) {
      return res.status(400).json({ message: "ID de carrito inválido. Debe ser un número." });
    }

    try {
      const result = await CartModel.getProduct({ cartId, productId });

      if (result.notFound) {
        return res.status(404).json({ message: `No se encontró el carrito con el ID: ${cartId}.` });
      }

      if (result.productNotFound) {
        return res.status(404).json({ message: `No existe ningún producto con el ID: ${req.params.productId}` });
      }

      return res.json(result);
    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  }

  static async delete(req, res) {
    const cartId = parseInt(req.params.cartId, 10);

    if (isNaN(cartId)) {
      return res.status(400).json({ message: "ID de carrito inválido. Debe ser un número." });
    }

    try {
      const result = await CartModel.delete({ cartId });

      if (result.notFound) {
        return res.status(404).json({ message: `No se encontró el carrito con el ID: ${cartId}.` });
      }

      res.status(200).json({ message: `Carrito con el ID: ${cartId} eliminado exitosamente.`, cart: result });
    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  }

  static async deleteProduct(req, res) {
    const cartId = parseInt(req.params.cartId, 10);
    const productId = req.params.productId;

    if (isNaN(cartId)) {
      return res.status(400).json({ message: "ID de carrito inválido. Debe ser un número." });
    }

    try {
      const result = await CartModel.deleteProduct({ cartId, productId });

      if (result.cartNotFound) {
        return res.status(404).json({ message: `No se encontró el carrito con el ID: ${cartId}.` });
      }

      if (result.productNotFound) {
        return res.status(404).json({ message: `No existe ningún producto con el ID: ${productId}.` });
      }

      return res.status(200).json({
        message: `Producto con el ID: ${productId} eliminado del carrito con el ID: ${cartId}.`,
        deletedProduct: result
      });
    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  }
}
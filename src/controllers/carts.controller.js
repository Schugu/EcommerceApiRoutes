import { CartModel } from "../models/cart.js";


export const newCart = async (req, res) => {
  try {
    const result = await CartModel.newCart(req.body);

    if (!result) {
      return res.status(400).json({ message: `Error al crear el carrito.` });
    }

    return res.status(201).json({ message: "Carrito creado exitosamente.", cart: result });
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
  }
};

export const getCarts = async (req, res) => {
  try {
    const result = await CartModel.getAll()
    res.json(result);

  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
  }
};

export const getCart = async (req, res) => {
  const cartId = parseInt(req.params.cartId, 10);

  if (isNaN(cartId)) {
    return res.status(400).json({ message: "ID de carrito inválido. Debe ser un número." });
  }

  try {
    const result = await CartModel.getById({ cartId });

    if (result.notFound) {
      return res.status(404).json({ message: `No se encontró el carrito con el ID: ${cartId}.` });
    }

    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
  }
};

export const deleteCart = async (req, res) => {
  const cartId = parseInt(req.params.cartId, 10);

  if (isNaN(cartId)) {
    return res.status(400).json({ message: "ID de carrito inválido. Debe ser un número." });
  }

  try {
    const result = await CartModel.deleteCart({ cartId });

    if (result.notFound) {
      return res.status(404).json({ message: `No se encontró el carrito con el ID: ${cartId}.` });
    }

    res.status(200).json({ message: `Carrito con el ID: ${cartId} eliminado exitosamente.`, result });
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
  }
};

export const newProductOnCart = async (req, res) => {
  const cartId = parseInt(req.params.cartId, 10);

  if (isNaN(cartId)) {
    return res.status(400).json({ message: "ID de carrito inválido. Debe ser un número." });
  }

  try {
    const result = await CartModel.newProduct(req.body, cartId);

    if (result.notFound) {
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
};

export const getProductOnCart = async (req, res) => {
  const cartId = parseInt(req.params.cartId, 10);
  const productId = req.params.productId;

  if (isNaN(cartId)) {
    return res.status(400).json({ message: "ID de carrito inválido. Debe ser un número." });
  }

  try {
    const result = await CartModel.updateProductOnCart({ cartId, productId });

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
};

export const updateProductOnCart = async (req, res) => {
  const cartId = parseInt(req.params.cartId, 10);
  const productId = req.params.productId;
  const { quantity } = req.body;

  if (isNaN(cartId)) {
    return res.status(400).json({ message: "ID de carrito inválido. Debe ser un número." });
  }

  try {
    const result = await CartModel.updateProductOnCart({ cartId, productId, quantity });

    if (result.notFound) {
      return res.status(404).json({ message: `No se encontró el carrito con el ID: ${cartId}.` });
    }

    if (result.productNotFound) {
      return res.status(404).json({ message: `No existe ningún producto con el ID: ${productId}.` });
    }

    if (!result.productUpdated) {
      return res.status(304).json({ message: "No se realizaron cambios." });
    }

    return res.status(200).json({
      message: `Producto con el ID: ${productId} actualizado exitosamente.`,
      updates: result.updates
    });
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
  }
};


export const deleteProductOnCart = async (req, res) => {
  const cartId = parseInt(req.params.cartId, 10);
  const productId = req.params.productId;

  if (isNaN(cartId)) {
      return res.status(400).json({ message: "ID de carrito inválido. Debe ser un número." });
  }

  try {
      const result = await CartModel.deleteProductOnCart({ cartId, productId });

      if (result.notFound) {
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
};


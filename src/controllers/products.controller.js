import { ProductModel } from "../models/product.js";

export const getProducts = async (req, res) => {
  const { code, category, title } = req.query;

  try {
    const result = await ProductModel.getAll({ code, category, title });
    res.json(result);

  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
  }
};

export const getProduct = async (req, res) => {
  const productId = parseInt(req.params.productId, 10);

  if (isNaN(productId)) {
    return res.status(400).json({ message: "ID de producto inválido. Debe ser un número." });
  }

  try {
    const result = await ProductModel.getById({ productId });

    if (result.notFound) {
      return res.status(404).json({ message: `No existe ningún producto con el ID: ${productId}` });
    }

    res.json(result);
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
  }
};

export const newProduct = async (req, res) => {
  try {
    const result = await ProductModel.newProduct(req.body);

    if (result.found) {
      return res.status(400).json({ message: `El producto con el código ${req.body.code} ya existe.` });
    }

    return res.status(201).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  const productId = parseInt(req.params.productId, 10);

  if (isNaN(productId) || productId < 1) {
    return res.status(400).json({ message: "El ID debe ser un número mayor a 0." });
  }

  try {
    const result = await ProductModel.deleteProduct({ productId });

    if (result.notFound) {
      return res.status(404).json({ message: `No existe ningún producto con el ID: ${productId}` });
    }

    return res.status(200).json({ message: `Producto con ID ${productId} eliminado`, result });
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  const productId = parseInt(req.params.productId, 10);

  if (isNaN(productId) || productId < 1) {
    return res.status(400).json({ message: "El ID debe ser un número mayor a 0." });
  }

  try {
    const result = await ProductModel.updateProduct(req.body, productId);

    if (result.notFound) {
      return res.status(404).json({ message: `No existe ningún producto con el ID: ${productId}` });
    }

    if (!result.updated) {
      return res.status(304).end();
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
  }
};

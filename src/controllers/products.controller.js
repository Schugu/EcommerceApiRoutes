export class ProductController {
  constructor({ productModel }) {
    this.productModel = productModel;
  }

  newProduct = async (req, res) => {
    try {
      const result = await this.productModel.newProduct(req.body);

      if (!result) {
        return res.status(400).json({ message: `El producto con el código ${req.body.code} ya existe.` });
      }

      return res.status(201).json(result);
    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  }

  getAll = async (req, res) => {
    const { code, category, title } = req.query;

    try {
      const result = await this.productModel.getAll({ code, category, title });

      if (!result) {
        return res.status(400).json({ message: "No se encontraron productos." });
      }

      res.json(result);

    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  }

  getById = async (req, res) => {
    const productId = parseInt(req.params.productId, 10);

    if (isNaN(productId)) {
      return res.status(400).json({ message: "ID de producto inválido. Debe ser un número." });
    }

    try {
      const result = await this.productModel.getById({ productId });

      if (!result) {
        return res.status(404).json({ message: `No existe ningún producto con el ID: ${productId}` });
      }

      res.json(result);
    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  }

  update = async (req, res) => {
    const productId = parseInt(req.params.productId, 10);

    if (isNaN(productId) || productId < 1) {
      return res.status(400).json({ message: "El ID debe ser un número mayor a 0." });
    }

    try {
      const result = await this.productModel.update(req.body, productId);

      if (!result) {
        return res.status(404).json({ message: `No existe ningún producto con el ID: ${productId}` });
      }

      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  }

  delete = async (req, res) => {
    const productId = parseInt(req.params.productId, 10);

    if (isNaN(productId) || productId < 1) {
      return res.status(400).json({ message: "El ID debe ser un número mayor a 0." });
    }

    try {
      const result = await this.productModel.delete({ productId });

      if (!result) {
        return res.status(404).json({ message: `No existe ningún producto con el ID: ${productId}` });
      }

      return res.status(200).json({ message: `Producto con ID ${productId} eliminado`, result });
    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  }
}
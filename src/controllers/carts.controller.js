export class CartController {
  constructor({ cartModel }) {
    this.cartModel = cartModel;
  }

  newCart = async (req, res) => {
    try {
      const result = await this.cartModel.newCart(req.body);

      if (!result) {
        return res.status(400).json({ message: `Error al crear el carrito.` });
      }

      return res.status(201).json({ message: "Carrito creado exitosamente.", cart: result });
    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  }

  addProduct = async (req, res) => {
    const cartId = parseInt(req.params.cartId, 10);

    if (isNaN(cartId)) {
      return res.status(400).json({ message: "ID de carrito inválido. Debe ser un número." });
    }

    try {
      const result = await this.cartModel.addProduct({ input: req.body, cartId });

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

  getAll = async (req, res) => {
    const { user_id } = req.query;

    try {
      const result = await this.cartModel.getAll({ user_id });

      if (!result) {
        return res.status(400).json({ message: "No se encontraron carritos." });
      }

      res.json(result);

    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  }

  getById = async (req, res) => {
    const cartId = parseInt(req.params.cartId, 10);

    if (isNaN(cartId)) {
      return res.status(400).json({ message: "ID de carrito inválido. Debe ser un número." });
    }

    try {
      const result = await this.cartModel.getById({ cartId });

      if (!result) {
        return res.status(404).json({ message: `No se encontró el carrito con el ID: ${cartId}.` });
      }

      res.json(result);
    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  }

  getProduct = async (req, res) => {
    const cartId = parseInt(req.params.cartId, 10);
    const productId = req.params.productId;

    if (isNaN(cartId)) {
      return res.status(400).json({ message: "ID de carrito inválido. Debe ser un número." });
    }

    try {
      const result = await this.cartModel.getProduct({ cartId, productId });

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

  delete = async (req, res) => {
    const cartId = parseInt(req.params.cartId, 10);

    if (isNaN(cartId)) {
      return res.status(400).json({ message: "ID de carrito inválido. Debe ser un número." });
    }

    try {
      const result = await this.cartModel.delete({ cartId });

      if (result.notFound) {
        return res.status(404).json({ message: `No se encontró el carrito con el ID: ${cartId}.` });
      }

      res.status(200).json({ message: `Carrito con el ID: ${cartId} eliminado exitosamente.`, cart: result });
    } catch (error) {
      return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
    }
  }

  deleteProduct = async (req, res) => {
    const cartId = parseInt(req.params.cartId, 10);
    const productId = req.params.productId;

    if (isNaN(cartId)) {
      return res.status(400).json({ message: "ID de carrito inválido. Debe ser un número." });
    }

    try {
      const result = await this.cartModel.deleteProduct({ cartId, productId });

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


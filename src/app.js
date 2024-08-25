import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import logger from "morgan";
import moment from "moment";

import { createProductRouter } from './routes/products.routes.js';
import { createCartRouter } from './routes/carts.routes.js';

dotenv.config(); 

export const createApp = ({ productModel, cartModel }) => {
  const PORT = parseInt(process.env.PORT ?? "3000", 10);
  const HOST = process.env.HOST ?? "localhost";
  const CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:5173';

  const app = express();

  // Middlewares
  app.use(cors({
    origin: CORS_ORIGIN,
    credentials: true,
  }));

  app.disable("x-powered-by");
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(logger("dev"));

  app.use(function (req, res, next) {
    console.log("Time:", moment().format('YYYY-MM-DD HH:mm:ss'));
    next();
  });

  // Rutas
  app.use('/api', createProductRouter({ productModel }));
  app.use('/api', createCartRouter({ cartModel }));

  // Manejo de rutas no encontradas
  app.use((req, res) => {
    res.status(404).send('Ruta no encontrada :/');
  });

  // Iniciar el servidor
  app.listen(PORT, HOST, (error) => {
    if (error) {
      console.error('Error al iniciar el servidor:', error);
    } else {
      console.log(`Server is running on http://${HOST}:${PORT}`);
    }
  });
}

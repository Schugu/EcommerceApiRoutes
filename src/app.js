import express from 'express';
import cors from "cors";
import logger from "morgan"
import moment from "moment"

import productsRoutes from './routes/products.routes.js';
import cartsRoutes from './routes/carts.routes.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.disable("x-powered-by");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"))
app.use(function (req, res, next) {
  console.log("Time:", moment().format('YYYY-MM-DD HH:mm:ss'));
  next();
})

app.use('/api', productsRoutes);
app.use('/api', cartsRoutes);

app.use((req, res) => {
  res.status(404).send('Ruta no encontrada :/');
});
export default app;

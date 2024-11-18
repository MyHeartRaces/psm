import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import productsRouter from './routes/products';
import stocksRouter from './routes/stocks';
import storesRouter from './routes/stores';

dotenv.config();

const app = express();
app.use(bodyParser.json());

app.use('/products', productsRouter);
app.use('/stocks', stocksRouter);
app.use('/stores', storesRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

import express from 'express';
import { createStock, increaseStock, decreaseStock, getStocks } from '../controllers/stocksController';

const router = express.Router();

router.post('/', createStock);
router.put('/increase', increaseStock);
router.put('/decrease', decreaseStock);
router.get('/', getStocks);

export default router;

import express from 'express';
import { createStore, getStores } from '../controllers/storesController';

const router = express.Router();

router.post('/', createStore);
router.get('/', getStores);

export default router;

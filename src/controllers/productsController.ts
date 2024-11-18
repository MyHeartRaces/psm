import { Request, Response } from 'express';
import { pool } from '../models/db';
import { Product } from '../models/product';
import axios from 'axios';

const ACTION_HISTORY_SERVICE_URL = process.env.ACTION_HISTORY_SERVICE_URL;

export const createProduct = async (req: Request, res: Response): Promise<void> => {
    const { plu, name } = req.body as Product;

    try {
        const result = await pool.query(
            'INSERT INTO products (plu, name) VALUES ($1, $2) RETURNING *',
            [plu, name]
        );
        const product = result.rows[0];

        // Log action to Product Action History Service
        await axios.post(`${ACTION_HISTORY_SERVICE_URL}`, {
            action: 'CREATE_PRODUCT',
            product_id: product.id,
            details: { plu, name },
        });

        res.status(201).json(product);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
};

export const getProducts = async (req: Request, res: Response): Promise<void> => {
    const { name, plu } = req.query;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params: (string | number)[] = [];

    if (name) {
        params.push(`%${name}%`);
        query += ` AND name ILIKE $${params.length}`;
    }

    if (plu) {
        params.push(plu as string);
        query += ` AND plu = $${params.length}`;
    }

    try {
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
};

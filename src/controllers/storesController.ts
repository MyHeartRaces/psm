import { Request, Response } from 'express';
import { pool } from '../models/db';

export const createStore = async (req: Request, res: Response): Promise<void> => {
    const { name } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO stores (name) VALUES ($1) RETURNING *',
            [name]
        );
        const store = result.rows[0];
        res.status(201).json(store);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
};

export const getStores = async (req: Request, res: Response): Promise<void> => {
    try {
        const result = await pool.query('SELECT * FROM stores');
        res.json(result.rows);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ error: error.message });
        } else {
            res.status(500).json({ error: 'An unknown error occurred' });
        }
    }
};

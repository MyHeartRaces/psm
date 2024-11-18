import { RequestHandler } from 'express';
import { pool } from '../models/db';
import { Stock } from '../models/stock';
import axios from 'axios';

const ACTION_HISTORY_SERVICE_URL = process.env.ACTION_HISTORY_SERVICE_URL;

export const createStock: RequestHandler = async (req, res) => {
    const { product_id, store_id, quantity_on_shelf, quantity_in_orders } = req.body as Stock;

    try {
        const result = await pool.query(
            'INSERT INTO stocks (product_id, store_id, quantity_on_shelf, quantity_in_orders) VALUES ($1, $2, $3, $4) RETURNING *',
            [product_id, store_id, quantity_on_shelf, quantity_in_orders]
        );
        const stock = result.rows[0];

        // Log action
        await axios.post(`${ACTION_HISTORY_SERVICE_URL}`, {
            action: 'CREATE_STOCK',
            product_id,
            store_id,
            details: { quantity_on_shelf, quantity_in_orders },
        });

        res.status(201).json(stock); // Send response
    } catch (error) {
        res.status(500).json({ error: (error as Error).message || 'An error occurred' });
    }
};

export const increaseStock: RequestHandler = async (req, res) => {
    const { stock_id, amount } = req.body;

    try {
        const result = await pool.query(
            'UPDATE stocks SET quantity_on_shelf = quantity_on_shelf + $1 WHERE id = $2 RETURNING *',
            [amount, stock_id]
        );
        const stock = result.rows[0];

        if (!stock) {
            res.status(404).json({ error: 'Stock record not found' });
            return; // Exit early after sending a response
        }

        // Log action
        await axios.post(`${ACTION_HISTORY_SERVICE_URL}`, {
            action: 'INCREASE_STOCK',
            product_id: stock.product_id,
            store_id: stock.store_id,
            details: { amount },
        });

        res.json(stock); // Send response
    } catch (error) {
        res.status(500).json({ error: (error as Error).message || 'An error occurred' });
    }
};

export const decreaseStock: RequestHandler = async (req, res) => {
    const { stock_id, amount } = req.body;

    try {
        const result = await pool.query(
            'UPDATE stocks SET quantity_on_shelf = quantity_on_shelf - $1 WHERE id = $2 AND quantity_on_shelf >= $1 RETURNING *',
            [amount, stock_id]
        );
        const stock = result.rows[0];

        if (!stock) {
            res.status(400).json({ error: 'Insufficient stock or record not found' });
            return; // Exit early after sending a response
        }

        // Log action
        await axios.post(`${ACTION_HISTORY_SERVICE_URL}`, {
            action: 'DECREASE_STOCK',
            product_id: stock.product_id,
            store_id: stock.store_id,
            details: { amount },
        });

        res.json(stock); // Send response
    } catch (error) {
        res.status(500).json({ error: (error as Error).message || 'An error occurred' });
    }
};

export const getStocks: RequestHandler = async (req, res) => {
    const { plu, store_id, quantity_on_shelf_min, quantity_on_shelf_max, quantity_in_orders_min, quantity_in_orders_max } = req.query;

    let query = `
        SELECT stocks.*, products.plu, products.name
        FROM stocks
                 JOIN products ON stocks.product_id = products.id
        WHERE 1=1
    `;
    const params: (string | number)[] = [];

    if (plu) {
        params.push(plu as string);
        query += ` AND products.plu = $${params.length}`;
    }

    if (store_id) {
        params.push(Number(store_id));
        query += ` AND stocks.store_id = $${params.length}`;
    }

    if (quantity_on_shelf_min) {
        params.push(Number(quantity_on_shelf_min));
        query += ` AND stocks.quantity_on_shelf >= $${params.length}`;
    }

    if (quantity_on_shelf_max) {
        params.push(Number(quantity_on_shelf_max));
        query += ` AND stocks.quantity_on_shelf <= $${params.length}`;
    }

    if (quantity_in_orders_min) {
        params.push(Number(quantity_in_orders_min));
        query += ` AND stocks.quantity_in_orders >= $${params.length}`;
    }

    if (quantity_in_orders_max) {
        params.push(Number(quantity_in_orders_max));
        query += ` AND stocks.quantity_in_orders <= $${params.length}`;
    }

    try {
        const result = await pool.query(query, params);
        res.json(result.rows); // Send response
    } catch (error) {
        res.status(500).json({ error: (error as Error).message || 'An error occurred' });
    }
};

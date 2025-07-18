const express = require('express');
const { v4: uuidv4 } = require('uuid');
const pool = require('./db');

const router = express.Router();

// POST /clans - Create a new clan
router.post('/', async (req, res) => {
  try {
    const { name, region } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const id = uuidv4();
    const query = 'INSERT INTO clans (id, name, region) VALUES ($1, $2, $3) RETURNING id';
    const values = [id, name, region || null];

    const result = await pool.query(query, values);
    
    res.status(201).json({
      id: result.rows[0].id,
      message: 'Clan created successfully.'
    });
  } catch (error) {
    console.error('Error creating clan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /clans - List all clans with optional filtering and sorting
router.get('/', async (req, res) => {
  try {
    const { region, sort } = req.query;
    let query = 'SELECT * FROM clans';
    const values = [];
    const conditions = [];

    if (region) {
      conditions.push(`region = $${values.length + 1}`);
      values.push(region);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    if (sort === 'created_at' || sort === '-created_at') {
      const order = sort.startsWith('-') ? 'DESC' : 'ASC';
      query += ` ORDER BY created_at ${order}`;
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching clans:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /clans/:id - Get a specific clan by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'SELECT * FROM clans WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Clan not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching clan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /clans/:id - Delete a specific clan
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const query = 'DELETE FROM clans WHERE id = $1 RETURNING id';
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Clan not found' });
    }

    res.json({ message: 'Clan deleted successfully' });
  } catch (error) {
    console.error('Error deleting clan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
import express from 'express';
import sql from '../db/db.js';

const router = express.Router();

// GET all widgets for a user
router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const widgets = await sql`SELECT * FROM widgets WHERE user_id = ${user_id}`;
    res.json(widgets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE a new widget
router.post('/', async (req, res) => {
  const { user_id, type, position, data } = req.body;
  try {
    const [newWidget] = await sql`
      INSERT INTO widgets (user_id, type, position, data)
      VALUES (${user_id}, ${type}, ${position}, ${sql.json(data)})
      RETURNING *`;
    res.status(201).json(newWidget);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE a widget's data
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { position, data } = req.body;
  try {
    const [updatedWidget] = await sql`
      UPDATE widgets
      SET position = ${position}, data = ${sql.json(data)}
      WHERE id = ${id}
      RETURNING *`;
    res.json(updatedWidget);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a widget
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await sql`DELETE FROM widgets WHERE id = ${id}`;
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

import express from 'express';
import sql from '../db/db.js';

const router = express.Router();

// GET all todos for a widget
router.get('/:widget_id', async (req, res) => {
  const { widget_id } = req.params;
  try {
    const todos = await sql`SELECT * FROM todos WHERE widget_id = ${widget_id}`;
    res.json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADD a todo item
router.post('/', async (req, res) => {
  const { widget_id, content } = req.body;
  try {
    const [todo] = await sql`
      INSERT INTO todos (widget_id, content)
      VALUES (${widget_id}, ${content})
      RETURNING *`;
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE a todo item
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { content, completed } = req.body;
  try {
    const [updated] = await sql`
      UPDATE todos
      SET content = ${content}, completed = ${completed}
      WHERE id = ${id}
      RETURNING *`;
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a todo
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await sql`DELETE FROM todos WHERE id = ${id}`;
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;



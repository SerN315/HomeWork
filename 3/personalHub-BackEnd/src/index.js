import express from 'express';
import widgetsRouter from './routes/widgets.js';
import todosRouter from './routes/todo.js';
import authRouter from './routes/auth.js';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/widgets', widgetsRouter);
app.use('/api/todos', todosRouter);
app.use('/api', authRouter);


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

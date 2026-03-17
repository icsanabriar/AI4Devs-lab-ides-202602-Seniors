import cors from 'cors';
import express from 'express';
import candidatesRouter from './presentation/routes/candidates';
import { errorHandler } from './middleware/errorHandler';

export const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Hola LTI!');
});

app.use('/candidates', candidatesRouter);

app.use(errorHandler);

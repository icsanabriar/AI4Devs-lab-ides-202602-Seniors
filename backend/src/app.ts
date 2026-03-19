/**
 * Express application setup: CORS, JSON body parser, routes, and error handling.
 */
import cors from 'cors';
import express from 'express';
import candidatesRouter from './presentation/routes/candidates';
import { errorHandler } from './middleware/errorHandler';

/** Main Express app instance. */
export const app = express();

/** Allowed CORS origins: from CORS_ORIGINS (comma-separated) or default http://localhost:3000. */
const corsOrigins = (process.env.CORS_ORIGINS ?? 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);
/** Single origin string or array of origins for the cors middleware. */
const corsOrigin = corsOrigins.length === 1 ? corsOrigins[0]! : corsOrigins;

app.use(cors({ origin: corsOrigin }));
app.use(express.json());

/** Root route health check. */
app.get('/', (_req, res) => {
  res.send('Hola LTI!');
});

app.use('/candidates', candidatesRouter);

app.use(errorHandler);

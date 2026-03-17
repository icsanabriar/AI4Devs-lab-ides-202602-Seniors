/**
 * Backend entry point. Loads environment variables and starts the Express server.
 */
import dotenv from 'dotenv';
import { app } from './app';

dotenv.config();

/** Port the server listens on. */
const port = 3010;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

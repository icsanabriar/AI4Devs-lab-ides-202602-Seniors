/**
 * Backend entry point. Loads environment variables and starts the Express server.
 */
import 'dotenv/config';
import { app } from './app';

/** Port the server listens on. */
const portFromEnv = Number(process.env.PORT);
const port = Number.isFinite(portFromEnv) ? portFromEnv : 3010;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

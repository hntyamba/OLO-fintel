import dotenv from "dotenv";
import path from "path";
import fs from "fs";

const rootEnvPath = path.join(process.cwd(), ".env");
const secretEnvPath = "/etc/secrets/.env";

if (fs.existsSync(secretEnvPath)) {
  console.log(`[Env Loader] Found Render secret file at ${secretEnvPath}. Loading...`);
  dotenv.config({ path: secretEnvPath });
} else if (fs.existsSync(rootEnvPath)) {
  console.log(`[Env Loader] Found local .env file at ${rootEnvPath}. Loading...`);
  dotenv.config({ path: rootEnvPath });
} else {
  console.log("[Env Loader] No .env file found on disk. Relying on system environment variables.");
  dotenv.config();
}

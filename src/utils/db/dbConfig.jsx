import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";
const sql = neon(
  "postgresql://floodguardDb_owner:BlJ07zUdPSIQ@ep-plain-thunder-a2orzlio.eu-central-1.aws.neon.tech/floodguardDb?sslmode=require"
);
export const db = drizzle(sql, { schema });

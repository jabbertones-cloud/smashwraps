import "server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

function getDb() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return null;
  const sql = neon(url);
  return drizzle(sql, { schema });
}

/** Null when `DATABASE_URL` is unset — callers fall back to Resend-only behavior. */
export const db = getDb();

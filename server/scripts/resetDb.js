import fs from 'fs';
import { createPool } from "../db/index.js";

const pool = createPool();

const resetSQL = fs.readFileSync("./db/schemas/reset.sql", "utf8");
const schemaSQL = fs.readFileSync("./db/schemas/schema.sql", "utf8");

async function resetDb() {
    try {
        await pool.query(resetSQL);
        await pool.query(schemaSQL);

        console.log("Database reset complete!");
    } catch (err) {
        console.error("Reset failed:", err);
    } finally {
        await pool.end();
    }
}

resetDb();
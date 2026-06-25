import fs from 'fs';
import { createPool } from "../db/index.js";

const pool = createPool();

const schemaSQL = fs.readFileSync("./db/schemas/schema.sql", "utf8");

async function runSchema() {
    try {
        await pool.query(schemaSQL);
        console.log("Schema executed successfully.");
    } catch (err) {
        console.error('Error executing schema', err);
    } finally {
        await pool.end();
    }
}

runSchema();
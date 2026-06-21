import fs from 'fs';
import path from 'path';
import pg from "pg";
import dotenv from "dotenv";

// Main entry point of the backend server.
//
// Responsibilities:
// - Creates the Express App
// - Enables CORS and JSON parsing (basically just tells the server and frontend how to talk to each other (what format to use))
// - Registers API routes (example: /api/events)
// - Initializes database schema on startup (uses schema.sql and the function runSchema that I made to do that)
// - Optionally seeds database if SEED_DB=true (env stuff, will go over)
// - Starts the server on the configured PORT (will be localhost 3000 probably)
//
// This file just connects everything in the backend.

dotenv.config();

const pool = new pg.Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
});

const myDir = import.meta.dirname;

async function runSchema() {
    try {
        await pool.connect();
        console.log("Database Connected successfully.");

        const sqlPath = path.join(myDir, 'schema.sql');
        const sqlQuery = fs.readFileSync(sqlPath, 'utf8');

        await pool.query(sqlQuery);
        console.log('Schema executed successfully!')
    } catch (err) {
        console.error('Error executing schema:', err);
    }
}

export {pool, runSchema};
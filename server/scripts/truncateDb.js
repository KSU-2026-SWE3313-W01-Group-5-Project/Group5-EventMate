import fs from "fs";
import { createPool } from "../db/index.js";

const pool = createPool();

const truncateSQL = fs.readFileSync("./db/schemas/truncate.sql", "utf8");

async function truncateDb() {
    try {
        await pool.query(truncateSQL);
        console.log("Database truncated successfully!");
    } catch (err) {
        console.error("Error truncating:", err);
    } finally {
        await pool.end();
    }
}

truncateDb();
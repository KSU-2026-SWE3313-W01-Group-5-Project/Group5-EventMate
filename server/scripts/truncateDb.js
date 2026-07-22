import fs from "fs";
import { createPool } from "../db/index.js";

const pool = createPool();

const TABLES = {
    events: "events",
    users: "users",
    event_preferences: "event_preferences",
    venues: "venues",
    event_registrations: "event_registrations",
    connections: "connections",
    conversations: "conversations",
}

const truncateSQL = fs.readFileSync("./db/schemas/truncate.sql", "utf8");

async function truncateDb() {
    const args = process.argv.slice(2);

    const tableArg = args.find(arg => arg.startsWith("--table="));
    const table = tableArg?.split("=")[1];

    const truncateAll = args.includes("--all");

    try {
        if (truncateAll) {
            await pool.query(truncateSQL);
            console.log("All database tables truncated successfully!");
        } else if (table && TABLES[table]) {
            await pool.query(`TRUNCATE TABLE ${TABLES[table]} RESTART IDENTITY CASCADE`);
            console.log("Table truncated successfully:", table);
        } else {
            console.error("Invalid table:", table);
        }
    } catch (err) {
        console.error("Error truncating:", err);
    } finally {
        await pool.end();
    }
}

await truncateDb();
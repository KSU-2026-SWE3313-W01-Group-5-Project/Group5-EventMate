import pg from "pg";
import "../src/utils/env.js";

export function createPool() {
    return new pg.Pool({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,

        ssl: process.env.NODE_ENV === "production" ?
            {
            rejectUnauthorized: false,
        } : false,
    });
}
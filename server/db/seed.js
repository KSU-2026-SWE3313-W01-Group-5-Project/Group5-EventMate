import {pool} from "./index.js";
import {hashPassword} from "../utils/hashPassword.js";

// Seeds the database with initial test data.
//
// Runs after schema setup (optional based on environment variable, I will explain the ENV variable once we set the .env up for everyone).
// Inserts a default "Welcome Event" into the events table.
//
// Useful for development/testing so the database has data immediately.

export default async function runSeed() {
    await pool.query(`
        INSERT INTO events (title, description, event_date)
        VALUES ('Welcome Event', 'First event in database', NOW());
    `);

    const seededHashPassword = await hashPassword('password');

    await pool.query(`
        INSERT INTO users (username, email, password_hash, created_at)
        VALUES ('dylan', 'dylan@dylan.com', $1, NOW())`,
        [seededHashPassword]
    );

    console.log("Databases seeded!")
}
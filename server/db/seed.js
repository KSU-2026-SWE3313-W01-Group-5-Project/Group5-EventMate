import {pool} from "./index.js";

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

    console.log("Databases seeded!")
}
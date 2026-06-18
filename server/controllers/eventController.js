import {pool} from "../db/index.js";

// Handles logic for event-specific API requests.
//
// getEvents:
// - Gets all events from the database "events" (see schema.sql)
// - Sends the result back as JSON response
//
// Acts as the controller layer between routes and the database. We will be setting up controllers for each route (or each specific API endpoint)

export async function getEvents(req, res) {
    const result = await pool.query(
        "SELECT * FROM events"
    );

    res.send(result.rows);
}
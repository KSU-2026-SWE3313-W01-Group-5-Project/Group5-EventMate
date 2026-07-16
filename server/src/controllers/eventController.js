import { createPool } from "../../db/index.js";

const pool = createPool();

// Handles logic for event-specific API requests.
//
// getEvents:
// - Gets all events from the database "events" (see schema.sql)
// - Sends the result back as JSON response
//
// Acts as the controller layer between routes and the database. We will be setting up controllers for each route (or each specific API endpoint)

export async function getEvents(req, res) {
    try {
        const page = Number(req.query.page) || 1;
        const limit = 50;
        const offset = (page - 1) * limit;

        const events = await pool.query(
            `SELECT * FROM events
        ORDER BY last_seen_at
        LIMIT $1
        OFFSET $2`,
            [limit, offset]
        );

        const totalEvents = await pool.query(
            `SELECT COUNT(*) FROM events`
        )

        const totalPages = Math.ceil(totalEvents.rows[0].count / limit);

        res.send({
            events: events.rows,
            page: page,
            limit: limit,
            totalPages: totalPages,
            totalEvents: totalEvents.rows[0].count
        });
    } catch (err) {
        console.error("Error getting events:", err);
    }
}
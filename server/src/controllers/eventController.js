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

        const userId = req.user.id;

        const result = await pool.query(`
            SELECT * FROM user_preferences WHERE user_id = $1`,
            [userId]
        );

        const preferences = result.rows[0];

        const page = Number(req.query.page) || 1;
        const limit = 50;
        const offset = (page - 1) * limit;

        if (!preferences.auto_filter_enabled) {
            const events = await pool.query(
                `SELECT * FROM events
                ORDER BY last_seen_at
                LIMIT $1
                OFFSET $2`,
                [limit, offset]
            );

            const totalEvents = await pool.query(
                `SELECT COUNT(*) FROM events`
            );

            const totalPages = Math.ceil(totalEvents.rows[0].count / limit);

            res.send({
                events: events.rows,
                page: page,
                limit: limit,
                totalPages: totalPages,
                totalEvents: totalEvents.rows[0].count
            });
        } else {
            const segments = [];
            const genres = [];

            const categoryMap = {
                "Music": preferences.music_categories,
                "Sports": preferences.sports_categories,
                "Arts & Theatre": preferences.arts_categories,
            };

            for (const eventType of preferences.event_types) {
                const categories = categoryMap[eventType];

                if (eventType === "Miscellaneous") {
                    genres.push(..."Miscellaneous");
                    segments.push(..."Miscellaneous");
                    continue;
                }

                if (categories.length === 0) {
                    segments.push(eventType);
                } else {
                    genres.push(...categories);
                }
            }

            let venueIds = null;

            if (preferences.state_filter != null) {
                const state = preferences.state_filter;
                const city = preferences.city_filter;

                const filteredVenues = await pool.query(
                    `SELECT id FROM venues
                    WHERE state = $1
                    AND ($2::text IS NULL OR city = $2)`,
                    [state, city]
                );

                venueIds = filteredVenues.rows.map(row => row.id);
            }

            console.log(venueIds);

            const filteredEvents = await pool.query(
                `SELECT * FROM events 
                WHERE (
                    segment = ANY ($1)
                        OR genre = ANY ($2)
                    )
                AND ($3::text[] is NULL OR venue_id = ANY($3))
                ORDER BY last_seen_at
                LIMIT $4
                OFFSET $5`,
                [segments, genres, venueIds, limit, offset]
            );

            const totalEvents = await pool.query(
                `SELECT COUNT(*) FROM events
                WHERE (
                    segment = ANY ($1)
                        OR genre = ANY ($2)
                    )
                AND ($3::text[] is NULL OR venue_id = ANY($3))`,
                [segments, genres, venueIds]
            );

            const totalPages = Math.ceil(totalEvents.rows[0].count / limit);

            res.send({
                events: filteredEvents.rows,
                page: page,
                limit: limit,
                totalPages: totalPages,
                totalEvents: totalEvents.rows[0].count
            });
        }
    } catch (err) {
        console.error("Error getting events:", err);
    }
}

export async function registerForEvent(req, res) {
    const userId = req.user.id;
    const eventId = req.body.params.eventId;
    const occurrence = req.body.params.occurrence;

    if (!userId) {
        return res.status(401).json({ message: "UNAUTHORIZED" });
    }

    if (!eventId) {
        return res.status(400).json({ message: "INVALID_EVENT" });
    }

    if (!occurrence) {
        return res.status(400).json({ message: "INVALID_OCCURRENCE" });
    }

    const eventResult = await pool.query(
        `SELECT id, occurrences
        FROM events
        WHERE id = $1`,
        [eventId]
    );

    if (eventResult.rowCount === 0) {
        return res.status(404).json({ message: "NO_EVENT_FOUND" });
    }

    const occurrenceResult = await pool.query(
        ` SELECT id, occurrences
        FROM events
        WHERE id = $1
        AND $2 = ANY(occurrences)`,
        [eventId, occurrence]
    );

    if (occurrenceResult.rowCount === 0) {
        return res.status(400).json({ message: "OCCURRENCE_UNAVAILABLE" });
    }

    // now add this stuff to the event registrations stuff

    console.log(occurrenceResult);

    console.log(userId);
    console.log(eventId);
    console.log(occurrence);

    return res.status(200).json({
        message: "SUCCESS",
    })
}
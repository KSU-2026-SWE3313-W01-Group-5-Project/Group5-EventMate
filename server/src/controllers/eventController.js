import {createPool} from "../../db/index.js";
import doHaversineFormula from "../utils/doHaversineFormula.js";

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
            SELECT *
            FROM user_preferences
            WHERE user_id = $1`,
            [userId]
        );

        const preferences = result.rows[0];

        const page = Number(req.query.page) || 1;
        const limit = 50;
        const offset = (page - 1) * limit;

        if (!preferences.auto_filter_enabled) {
            const events = await pool.query(
                `SELECT *
                FROM events
                ORDER BY last_seen_at
                LIMIT $1
                OFFSET $2`,
                [limit, offset]
            );

            const totalEvents = await pool.query(
                `SELECT COUNT(*)
                FROM events`
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

            let venues = null;

            if (preferences.state_filter != null && preferences.max_distance == null) {
                const state = preferences.state_filter;
                const city = preferences.city_filter;

                const venuesResponse = await pool.query(
                    `SELECT *
                    FROM venues
                    WHERE state = $1
                    AND ($2::text IS NULL OR city = $2)`,
                    [state, city.city]
                );

                venues = venuesResponse.rows;
            }

            if (preferences.max_distance != null) {
                const state = preferences.state_filter;

                const venuesResponse = await pool.query(
                    `SELECT *
                    FROM venues
                    WHERE state = $1`,
                    [state]
                );

                venues = venuesResponse.rows;

                const lat = preferences.city_filter.lat;
                const lng = preferences.city_filter.lng;

                venues = venues?.filter((venue) => {
                    return doHaversineFormula(lat, lng, venue.latitude, venue.longitude) <= preferences.max_distance;
                })
            }

            const venueIds = Object.values(venues).map((venue) => venue.id)

            const filteredEvents = await pool.query(
                `SELECT *
                FROM events
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
                `SELECT COUNT(*)
                FROM events
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

export async function getEventById(req, res) {
    try {
        const eventId = req.params.event_id;

        const event = await pool.query(
            `SELECT *
                FROM events
                WHERE id = $1`,
            [eventId]
        );

        res.send({
            event: event.rows,
        });
    } catch (err) {
        console.error("Error getting events:", err);
    }
}

export async function registerForEvent(req, res) {
    try {

        // authMiddleware adds the authenticated user's database ID to req.user.
        // Optional chaining prevents an error if req.user is unexpectedly missing.
        const userId = req.user?.id;
        // The frontend sends these values directly in the POST request body.
        const {eventId, occurrence} = req.body;

        if (!userId) {
            return res.status(401).json({message: "UNAUTHORIZED"});
        }

        if (!eventId) {
            return res.status(400).json({message: "INVALID_EVENT"});
        }

        if (!occurrence) {
            return res.status(400).json({message: "INVALID_OCCURRENCE"});
        }

        const eventResult = await pool.query(
            `SELECT id, occurrences
            FROM events
            WHERE id = $1`,
            [eventId]
        );

        if (eventResult.rowCount === 0) {
            return res.status(404).json({message: "NO_EVENT_FOUND"});
        }

        const occurrenceResult = await pool.query(
            ` SELECT id, occurrences
            FROM events
            WHERE id = $1
                AND $2::timestamptz = ANY(occurrences)`,
            [eventId, occurrence]
        );

        if (occurrenceResult.rowCount === 0) {
            return res.status(400).json({message: "OCCURRENCE_UNAVAILABLE"});
        }

        /*
        After confirming the event occurrence is valid, check whether the
        user already has something registered at that exact timestamp.

        Events on the same calendar date are allowed when their times differ.
        */

        const scheduleConflictResult = await pool.query(
            `SELECT event_id
            FROM event_registrations
            WHERE user_id = $1
            AND occurrence = $2`,
            [userId, occurrence]
        );

        if (scheduleConflictResult.rowCount > 0) {
            const existingEventId = scheduleConflictResult.rows[0].event_id;

            // The user selected an event and occurrence already registered.
            if (existingEventId === eventId) {
                return res.status(200).json({
                    message: "ALREADY_REGISTERED"
                });
            }

            // A different event already occupies the exact timestamp.
            return res.status(409).json({
                message: "REGISTRATION_TIME_CONFLICT",
                conflictingEventId: existingEventId
            });
        }

        const registrationResult = await pool.query(
            `INSERT INTO event_registrations (
            user_id,
            event_id,
            occurrence
            )
            VALUES ($1, $2, $3) 
            RETURNING id, event_id, occurrence`,
            [userId, eventId, occurrence]
        );

        // This can happen if another request inserted a registration after
        // the schedule check but before this INSERT completed.
        if (registrationResult.rowCount === 0) {
            return res.status(409).json({
                message: "REGISTRATION_TIME_CONFLICT"
            });
        }

        return res.status(200).json({
            message: "REGISTRATION_CREATED",
            registration: registrationResult.rows[0]
        });
    } catch (error) {
        console.error("Error registering for event:", error);

        return res.status(500).json({
            message: "REGISTRATION_FAILED"
        });
    }
}

/*
    Gets every event registration belonging to the authenticated user.
    The query joins event and venue information with each registration so
    Manage Events receives everything it needs in one API request.
*/

export async function getEventRegistration(req, res) {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({
                message: "UNAUTHORIZED"
            });
        }
        const registrationResult = await pool.query(
            `SELECT
                er.id,
                er.event_id,
                er.occurrence,
                e.name,
                e.description,
                e.image_url,
                e.segment,
                e.genre,
                e.timezone,
                v.name AS venue_name,
                v.city AS venue_city,
                v.state AS venue_state
            FROM event_registrations er
            INNER JOIN events e
                ON e.id = er.event_id
            LEFT JOIN venues v
                ON v.id = e.venue_id
            WHERE er.user_id = $1
            ORDER BY er.occurrence ASC`,
            [userId]
        );

        return res.status(200).json({
            registrations: registrationResult.rows
        });
    } catch (error) {
        console.error("Error getting event registrations:", error);

        return res.status(500).json({
            message: "REGISTRATIONS_FAILED"
        });
    }
}

export async function getEventRegistrationsById(req, res) {
    try {
        const eventId = req.params.event_id;

        if (!eventId) {
            return res.status(400).json({ message: "MISSING_EVENT" })
        }

        const eventRegistrationsResponse = await pool.query(
            `SELECT user_id FROM event_registrations
            WHERE event_id = $1`,
            [eventId]
        );

        const registeredUsers = [
            ...new Set(
                eventRegistrationsResponse.rows.map(row => row.user_id)
            )
        ];

        if (registeredUsers.length === 0) {
            return res.status(200).json({ message: "NO_USERS_REGISTERED" });
        }

        const publicRegisteredUsersResponse = await pool.query(
            `SELECT public_id from users
            WHERE id = ANY($1::int[])`,
            [registeredUsers]
        );

        return res.status(200).json({ message: "REGISTERED_USERS", data: publicRegisteredUsersResponse.rows});
    } catch (error) {
        console.error("Error getting event registration by id:", error);

        return res.status(500).json({
            message: "INTERNAL_SERVER_ERROR"
        });
    }
}

export async function unregisterForEvent(req, res) {
    try {
        const registrationId = req.params.registrationId;

        console.log(registrationId);

        if (!registrationId) {
            return res.status(400).json({
                message: "MISSING_REGISTRATION"
            });
        }

        const unregistrationResult = await pool.query(
            `DELETE FROM event_registrations WHERE id = $1`,
            [registrationId]
        );

        return res.status(204).json({ message: "UNREGISTERED"});
    } catch (err) {
        console.error("Error deleting registration:", err);
        return res.status(500).json({error: "INTERNAL_SERVER_ERROR"});
    }
}
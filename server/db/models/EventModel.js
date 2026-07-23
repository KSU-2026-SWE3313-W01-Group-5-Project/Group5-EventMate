import {createPool} from "../index.js";

const pool = createPool();

export class EventModel {
    static async insert(event) {
        try {
            const occurrences = event.occurrences?.filter(
                (occurrence) => occurrence != null
            );

            if (!occurrences || occurrences.length === 0) {
                return null;
            }

            const result = await pool.query(`
                INSERT INTO events (id, canonical_key, name, description, timezone, status, image_url, venue_id, segment, genre, subgenre, age_restriction, occurrences, last_seen_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW())
                ON CONFLICT (id)
                DO UPDATE SET
                    canonical_key = EXCLUDED.canonical_key,
                    name = EXCLUDED.name,
                    description = EXCLUDED.description,
                    timezone = EXCLUDED.timezone,
                    status = EXCLUDED.status,
                    image_url = EXCLUDED.image_url,
                    venue_id = EXCLUDED.venue_id,
                    segment = EXCLUDED.segment,
                    genre = EXCLUDED.genre,
                    subGenre = EXCLUDED.subGenre,
                    age_restriction = EXCLUDED.age_restriction,
                    occurrences = EXCLUDED.occurrences,
                    last_seen_at = NOW()
                RETURNING id
            `, [
                event.id,
                event.canonical_key,

                event.name,
                event.description,

                event.timezone,
                event.status?.code,

                event.image_url,

                event.venue_id,

                event.segment?.name,
                event.genre?.name,
                event.subgenre?.name,

                event.age_restriction,

                event.occurrences,
            ])

            return result.rows[0].id;
        } catch (err) {
            console.error("Error inserting event:", err.message);
        }
    }

    static async findByCanonicalKey(canonicalKey) {
        const existingEvent = await pool.query(
            `SELECT id FROM events WHERE canonical_key = $1`,
            [canonicalKey]
        )

        return (existingEvent.rows.length > 0 ? existingEvent.rows[0] : null)
    }

    static async insertOccurrence(existingEventId, occurrenceTime) {
        const result = await pool.query(
            `UPDATE events
            set occurrences = array_append(occurrences, $1)
            WHERE id = $2
                AND NOT ($1 = ANY(occurrences))`,
            [occurrenceTime, existingEventId.id]
        )

        return result.rows[0];
    }
}
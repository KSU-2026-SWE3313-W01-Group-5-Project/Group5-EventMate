import {createPool} from "../index.js";

const pool = createPool();

export class VenueModel {
    static async upsert(venue) {
        try {
            const result = await pool.query(`
                INSERT INTO venues (id, name, city, state, country, latitude, longitude)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                ON CONFLICT (id)
                DO UPDATE SET
                    name = EXCLUDED.name,
                    city = EXCLUDED.city,
                    state = EXCLUDED.state,
                    country = EXCLUDED.country,
                    latitude = EXCLUDED.latitude,
                    longitude = EXCLUDED.longitude
                RETURNING id
            `, [
                venue.id,
                venue.name,
                venue.city?.name,
                venue.state?.name,
                venue.country?.name,
                venue.location?.latitude,
                venue.location?.longitude
            ]);

            return result.rows[0].id;
        } catch (err) {
            console.error("Error upserting venues:", err.message);
        }
    }
}
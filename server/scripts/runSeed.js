import { createPool } from "../db/index.js";
import { hashPassword } from "../src/utils/hashPassword.js";

const pool = createPool();

async function runSeed() {
    try {
        await pool.query(`
            INSERT INTO events (title, description, event_date)
            VALUES ('Welcome Event', 'First event in database', NOW());
        `);

        const seededHashPassword = await hashPassword('password');

        await pool.query(`
            INSERT INTO users (firstname, lastname, username, email, password_hash, created_at)
            VALUES ('Dylan', 'Kooby', 'dylan', 'dylan@dylan.com', $1, NOW())`,
            [seededHashPassword]
        );

        console.log("Databases seeded!")
    } catch (err) {
        console.error("Error running seed:", err);
    } finally {
        await pool.end();
    }
}

runSeed();
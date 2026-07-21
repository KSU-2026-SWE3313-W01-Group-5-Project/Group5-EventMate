import { createPool } from "../db/index.js";
import { hashPassword } from "../src/utils/hashPassword.js";

const pool = createPool();

async function runSeed() {
    try {

        /**
         * Dev user seeding
         */

        const seededHashPassword = await hashPassword('password');

        const devUsers = [
            ['Dev', 'One', 'dev1', 'dev1@dev.com'],
            ['Dev', 'Two', 'dev2', 'dev2@dev.com'],
            ['Dev', 'Three', 'dev3', 'dev3@dev.com'],
            ['Dev', 'Four', 'dev4', 'dev4@dev.com'],
            ['Dev', 'Five', 'dev5', 'dev5@dev.com'],
            ['Dev', 'Six', 'dev6', 'dev6@dev.com'],
            ['Dev', 'Seven', 'dev7', 'dev7@dev.com'],
            ['Dev', 'Eight', 'dev8', 'dev8@dev.com'],
            ['Dev', 'Nine', 'dev9', 'dev9@dev.com'],
            ['Dev', 'Ten', 'dev10', 'dev10@dev.com'],
        ];

        for (const [firstname, lastname, username, email] of devUsers) {
            const result = await pool.query(`
                INSERT INTO users (
                    firstname,
                    lastname,
                    username,
                    email,
                    password_hash,
                    created_at
                )
                VALUES ($1, $2, $3, $4, $5, NOW())
                RETURNING id
                `, [
                firstname,
                lastname,
                username,
                email,
                seededHashPassword
            ]);

            await pool.query(`
                INSERT INTO user_preferences (user_id)
                VALUES ($1)
            `, [result.rows[0].id]);
        }

        console.log("Databases seeded!")
    } catch (err) {
        console.error("Error running seed:", err);
    } finally {
        await pool.end();
    }
}

runSeed();
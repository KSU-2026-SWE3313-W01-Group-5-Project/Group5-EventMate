import { createPool } from "../../db/index.js";
import {hashPassword} from "../utils/hashPassword.js";

const pool = createPool();

export async function getUserProfile(req, res) {
    try {
        const userPublicId = req.query.userUUID;

        const result = await pool.query(
            'SELECT public_id, username, profile_picture_url, bio, interests, city, state FROM users WHERE public_id = $1',
            [userPublicId],
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "USER_NOT_FOUND" });
        }

        res.status(200)
            .setHeader("Cache-Control", "no-store")
            .json(result.rows[0]);
    } catch (err) {
        console.error("Getting user failed:", err);
        res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }
}

export async function getUser(req, res) {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            'SELECT public_id, username, email, bio, profile_picture_url, interests, city, state FROM users WHERE id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "USER_NOT_FOUND" });
        }

        res.status(200)
            .setHeader("Cache-Control", "no-store")
            .json(result.rows[0]);
    } catch (err) {
        console.error("Getting user failed:", err);
        res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }
}

export async function updateUser(req, res) {
    try {
        const userId = req.user.id;
        const requestedUpdates = req.body;

        const allowedColumns = ['username', 'bio', 'interests', 'city', 'state', 'password', 'email'];
        const columnsToUpdate = [];
        const queryValues = [];

        console.log(requestedUpdates);

        Object.keys(requestedUpdates).forEach(key => {
            if (allowedColumns.includes(key)) {
                columnsToUpdate.push(key);
                queryValues.push(requestedUpdates[key]);
            }
        });

        if (columnsToUpdate.length === 0) {
            return res.status(400).json({ error: "NO_VALID_SETTINGS_TO_UPDATE" });
        }

        if (columnsToUpdate.includes("username")) {
            const index = columnsToUpdate.indexOf("username");

            const existingUser = await pool.query(
                'SELECT username FROM users WHERE username = $1',
                [queryValues[index]]
            );

            for (const user of existingUser.rows) {
                if (user.username === queryValues[index]) {
                    return res.status(409).json({
                        error: "USERNAME_TAKEN"
                    })
                }
            }
        }

        if (columnsToUpdate.includes("email")) {
            const index = columnsToUpdate.indexOf("email");

            const existingUser = await pool.query(
                'SELECT email FROM users WHERE email = $1',
                [queryValues[index]]
            );

            for (const user of existingUser.rows) {
                if (user.email === queryValues[index]) {
                    return res.status(409).json({
                        error: "EMAIL_TAKEN"
                    })
                }
            }
        }

        if (columnsToUpdate.includes("password")) {
            const index = columnsToUpdate.indexOf("password");

            columnsToUpdate[index] = "password_hash";

            queryValues[index] = await hashPassword(queryValues[index]);
        }

        if (columnsToUpdate.includes("interests")) {
            const index = columnsToUpdate.indexOf("interests");

            queryValues[index] = JSON.parse(queryValues[index]);
        }

        const setClause = columnsToUpdate
            .map((col, index) => `"${col}" = $${index + 1}`)
            .join(', ');

        queryValues.push(userId);
        const userIdPlaceholder = `$${queryValues.length}`;

        const sqlQuery = `
            UPDATE users 
            SET ${setClause}
            WHERE id = ${userIdPlaceholder}
            RETURNING username, bio, interests, city, state, email
            `;

        const result = await pool.query(sqlQuery, queryValues);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "USER_NOT_FOUND" });
        }

        return res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Update user failed:", err);
        return res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }
}

export async function deleteUser(req, res) {
    try {
        const userId = req.user.id;
        console.log(userId);

        const sqlQuery = `
            DELETE FROM users
            WHERE id = $1
            RETURNING id;
            `;

        const result = await pool.query(sqlQuery, [userId]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "USER_NOT_FOUND" });
        }

        return res.status(204).send();
    } catch (err) {
        console.error("Update deletion failed:", err);
        return res.status(500).json({error: "INTERNAL_SERVER_ERROR"});
    }
}
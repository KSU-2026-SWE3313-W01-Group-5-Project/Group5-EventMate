import { createPool } from "../../db/index.js";
import {hashPassword} from "../utils/hashPassword.js";
import deleteFile from "../utils/deleteFile.js";

const pool = createPool();

export async function getUserProfile(req, res) {
    try {
        const userPublicId = req.query.userUUID;

        const result = await pool.query(
            'SELECT public_id, username, firstname, lastname, profile_picture_url, bio, interests, city, state FROM users WHERE public_id = $1',
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
            'SELECT public_id, username, email, firstname, lastname, bio, profile_picture_url, interests, city, state FROM users WHERE id = $1',
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

        const allowedColumns = ['username', 'bio', 'interests', 'city', 'state', 'password', 'email', 'profile_picture_url'];

        Object.keys(requestedUpdates).forEach(key => {
            if (!allowedColumns.includes(key)) {
                delete requestedUpdates.key;
            }
        });

        if (requestedUpdates.length === 0) {
            return res.status(400).json({ error: "NO_VALID_SETTINGS_TO_UPDATE" });
        }

        if (requestedUpdates.username) {
            const existingUser = await pool.query(
                'SELECT username FROM users WHERE username = $1',
                [requestedUpdates.username]
            );

            for (const user of existingUser.rows) {
                if (user.username === requestedUpdates.username) {
                    await deleteFile(req.file.path);

                    return res.status(409).json({
                        error: "USERNAME_TAKEN"
                    })
                }
            }
        }

        if (requestedUpdates.email) {
            const existingUser = await pool.query(
                'SELECT email FROM users WHERE email = $1',
                [requestedUpdates.email]
            );

            for (const user of existingUser.rows) {
                if (user.email === requestedUpdates.email) {
                    return res.status(409).json({
                        error: "EMAIL_TAKEN"
                    })
                }
            }
        }

        if (requestedUpdates.password) {
            Object.keys(requestedUpdates).forEach(key => {
                if (key === "password") {
                    requestedUpdates.password_hash = requestedUpdates[key];
                    delete requestedUpdates.password;
                }
            })

            requestedUpdates.password_hash = await hashPassword(requestedUpdates.password_hash);
        }

        if (requestedUpdates.interests) {
            requestedUpdates.interests = JSON.parse(requestedUpdates.interests);
        }

        if (req.file) {
            const previousProfilePicture = await pool.query(
                'SELECT profile_picture_url FROM users WHERE id = $1',
                [userId]
            );

            const userProfilePictureUrl = `${previousProfilePicture.rows[0].profile_picture_url}`;

            if (!(userProfilePictureUrl === "default-profile.png")) {
                await deleteFile(`uploads/profile_images/${previousProfilePicture.rows[0].profile_picture_url}`);
            }

            Object.keys(requestedUpdates).forEach(key => {
                if (key === "profileImage") {
                    requestedUpdates.profile_picture_url = requestedUpdates[key];
                    delete requestedUpdates.profileImage;
                }
            })

            requestedUpdates.profile_picture_url = `${req.file.filename}`;
        }

        const columns = Object.keys(requestedUpdates);
        const queryValues = Object.values(requestedUpdates);

        const setClause = columns
            .map((col, index) => `"${col}" = $${index + 1}`)
            .join(', ');

        queryValues.push(userId);
        const userIdPlaceholder = `$${queryValues.length}`;

        const sqlQuery = `
            UPDATE users 
            SET ${setClause}
            WHERE id = ${userIdPlaceholder}
            RETURNING username, bio, interests, city, state, email, profile_picture_url
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

        const sqlQuery = `
            DELETE FROM users
            WHERE id = $1
            RETURNING id;
            `;

        const userProfilePicture = await pool.query(
            'SELECT profile_picture_url FROM users WHERE id = $1',
            [userId]
        );

        const userProfilePictureUrl = `${userProfilePicture.rows[0].profile_picture_url}`;

        if (!(userProfilePictureUrl === "default-profile.png")) {
            await deleteFile(`uploads/profile_images/${userProfilePicture.rows[0].profile_picture_url}`);
        }

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
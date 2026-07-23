import { createPool } from "../../db/index.js";
import {hashPassword} from "../utils/hashPassword.js";
import deleteFile from "../utils/deleteFile.js";
import fs from "fs";
import sharp from "sharp";

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
            `SELECT 
                u.public_id, u.username, u.email, u.firstname, u.lastname,
                u.bio, u.profile_picture_url, u.interests, u.city, u.state,
                
                jsonb_build_object(
                    'auto_filter_enabled', p.auto_filter_enabled,
                    'event_types', p.event_types,
                    'music_categories', p.music_categories,
                    'sports_categories', p.sports_categories,
                    'arts_categories', p.arts_categories,
                    'age_range', p.age_range,
                    'max_distance', p.max_distance,
                    'city_filter', p.city_filter,
                    'state_filter', p.state_filter
                ) AS preferences

                FROM users u
                LEFT JOIN user_preferences p ON u.id = p.user_id
                WHERE u.id = $1`,
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

export async function getUserRegistrations(req, res) {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT id, event_id, occurrence FROM event_registrations WHERE user_id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "USER_NOT_FOUND" });
        }

        res.status(200)
            .setHeader("Cache-Control", "no-store")
            .json(result.rows);
    } catch (err) {
        console.error("Getting user registrations failed:", err);
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
                delete requestedUpdates[key];
            }
        });

        if (Object.keys(requestedUpdates).length === 0) {
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

            if (requestedUpdates.city === "") {
                requestedUpdates.city = null;
            }

            if (requestedUpdates.state === "") {
                requestedUpdates.state = null;
            }

            const imagePath = req.file.path;
            const tempPath = `${imagePath}-temp`

            await sharp(imagePath)
                .resize(512, 512, {
                    fit: 'cover',
                    position: 'center'
                })
                .toFile(tempPath);

            fs.renameSync(tempPath, imagePath);

            requestedUpdates.profile_picture_url = `${req.file.filename}`;
        }

        console.log(requestedUpdates.city);

        const columns = Object.keys(requestedUpdates);
        const queryValues = Object.values(requestedUpdates);

        const setClause = columns
            .map((col, index) => `${col} = $${index + 1}`)
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

export async function updateUserPreferences(req, res) {
    try {
        const userId = req.user.id;

        const requestedUpdates = req.body;

        const allowedColumns = ['auto_filter_enabled', 'event_types', 'music_categories', 'sports_categories', 'arts_categories', 'age_range', 'max_distance', 'city_filter', 'state_filter'];

        Object.keys(requestedUpdates).forEach(key => {
            if (!allowedColumns.includes(key)) {
                delete requestedUpdates[key];
            }
        });

        if (Object.keys(requestedUpdates).length === 0) {
            return res.status(400).json({ error: "NO_VALID_PREFERENCES_TO_UPDATE" });
        }

        const columns = Object.keys(requestedUpdates);
        const queryValues = Object.values(requestedUpdates);

        const setClause = columns
            .map((col, index) => `${col} = $${index + 1}`)
            .join(', ');

        queryValues.push(userId);
        const userIdPlaceholder = `$${queryValues.length}`;

        const sqlQuery = `
            UPDATE user_preferences
            SET ${setClause}
            WHERE user_id = ${userIdPlaceholder}
            RETURNING auto_filter_enabled, event_types, music_categories, sports_categories, arts_categories, age_range, max_distance, city_filter, state_filter
            `;

        const result = await pool.query(sqlQuery, queryValues);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "PREFERNCES_NOT_FOUND" });
        }

        return res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error("Update user preferences failed:", err);
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
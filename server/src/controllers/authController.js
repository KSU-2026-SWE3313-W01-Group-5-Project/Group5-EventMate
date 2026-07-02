import { createPool } from "../../db/index.js";
import crypto from "crypto";
import {comparePasswords, hashPassword} from "../utils/hashPassword.js";
import {generateToken} from "../utils/jwt.js";

const pool = createPool();

export async function registerUser(req, res) {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const existingUser = await pool.query(
            'SELECT username, email FROM users WHERE username = $1 OR email = $2',
            [username, email]
        );

        for (const user of existingUser.rows) {
            if (user.username === username) {
                return res.status(409).json({
                    error: "USERNAME_TAKEN"
                })
            }

            if (user.email === email) {
                return res.status(409).json({
                    error: "EMAIL_TAKEN"
                })
            }
        }

        const hashedPassword = await hashPassword(password);
        const verificationToken = crypto.randomBytes(32).toString("hex");

        const result = await pool.query(
            'INSERT INTO users (username, email, password_hash, verification_token)' +
            'VALUES ($1, $2, $3, $4)' +
            'RETURNING public_id, username, email, verification_token',
            [username, email, hashedPassword, verificationToken]
        );

        const user = result.rows[0];

        return res.status(201).json({
            message: "Account created!",
            user
        })
    } catch (err) {
        console.error("Registration failed:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function loginUser(req, res) {
    const { username, password } = req.body;

    const selectedUser = await pool.query(
        'SELECT id, password_hash FROM users WHERE username = $1',
        [username]
    );

    if (selectedUser.rows.length === 0) {
        return res.status(401).json({ error: "INVALID_CREDENTIALS" });
    }

    const user = selectedUser.rows[0];
    const valid = await comparePasswords(password, user.password_hash);

    if (!valid) {
        return res.status(401).json({ error: "INVALID_CREDENTIALS" });
    }

    const token = generateToken(user);

    return res.status(200).json({
        message: "Login Successful",
        token: token
    });
}

export async function getUser(req, res) {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            'SELECT public_id, username, email, bio, interests, city, state FROM users WHERE id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "USER_NOT_FOUND" });
        }

        res.status(200).json(result.rows[0])
    } catch (err) {
        console.error("Getting user failed:", err);
        res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }
}

export async function updateUser(req, res) {
    try {
        const userId = req.user.id;
        const requestedUpdates = req.body;

        const allowedColumns = ['username', 'bio', 'interests', 'city', 'state'];
        const columnsToUpdate = [];
        const queryValues = [];

        Object.keys(requestedUpdates).forEach(key => {
            if (allowedColumns.includes(key)) {
                columnsToUpdate.push(key);
                queryValues.push(requestedUpdates[key]);
            }
        });

        if (columnsToUpdate.length === 0) {
            return res.status(400).json({ error: "NO_VALID_SETTINGS_TO_UPDATE" });
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
            RETURNING username, bio, interests, city, state
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
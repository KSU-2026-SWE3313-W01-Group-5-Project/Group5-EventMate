import { createPool } from "../../db/index.js";
import crypto from "crypto";
import {comparePasswords, hashPassword} from "../utils/hashPassword.js";
import {generateToken} from "../utils/jwt.js";

const pool = createPool();

export async function registerUser(req, res) {
    try {
        const { firstName, lastName, username, email, password } = req.body;

        if (!firstName || !lastName || !username || !email || !password) {
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
            'INSERT INTO users (firstname, lastname, username, email, password_hash, verification_token)' +
            'VALUES ($1, $2, $3, $4, $5, $6)' +
            'RETURNING id',
            [firstName, lastName, username, email, hashedPassword, verificationToken]
        );

        const userId = result.rows[0].id;

        await pool.query(
            'INSERT INTO user_preferences (user_id) VALUES ($1)',
            [userId]
        )

        return res.status(201).json({
            message: "Account created!",
        })
    } catch (err) {
        console.error("Registration failed:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function loginUser(req, res) {
    try {
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

        const jwtToken = generateToken(user);

        const isProduction = process.env.NODE_ENV === "production";

        return res.status(200)
            .cookie('token', jwtToken, {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? 'none' : 'lax',
                path: '/',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            })
            .json({ message: "Login successful" });
    } catch (err) {
        console.error("Authentication Error:", err);
        res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }

}

export async function logout(req, res) {
    try {
        const isProduction = process.env.NODE_ENV === "production";

        return res.status(200)
            .clearCookie('token', {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? 'none' : 'lax',
                path: '/',
            })
            .json({ message: "Logout successful" });
    } catch (err) {
        res.status(500).json({ error: "INTERNAL_SERVER_ERROR" });
    }
}
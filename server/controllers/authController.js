import { pool } from "../db/index.js";
import crypto from "crypto";
import {comparePasswords, hashPassword} from "../utils/hashPassword.js";

export async function registerUser(req, res) {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const existingUser = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await hashPassword(password);
        const verificationToken = crypto.randomBytes(32).toString("hex");

        const result = await pool.query(
            'INSERT INTO users (username, email, password_hash, verification_token)' +
            'VALUES ($1, $2, $3, $4)' +
            'RETURNING id, username, email, verification_token',
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
        return res.status(400).json({ message: "Bad Credentials" });
    }

    const user = selectedUser.rows[0];
    const valid = await comparePasswords(password, user.password_hash);

    if (!valid) {
        return res.status(400).json({ message: "Invalid Password" });
    }

    return res.status(200).json({
        message: "Login Successful",
    });
}
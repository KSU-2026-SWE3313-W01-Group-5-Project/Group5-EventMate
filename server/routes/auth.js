import express from 'express';

import {
    registerUser,
    loginUser,
} from "../controllers/authController.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
//router.get('/me', authMiddleware, getUser);
//router.get('/verify/:token', verifyEmail);

export default router;
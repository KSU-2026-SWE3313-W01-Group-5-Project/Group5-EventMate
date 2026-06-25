import express from 'express';

import {
    registerUser,
    loginUser,
    getUser
} from "../controllers/authController.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getUser);
//router.get('/verify/:token', verifyEmail);

export default router;
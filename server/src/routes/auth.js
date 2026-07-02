import express from 'express';

import {
    registerUser,
    loginUser,
    getUser,
    updateUser
} from "../controllers/authController.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getUser);
router.patch('/me/update', authMiddleware, updateUser);
//router.get('/verify/:token', verifyEmail);


export default router;
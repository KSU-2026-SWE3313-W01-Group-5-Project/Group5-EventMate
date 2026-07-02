import express from 'express';

import {
    registerUser,
    loginUser,
    getUser,
    updateUser,
    logout
} from "../controllers/authController.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getUser);
router.patch('/me/update', authMiddleware, updateUser);
router.post('/logout', logout);
//router.get('/verify/:token', verifyEmail);


export default router;
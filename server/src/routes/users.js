import express from 'express';

import {
    deleteUser,
    getUser,
    getUserProfile,
    updateUser
} from "../controllers/usersController.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/me', authMiddleware, getUser);
router.patch('/me/update', authMiddleware, updateUser);
router.delete('/me/update/delete', authMiddleware, deleteUser);

router.get('/:public_id', getUserProfile);

export default router;
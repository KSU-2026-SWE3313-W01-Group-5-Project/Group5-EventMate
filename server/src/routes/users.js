import express from 'express';

import {
    deleteUser,
    getUser,
    getUserProfile,
    updateUser,
    updateUserPreferences,
    getUserRegistrations
} from "../controllers/usersController.js";
import {authMiddleware} from "../middleware/authMiddleware.js";
import {uploadProfileImage} from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get('/me', authMiddleware, getUser);
router.get('/me/registrations', authMiddleware, getUserRegistrations);
router.patch('/me/update', authMiddleware, uploadProfileImage.single("profileImage"), updateUser);
router.patch('/me/update/updatePreferences', authMiddleware, updateUserPreferences);
router.delete('/me/update/delete', authMiddleware, deleteUser);

router.get('/:public_id', getUserProfile);

export default router;
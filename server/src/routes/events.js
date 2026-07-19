import express from 'express';

// API routes for /api/events.
//
// Routes:
// GET /api/events/ -> returns all events via getEvents controller (see eventController.js)
//
// Keeps routing logic separate from controllers, that way we can keep everything cleaner and disconnected to stop conflicts early

import {
    getEvents,
    registerForEvent,
} from '../controllers/eventController.js';
import {authMiddleware} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/', authMiddleware, getEvents);
router.post('/register', authMiddleware, registerForEvent);

export default router;
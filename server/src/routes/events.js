import express from 'express';

// API routes for /api/events.
//
// Routes:
// GET /api/events/ -> returns all events via getEvents controller (see eventController.js)
//
// Keeps routing logic separate from controllers, that way we can keep everything cleaner and disconnected to stop conflicts early

import {
    getEvents,
    getEventById,
    registerForEvent,
    unregisterForEvent,
    getEventRegistration,
    getEventRegistrationsById
} from '../controllers/eventController.js';
import {authMiddleware} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/', authMiddleware, getEvents);
router.get('/:event_id', authMiddleware, getEventById);
router.get('/registrations/me', authMiddleware, getEventRegistration)
router.get('/registrations/:event_id', authMiddleware, getEventRegistrationsById)
router.post('/register', authMiddleware, registerForEvent);
router.delete('/registrations/me/:registrationId', authMiddleware, unregisterForEvent);

export default router;
import express from 'express';
import { login } from '../controllers/authController.js';
import { getMenu, addMenuItem, updateMenuItem, deleteMenuItem } from '../controllers/menuController.js';
import { createReservation, getReservations, updateReservationStatus } from '../controllers/reservationController.js';
import { createQuery, getQueries, markQueryAsRead } from '../controllers/queryController.js';
import { getGallery, addGalleryItem, deleteGalleryItem } from '../controllers/galleryController.js';
import { getAnalytics } from '../controllers/analyticsController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Auth routes
router.post('/auth/login', login);

// Menu routes
router.get('/menu', getMenu);
router.post('/menu', authMiddleware, addMenuItem);
router.put('/menu/:id', authMiddleware, updateMenuItem);
router.delete('/menu/:id', authMiddleware, deleteMenuItem);

// Reservation routes
router.post('/reservations', createReservation);
router.get('/reservations', authMiddleware, getReservations);
router.put('/reservations/:id/status', authMiddleware, updateReservationStatus);

// Query routes
router.post('/queries', createQuery);
router.get('/queries', authMiddleware, getQueries);
router.put('/queries/:id/read', authMiddleware, markQueryAsRead);

// Gallery routes
router.get('/gallery', getGallery);
router.post('/gallery', authMiddleware, addGalleryItem);
router.delete('/gallery/:id', authMiddleware, deleteGalleryItem);

// Analytics routes
router.get('/analytics', authMiddleware, getAnalytics);

export default router;

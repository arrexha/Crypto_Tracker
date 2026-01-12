import express from 'express';
import { register, login } from '../controllers/authController.js';
import { addFavorite, deleteFavorite, getFavorites } from '../controllers/favoritesController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);

// Favorites routes
router.get('/favorites', authenticateToken, getFavorites);
router.post('/favorites', authenticateToken, addFavorite);
router.delete('/favorites/:id', authenticateToken, deleteFavorite);

export default router;

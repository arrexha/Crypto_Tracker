import express from 'express';
import { register, login } from '../controllers/authController.js';
import { addFavorite, removeFavorite, getFavorites } from '../controllers/favoritesController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Auth routes
router.post('/register', register);
router.post('/login', login);

// Favorites routes
router.get('/favorites', auth, getFavorites);
router.post('/favorites', auth, addFavorite);
router.delete('/favorites/:coinId', auth, removeFavorite);

export default router;

import express from 'express';
import { addFavorite, removeFavorite, getFavorites } from '../controllers/favoritesController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', auth, getFavorites);
router.post('/', auth, addFavorite);
router.delete('/:coinId', auth, removeFavorite);

export default router;

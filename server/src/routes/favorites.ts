import express from 'express';
import { getFavorites, addFavorite, deleteFavorite, deleteFavoriteByCryptoId } from '../controllers/favoritesController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/', getFavorites);
router.post('/', addFavorite);
router.delete('/:id', deleteFavorite);
router.delete('/crypto/:cryptoId', deleteFavoriteByCryptoId);

export default router;

import { Response } from 'express';
import { FavoriteModel } from '../models/Favorite.js';
import { AuthRequest } from '../middleware/auth.js';

export const getFavorites = (req: AuthRequest, res: Response): void => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const favorites = FavoriteModel.findByUserId(req.userId);
    res.json(favorites);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Server error fetching favorites' });
  }
};

export const addFavorite = (req: AuthRequest, res: Response): void => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { cryptoId } = req.body;

    if (!cryptoId) {
      res.status(400).json({ error: 'Crypto ID is required' });
      return;
    }

    // Check if already favorited
    const existing = FavoriteModel.findByUserAndCrypto(req.userId, cryptoId);
    if (existing) {
      res.status(400).json({ error: 'Already in favorites' });
      return;
    }

    const favorite = FavoriteModel.create({
      userId: req.userId,
      cryptoId
    });

    res.status(201).json(favorite);
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ error: 'Server error adding favorite' });
  }
};

export const deleteFavorite = (req: AuthRequest, res: Response): void => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { id } = req.params;

    const deleted = FavoriteModel.delete(id, req.userId);
    
    if (!deleted) {
      res.status(404).json({ error: 'Favorite not found' });
      return;
    }

    res.json({ message: 'Favorite removed successfully' });
  } catch (error) {
    console.error('Delete favorite error:', error);
    res.status(500).json({ error: 'Server error deleting favorite' });
  }
};

export const deleteFavoriteByCryptoId = (req: AuthRequest, res: Response): void => {
  try {
    if (!req.userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { cryptoId } = req.params;

    const deleted = FavoriteModel.deleteByUserAndCrypto(req.userId, cryptoId);
    
    if (!deleted) {
      res.status(404).json({ error: 'Favorite not found' });
      return;
    }

    res.json({ message: 'Favorite removed successfully' });
  } catch (error) {
    console.error('Delete favorite error:', error);
    res.status(500).json({ error: 'Server error deleting favorite' });
  }
};

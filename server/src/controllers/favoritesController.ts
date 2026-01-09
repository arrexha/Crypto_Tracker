import { Request, Response } from 'express';
import { db } from '../config/database.js';

export const getFavorites = (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    
    const stmt = db.prepare('SELECT * FROM favorites WHERE user_id = ?');
    const favorites = stmt.all(userId);

    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
};

export const addFavorite = (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { crypto_id } = req.body;

    if (!crypto_id) {
      return res.status(400).json({ error: 'Crypto ID is required' });
    }

    const favoriteId = `fav_${Date.now()}`;
    const stmt = db.prepare(
      'INSERT INTO favorites (id, user_id, crypto_id) VALUES (?, ?, ?)'
    );
    stmt.run(favoriteId, userId, crypto_id);

    res.status(201).json({ message: 'Favorite added successfully', favoriteId });
  } catch (error: any) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'This crypto is already in your favorites' });
    }
    res.status(500).json({ error: 'Failed to add favorite' });
  }
};

export const deleteFavorite = (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const stmt = db.prepare('DELETE FROM favorites WHERE id = ? AND user_id = ?');
    stmt.run(id, userId);

    res.json({ message: 'Favorite removed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
};

export const deleteFavoriteByCryptoId = (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { cryptoId } = req.params;

    const stmt = db.prepare('DELETE FROM favorites WHERE user_id = ? AND crypto_id = ?');
    stmt.run(userId, cryptoId);

    res.json({ message: 'Favorite removed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
};

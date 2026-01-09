import { Request, Response } from 'express';
import { FavoriteModel } from '../models/Favorite.js';
import { Types } from 'mongoose';

export const getFavorites = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    
    const favorites = await FavoriteModel.find({ userId }).sort({ createdAt: -1 });

    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
};

export const addFavorite = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { crypto_id } = req.body;

    if (!crypto_id) {
      return res.status(400).json({ error: 'Crypto ID is required' });
    }

    const favorite = new FavoriteModel({
      userId,
      cryptoId: crypto_id
    });

    await favorite.save();

    res.status(201).json({ message: 'Favorite added successfully', id: favorite._id });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'This crypto is already in your favorites' });
    }
    res.status(500).json({ error: 'Failed to add favorite' });
  }
};

export const deleteFavorite = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const result = await FavoriteModel.findOneAndDelete({
      _id: new Types.ObjectId(id),
      userId
    });

    if (!result) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    res.json({ message: 'Favorite removed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
};

export const deleteFavoriteByCryptoId = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { cryptoId } = req.params;

    const result = await FavoriteModel.findOneAndDelete({
      userId,
      cryptoId
    });

    if (!result) {
      return res.status(404).json({ error: 'Favorite not found' });
    }

    res.json({ message: 'Favorite removed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove favorite' });
  }
};

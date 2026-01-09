import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IFavorite extends Document {
  userId: Types.ObjectId;
  cryptoId: string;
  createdAt: Date;
}

const favoriteSchema = new Schema<IFavorite>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    cryptoId: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Unique constraint on userId and cryptoId combination
favoriteSchema.index({ userId: 1, cryptoId: 1 }, { unique: true });

export const FavoriteModel = mongoose.model<IFavorite>('Favorite', favoriteSchema);

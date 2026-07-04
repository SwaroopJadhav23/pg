import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: String,
  images: [String],
  address: String,
  city: String,
  location: { lat: Number, lng: Number },
  capacity: { type: Number, default: 0 },
  floors: { type: Number, default: 0 },
  rooms: { type: Number, default: 0 },
  amenities: [String],
  pricing: { minRent: Number, maxRent: Number },
  adminLoginId: { type: String, trim: true },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['active', 'disabled', 'maintenance'], default: 'active' }
}, { timestamps: true });

export const Property = mongoose.model('Property', propertySchema);

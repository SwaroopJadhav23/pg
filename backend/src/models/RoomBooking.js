import mongoose from 'mongoose';

const roomBookingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    moveInDate: { type: Date },
    message: { type: String, trim: true },
    status: { type: String, enum: ['new', 'contacted', 'confirmed', 'closed'], default: 'new' }
  },
  { timestamps: true }
);

export const RoomBooking = mongoose.model('RoomBooking', roomBookingSchema);

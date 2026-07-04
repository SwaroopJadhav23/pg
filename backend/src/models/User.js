import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { ROLES } from '../constants/roles.js';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  mobile: { type: String, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  role: { type: String, enum: Object.values(ROLES), required: true },
  property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  status: { type: String, enum: ['active', 'inactive', 'blocked'], default: 'active' },
  profile: {
    photoUrl: String,
    address: String,
    joiningDate: Date,
    roomNumber: String,
    bedNumber: String,
    floorNumber: String,
    roomType: String,
    sharingDetails: String,
    guardianName: String,
    guardianMobile: String,
    emergencyContact: String,
    aadhaar: String,
    pan: String,
    notificationPreference: { type: String, enum: ['email', 'sms', 'whatsapp', 'all'], default: 'all' }
  }
}, { timestamps: true });

userSchema.index({ role: 1, property: 1, status: 1 });
userSchema.index({ name: 'text', email: 'text', mobile: 'text' });

userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model('User', userSchema);

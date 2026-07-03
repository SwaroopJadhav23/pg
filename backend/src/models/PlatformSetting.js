import mongoose from 'mongoose';

const platformSettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  platform: {
    name: { type: String, default: 'Om Sai PG OS' },
    supportEmail: String,
    supportPhone: String,
    timezone: { type: String, default: 'Asia/Kolkata' }
  },
  subscription: {
    plan: { type: String, default: 'enterprise' },
    billingCycle: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
    maxProperties: { type: Number, default: 25 }
  },
  notifications: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: true },
    whatsapp: { type: Boolean, default: false }
  },
  security: {
    enforceMfa: { type: Boolean, default: false },
    sessionTimeoutMinutes: { type: Number, default: 60 },
    allowedIpRanges: [String]
  }
}, { timestamps: true });

export const PlatformSetting = mongoose.model('PlatformSetting', platformSettingSchema);

import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { env } from '../config/env.js';
import { ROLES } from '../constants/roles.js';
import { PlatformSetting } from '../models/PlatformSetting.js';
import { User } from '../models/User.js';

const SUPER_ADMIN_LOGIN = 'superadmin';
const SUPER_ADMIN_PASSWORD = '123456';

/** Ensures only the super admin account and default platform settings exist. No demo properties or tenants. */
export async function seedDemoUsers() {
  await User.deleteOne({ email: 'owner@pg.test' });

  let superAdminUser = await User.findOne({ role: ROLES.SUPER_ADMIN });
  if (superAdminUser) {
    superAdminUser.set({
      name: 'Super Admin',
      email: SUPER_ADMIN_LOGIN,
      mobile: '9000000003',
      password: SUPER_ADMIN_PASSWORD,
      status: 'active'
    });
    await superAdminUser.save();
  } else {
    superAdminUser = await User.create({
      name: 'Super Admin',
      email: SUPER_ADMIN_LOGIN,
      mobile: '9000000003',
      role: ROLES.SUPER_ADMIN,
      password: SUPER_ADMIN_PASSWORD
    });
  }

  await PlatformSetting.findOneAndUpdate(
    { key: 'global' },
    {
      key: 'global',
      platform: { name: 'Om Sai PG OS', supportEmail: '', supportPhone: '', timezone: 'Asia/Kolkata' },
      subscription: { plan: 'starter', billingCycle: 'monthly', maxProperties: 25 },
      notifications: { email: true, sms: true, whatsapp: true },
      security: { enforceMfa: false, sessionTimeoutMinutes: 60, allowedIpRanges: [] }
    },
    { upsert: true }
  );

  return {
    credentials: [{ role: ROLES.SUPER_ADMIN, email: SUPER_ADMIN_LOGIN, password: SUPER_ADMIN_PASSWORD }],
    message: 'Super admin ready. No demo properties were created.'
  };
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  await mongoose.connect(env.mongoUri);
  console.log(await seedDemoUsers());
  await mongoose.disconnect();
}

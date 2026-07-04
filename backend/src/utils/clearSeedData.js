import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { env } from '../config/env.js';
import { ROLES } from '../constants/roles.js';
import { Property } from '../models/Property.js';
import { User } from '../models/User.js';
import { Complaint, Document, Expense, Notice, Rent, Room, Staff, SupportTicket, Visitor } from '../models/Operations.js';

const SEED_PROPERTY_NAMES = ['Om Sai Residency', 'Om Sai Elite', 'Om Sai Comfort'];
const SEED_USER_EMAILS = ['student@pg.test', 'admin@pg.test', 'mumbai.admin@pg.test', 'owner@pg.test'];

async function purgeProperty(propertyId) {
  await Promise.all([
    Room.deleteMany({ property: propertyId }),
    Rent.deleteMany({ property: propertyId }),
    Complaint.deleteMany({ property: propertyId }),
    Notice.deleteMany({ property: propertyId }),
    Expense.deleteMany({ property: propertyId }),
    Staff.deleteMany({ property: propertyId }),
    Visitor.deleteMany({ property: propertyId }),
    SupportTicket.deleteMany({ property: propertyId }),
    Document.deleteMany({ property: propertyId }),
    User.deleteMany({ property: propertyId, role: { $in: [ROLES.ADMIN, ROLES.STUDENT] } })
  ]);
  await Property.findByIdAndDelete(propertyId);
}

export async function clearSeedData() {
  const properties = await Property.find({ name: { $in: SEED_PROPERTY_NAMES } });
  for (const property of properties) {
    await purgeProperty(property._id);
  }

  await User.deleteMany({ email: { $in: SEED_USER_EMAILS } });

  return {
    removedProperties: properties.map((property) => property.name),
    removedUserEmails: SEED_USER_EMAILS
  };
}

if (fileURLToPath(import.meta.url) === process.argv[1]) {
  await mongoose.connect(env.mongoUri);
  console.log(await clearSeedData());
  await mongoose.disconnect();
}

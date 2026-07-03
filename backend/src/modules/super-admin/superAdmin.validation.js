import { z } from 'zod';

const optionalText = z.string().trim().optional().or(z.literal(''));
const idParam = z.object({ params: z.object({ id: z.string().min(1) }) });

export const createPropertySchema = z.object({
  body: z.object({
    name: z.string().trim().min(2),
    imageUrl: optionalText,
    address: optionalText,
    city: optionalText,
    location: z.object({ lat: z.coerce.number().optional(), lng: z.coerce.number().optional() }).optional(),
    capacity: z.coerce.number().nonnegative().default(0),
    floors: z.coerce.number().nonnegative().default(0),
    rooms: z.coerce.number().nonnegative().default(0),
    amenities: z.array(z.string()).default([]),
    pricing: z.object({ minRent: z.coerce.number().optional(), maxRent: z.coerce.number().optional() }).optional()
  })
});

export const updatePropertySchema = idParam.extend({
  body: createPropertySchema.shape.body.partial().extend({
    status: z.enum(['active', 'disabled', 'maintenance']).optional()
  })
});

export const createManagerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2),
    email: z.string().trim().email(),
    mobile: optionalText,
    password: z.string().min(8).default('Password@123'),
    property: optionalText
  })
});

export const assignManagerSchema = idParam.extend({
  body: z.object({ propertyId: z.string().min(1) })
});

export const createGlobalNoticeSchema = z.object({
  body: z.object({
    title: z.string().trim().min(2),
    body: z.string().trim().min(5),
    audience: z.enum(['all_tenants', 'property', 'managers']).default('all_tenants'),
    propertyIds: z.array(z.string()).default([]),
    scheduledAt: optionalText
  })
});

export const settingsSchema = z.object({
  body: z.object({
    platform: z.object({
      name: optionalText,
      supportEmail: optionalText,
      supportPhone: optionalText,
      timezone: optionalText
    }).optional(),
    subscription: z.object({
      plan: optionalText,
      billingCycle: z.enum(['monthly', 'yearly']).optional(),
      maxProperties: z.coerce.number().nonnegative().optional()
    }).optional(),
    notifications: z.object({
      email: z.boolean().optional(),
      sms: z.boolean().optional(),
      whatsapp: z.boolean().optional()
    }).optional(),
    security: z.object({
      enforceMfa: z.boolean().optional(),
      sessionTimeoutMinutes: z.coerce.number().positive().optional(),
      allowedIpRanges: z.array(z.string()).optional()
    }).optional()
  })
});

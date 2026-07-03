import { z } from 'zod';

const optionalText = z.string().trim().optional().or(z.literal(''));

export const createComplaintSchema = z.object({
  body: z.object({
    category: z.enum(['electricity', 'plumbing', 'cleaning', 'internet', 'food', 'security', 'maintenance', 'other']),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
    description: z.string().trim().min(10, 'Complaint description must be at least 10 characters'),
    photoUrl: optionalText
  })
});

export const createVisitorSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Visitor name is required'),
    mobile: z.string().trim().min(10, 'Visitor mobile number is required'),
    relation: z.string().trim().min(2, 'Visitor relation is required'),
    visitDate: z.string().trim().min(1, 'Visit date is required'),
    expectedTime: z.string().trim().min(1, 'Expected time is required'),
    purpose: optionalText
  })
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).optional(),
    mobile: optionalText,
    address: optionalText,
    photoUrl: optionalText,
    guardianName: optionalText,
    guardianMobile: optionalText,
    emergencyContact: optionalText,
    notificationPreference: z.enum(['email', 'sms', 'whatsapp', 'all']).optional()
  })
});

export const createSupportTicketSchema = z.object({
  body: z.object({
    subject: z.string().trim().min(3, 'Support subject is required'),
    category: z.enum(['billing', 'room', 'complaint', 'document', 'visitor', 'general']).default('general'),
    message: z.string().trim().min(10, 'Support message must be at least 10 characters'),
    channel: z.enum(['portal', 'chat', 'whatsapp']).default('portal')
  })
});

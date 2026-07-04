import { z } from 'zod';

export const bookRoomSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Name is required'),
    phone: z.string().trim().min(10, 'Valid phone number is required'),
    email: z.string().trim().email().optional().or(z.literal('')),
    moveInDate: z.string().optional(),
    message: z.string().trim().optional()
  })
});

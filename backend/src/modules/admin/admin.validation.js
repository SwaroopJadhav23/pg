import { z } from 'zod';
import { TENANT_DEFAULT_PASSWORD } from '../../constants/credentials.js';

const optionalText = z.string().trim().optional().or(z.literal(''));
const idParam = z.object({ params: z.object({ id: z.string().min(1) }) });

export const createTenantSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2),
    email: z.string().trim().email(),
    mobile: optionalText,
    password: z.string().min(6).default(TENANT_DEFAULT_PASSWORD),
    roomId: optionalText,
    profile: z.object({
      address: optionalText,
      guardianName: optionalText,
      guardianMobile: optionalText,
      emergencyContact: optionalText,
      aadhaar: optionalText,
      pan: optionalText,
      photoUrl: optionalText,
      floorNumber: optionalText,
      roomNumber: optionalText,
      bedNumber: optionalText,
      joiningDate: optionalText
    }).optional()
  })
});

export const updateTenantSchema = idParam.extend({
  body: createTenantSchema.shape.body.partial()
});

export const createRoomSchema = z.object({
  body: z.object({
    floor: z.string().trim().min(1),
    roomNumber: z.string().trim().min(1),
    bedNumber: z.string().trim().min(1),
    roomType: optionalText,
    sharingDetails: optionalText,
    rent: z.coerce.number().nonnegative().default(0),
    amenities: z.array(z.string()).default([]),
    status: z.enum(['occupied', 'vacant', 'reserved', 'maintenance']).default('vacant')
  })
});

export const updateRoomSchema = idParam.extend({
  body: createRoomSchema.shape.body.partial().extend({ tenant: optionalText })
});

export const assignRoomSchema = idParam.extend({
  body: z.object({ tenantId: z.string().min(1) })
});

export const generateRentSchema = z.object({
  body: z.object({
    tenantId: z.string().min(1),
    month: z.string().trim().min(1),
    amount: z.coerce.number().positive(),
    dueDate: z.string().trim().min(1),
    lateFees: z.coerce.number().nonnegative().default(0)
  })
});

export const markRentPaidSchema = idParam.extend({
  body: z.object({
    method: z.enum(['cash', 'upi', 'bank_transfer']),
    paidAt: optionalText,
    transactionRef: optionalText
  })
});

export const createExpenseSchema = z.object({
  body: z.object({
    category: z.enum(['electricity', 'water', 'internet', 'maintenance', 'staff_salary', 'food', 'miscellaneous']),
    title: z.string().trim().min(2),
    amount: z.coerce.number().positive(),
    expenseDate: optionalText,
    billUrl: optionalText,
    notes: optionalText
  })
});

export const updateComplaintSchema = idParam.extend({
  body: z.object({
    assignedTo: optionalText,
    status: z.enum(['open', 'assigned', 'in_progress', 'resolved']).optional(),
    note: optionalText
  })
});

export const visitorActionSchema = idParam;

export const createStaffSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2),
    mobile: optionalText,
    role: z.enum(['caretaker', 'security', 'cleaner', 'cook', 'electrician', 'plumber', 'staff']).default('staff'),
    salary: z.coerce.number().nonnegative().default(0)
  })
});

export const staffAttendanceSchema = idParam.extend({
  body: z.object({
    date: optionalText,
    status: z.enum(['present', 'absent', 'half_day']).default('present')
  })
});

export const staffTaskSchema = idParam.extend({
  body: z.object({
    title: z.string().trim().min(2),
    dueDate: optionalText
  })
});

export const createNoticeSchema = z.object({
  body: z.object({
    title: z.string().trim().min(2),
    body: z.string().trim().min(5),
    audience: z.enum(['all_tenants', 'property', 'floor', 'room', 'managers']).default('all_tenants'),
    floor: optionalText,
    roomNumber: optionalText,
    scheduledAt: optionalText
  })
});

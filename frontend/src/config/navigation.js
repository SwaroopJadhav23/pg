import { BarChart3, BedDouble, Bell, Building2, CircleDollarSign, ClipboardList, FileText, Gauge, LifeBuoy, Megaphone, ReceiptIndianRupee, Settings, ShieldCheck, UserCog, Users, UserRoundCheck, WalletCards } from 'lucide-react';

export const studentNavigation = [
  { label: 'Dashboard', path: '/student', icon: Gauge },
  { label: 'My Room', path: '/student/my-room', icon: BedDouble },
  { label: 'Rent & Payments', path: '/student/rent-payments', icon: ReceiptIndianRupee },
  { label: 'Complaints', path: '/student/complaints', icon: ClipboardList },
  { label: 'Notices', path: '/student/notices', icon: Bell },
  { label: 'Documents', path: '/student/documents', icon: FileText },
  { label: 'Visitors', path: '/student/visitors', icon: UserRoundCheck },
  { label: 'Profile', path: '/student/profile', icon: Users },
  { label: 'Support', path: '/student/support', icon: LifeBuoy }
];

export const adminNavigation = [
  { label: 'Dashboard', path: '/admin', icon: Gauge },
  { label: 'Tenants', path: '/admin/tenants', icon: Users },
  { label: 'Rooms', path: '/admin/rooms', icon: BedDouble },
  { label: 'Rent Management', path: '/admin/rent-management', icon: ReceiptIndianRupee },
  { label: 'Expenses', path: '/admin/expenses', icon: WalletCards },
  { label: 'Complaints', path: '/admin/complaints', icon: ClipboardList },
  { label: 'Visitors', path: '/admin/visitors', icon: UserRoundCheck },
  { label: 'Staff', path: '/admin/staff', icon: UserCog },
  { label: 'Notices', path: '/admin/notices', icon: Megaphone },
  { label: 'Reports', path: '/admin/reports', icon: BarChart3 }
];

export const superAdminNavigation = [
  { label: 'Global Dashboard', path: '/super-admin', icon: Gauge },
  { label: 'Properties', path: '/super-admin/properties', icon: Building2 },
  { label: 'Revenue Center', path: '/super-admin/revenue-center', icon: CircleDollarSign },
  { label: 'Tenants', path: '/super-admin/tenants', icon: Users },
  { label: 'Complaints', path: '/super-admin/complaints', icon: ClipboardList },
  { label: 'Notices', path: '/super-admin/notices', icon: Megaphone },
  { label: 'Managers', path: '/super-admin/managers', icon: ShieldCheck },
  { label: 'Analytics', path: '/super-admin/analytics', icon: BarChart3 },
  { label: 'Audit Logs', path: '/super-admin/audit-logs', icon: FileText },
  { label: 'Settings', path: '/super-admin/settings', icon: Settings }
];

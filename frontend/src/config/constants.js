export const ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
};

export const ROLE_HOME = {
  [ROLES.STUDENT]: '/student',
  [ROLES.ADMIN]: '/admin',
  [ROLES.SUPER_ADMIN]: '/super-admin'
};

export const demoUsers = [
  { role: 'Student', email: 'student@pg.test', password: 'Password@123' },
  { role: 'Admin', email: 'admin@pg.test', password: 'Password@123' },
  { role: 'Super Admin', email: 'owner@pg.test', password: 'Password@123' }
];

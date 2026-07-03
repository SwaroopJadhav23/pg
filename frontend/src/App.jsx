import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthLayout } from './layouts/AuthLayout';
import { StudentLayout } from './layouts/StudentLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { SuperAdminLayout } from './layouts/SuperAdminLayout';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { RoleRedirect } from './auth/RoleRedirect';
import { ROLES } from './config/constants';
import { Skeleton } from './components/shared/Skeleton';

const lazyPage = (loader, exportName) => lazy(() => loader().then((module) => ({ default: module[exportName] })));

const LoginPage = lazyPage(() => import('./pages/auth/LoginPage'), 'LoginPage');
const UnauthorizedPage = lazyPage(() => import('./pages/auth/UnauthorizedPage'), 'UnauthorizedPage');

const StudentDashboard = lazyPage(() => import('./pages/student/StudentDashboard'), 'StudentDashboard');
const MyRoomPage = lazyPage(() => import('./pages/student/MyRoomPage'), 'MyRoomPage');
const RentPaymentsPage = lazyPage(() => import('./pages/student/RentPaymentsPage'), 'RentPaymentsPage');
const ComplaintsPage = lazyPage(() => import('./pages/student/ComplaintsPage'), 'ComplaintsPage');
const NoticesPage = lazyPage(() => import('./pages/student/NoticesPage'), 'NoticesPage');
const DocumentsPage = lazyPage(() => import('./pages/student/DocumentsPage'), 'DocumentsPage');
const VisitorsPage = lazyPage(() => import('./pages/student/VisitorsPage'), 'VisitorsPage');
const ProfilePage = lazyPage(() => import('./pages/student/ProfilePage'), 'ProfilePage');
const SupportPage = lazyPage(() => import('./pages/student/SupportPage'), 'SupportPage');

const AdminDashboard = lazyPage(() => import('./pages/admin/AdminDashboard'), 'AdminDashboard');
const TenantManagementPage = lazyPage(() => import('./pages/admin/TenantManagementPage'), 'TenantManagementPage');
const RoomManagementPage = lazyPage(() => import('./pages/admin/RoomManagementPage'), 'RoomManagementPage');
const RentManagementPage = lazyPage(() => import('./pages/admin/RentManagementPage'), 'RentManagementPage');
const ExpenseManagementPage = lazyPage(() => import('./pages/admin/ExpenseManagementPage'), 'ExpenseManagementPage');
const ComplaintManagementPage = lazyPage(() => import('./pages/admin/ComplaintManagementPage'), 'ComplaintManagementPage');
const VisitorManagementPage = lazyPage(() => import('./pages/admin/VisitorManagementPage'), 'VisitorManagementPage');
const StaffManagementPage = lazyPage(() => import('./pages/admin/StaffManagementPage'), 'StaffManagementPage');
const NoticeManagementPage = lazyPage(() => import('./pages/admin/NoticeManagementPage'), 'NoticeManagementPage');
const ReportsPage = lazyPage(() => import('./pages/admin/ReportsPage'), 'ReportsPage');

const SuperAdminDashboard = lazyPage(() => import('./pages/super-admin/SuperAdminDashboard'), 'SuperAdminDashboard');
const PropertiesManagementPage = lazyPage(() => import('./pages/super-admin/PropertiesManagementPage'), 'PropertiesManagementPage');
const RevenueCenterPage = lazyPage(() => import('./pages/super-admin/RevenueCenterPage'), 'RevenueCenterPage');
const TenantMonitoringPage = lazyPage(() => import('./pages/super-admin/TenantMonitoringPage'), 'TenantMonitoringPage');
const ManagerAdministrationPage = lazyPage(() => import('./pages/super-admin/ManagerAdministrationPage'), 'ManagerAdministrationPage');
const NoticeCenterPage = lazyPage(() => import('./pages/super-admin/NoticeCenterPage'), 'NoticeCenterPage');
const ComplaintMonitoringPage = lazyPage(() => import('./pages/super-admin/ComplaintMonitoringPage'), 'ComplaintMonitoringPage');
const AnalyticsPage = lazyPage(() => import('./pages/super-admin/AnalyticsPage'), 'AnalyticsPage');
const AuditLogsPage = lazyPage(() => import('./pages/super-admin/AuditLogsPage'), 'AuditLogsPage');
const SettingsPage = lazyPage(() => import('./pages/super-admin/SettingsPage'), 'SettingsPage');

function RouteFallback() {
  return (
    <div className="space-y-4 p-4 md:p-8">
      <Skeleton className="h-32" />
      <div className="grid gap-4 md:grid-cols-3">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/" element={<RoleRedirect />} />

        <Route element={<ProtectedRoute roles={[ROLES.STUDENT]} />}>
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<StudentDashboard />} />
            <Route path="my-room" element={<MyRoomPage />} />
            <Route path="rent-payments" element={<RentPaymentsPage />} />
            <Route path="complaints" element={<ComplaintsPage />} />
            <Route path="notices" element={<NoticesPage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="visitors" element={<VisitorsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="support" element={<SupportPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={[ROLES.ADMIN]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="tenants" element={<TenantManagementPage />} />
            <Route path="rooms" element={<RoomManagementPage />} />
            <Route path="rent-management" element={<RentManagementPage />} />
            <Route path="expenses" element={<ExpenseManagementPage />} />
            <Route path="complaints" element={<ComplaintManagementPage />} />
            <Route path="visitors" element={<VisitorManagementPage />} />
            <Route path="staff" element={<StaffManagementPage />} />
            <Route path="notices" element={<NoticeManagementPage />} />
            <Route path="reports" element={<ReportsPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute roles={[ROLES.SUPER_ADMIN]} />}>
          <Route path="/super-admin" element={<SuperAdminLayout />}>
            <Route index element={<SuperAdminDashboard />} />
            <Route path="properties" element={<PropertiesManagementPage />} />
            <Route path="revenue-center" element={<RevenueCenterPage />} />
            <Route path="tenants" element={<TenantMonitoringPage />} />
            <Route path="complaints" element={<ComplaintMonitoringPage />} />
            <Route path="notices" element={<NoticeCenterPage />} />
            <Route path="managers" element={<ManagerAdministrationPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="audit-logs" element={<AuditLogsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

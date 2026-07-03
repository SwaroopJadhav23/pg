import { PortalShell } from '../components/layout/PortalShell';
import { adminNavigation } from '../config/navigation';

export function AdminLayout() {
  return <PortalShell roleLabel="Admin Portal" navigation={adminNavigation} />;
}

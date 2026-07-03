import { PortalShell } from '../components/layout/PortalShell';
import { superAdminNavigation } from '../config/navigation';

export function SuperAdminLayout() {
  return <PortalShell roleLabel="Super Admin Portal" navigation={superAdminNavigation} />;
}

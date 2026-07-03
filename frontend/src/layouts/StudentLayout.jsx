import { PortalShell } from '../components/layout/PortalShell';
import { studentNavigation } from '../config/navigation';

export function StudentLayout() {
  return <PortalShell roleLabel="Student Portal" navigation={studentNavigation} />;
}

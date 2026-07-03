import { BedDouble, Building2, Home, Sparkles } from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
import { StatCard } from '../../components/shared/StatCard';
import { Badge } from '../../components/ui/badge';
import { useStudentResource } from '../../hooks/useStudentResource';
import { formatCurrency } from '../../lib/utils';
import { studentService } from '../../services/studentService';
import { studentFallback } from './studentPortalData';
import { InfoTile, ModuleCard } from './studentUi';

export function MyRoomPage() {
  const { data } = useStudentResource(studentService.myRoom, { room: studentFallback.room, profile: studentFallback.student.profile });
  const room = data.room || studentFallback.room;
  const property = room.property || studentFallback.property;

  return (
    <>
      <PageHeader eyebrow="Room Information" title="My Room" description="View your property, floor, room, bed, sharing details and amenities." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Property" value={property.name} icon={Building2} />
        <StatCard label="Floor" value={room.floor || data.profile?.floorNumber} icon={Home} />
        <StatCard label="Room / Bed" value={`${room.roomNumber} / ${room.bedNumber}`} icon={BedDouble} />
        <StatCard label="Monthly Rent" value={formatCurrency(room.rent || 0)} icon={Sparkles} />
      </div>
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <ModuleCard title="Room Details" description="Current assigned accommodation">
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoTile label="Property Name" value={property.name} />
            <InfoTile label="Address" value={property.address} />
            <InfoTile label="Room Type" value={room.roomType} />
            <InfoTile label="Sharing Details" value={room.sharingDetails} />
            <InfoTile label="Status" value={room.status} />
            <InfoTile label="City" value={property.city} />
          </div>
        </ModuleCard>
        <ModuleCard title="Amenities Available" description="Facilities included with your room">
          <div className="flex flex-wrap gap-3">
            {(room.amenities || property.amenities || []).map((amenity) => <Badge key={amenity} variant="default">{amenity}</Badge>)}
          </div>
          <div className="mt-6 rounded-3xl bg-primary/10 p-5 text-sm text-primary">
            For room transfer or amenity issues, raise a complaint or contact support from the Student Portal.
          </div>
        </ModuleCard>
      </div>
    </>
  );
}

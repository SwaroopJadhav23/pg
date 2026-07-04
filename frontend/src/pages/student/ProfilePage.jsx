import { useEffect, useState } from 'react';
import { User } from 'lucide-react';
import { PageHeader } from '../../components/shared/PageHeader';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { useStudentResource } from '../../hooks/useStudentResource';
import { resolveImageUrl, IMAGE_FALLBACK } from '../landing/utils/resolveImageUrl';
import { studentService } from '../../services/studentService';
import { InfoTile, formatDate } from './studentUi';

export function ProfilePage() {
  const { data, setData } = useStudentResource(studentService.profile, { student: null });
  const student = data.student || {};
  const profile = student.profile || {};
  const [form, setForm] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    setForm({
      name: student.name || '',
      mobile: student.mobile || '',
      address: profile.address || '',
      guardianName: profile.guardianName || '',
      guardianMobile: profile.guardianMobile || '',
      emergencyContact: profile.emergencyContact || '',
      notificationPreference: profile.notificationPreference || 'all'
    });
  }, [student.name, student.mobile, profile.address, profile.guardianName, profile.guardianMobile, profile.emergencyContact, profile.notificationPreference]);

  async function submitProfile(event) {
    event.preventDefault();
    setMessage('');
    try {
      const payload = await studentService.updateProfile(form);
      setData({ student: payload.student });
      setMessage('Profile updated successfully.');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not update profile.');
    }
  }

  return (
    <>
      <PageHeader eyebrow="Profile" title="My Profile" description="Manage personal information, guardian details, emergency contact and notification preferences." />
      <div className="grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
        <Card>
          <CardContent className="p-6 text-center">
            <img src={profile.photoUrl ? resolveImageUrl(profile.photoUrl) : IMAGE_FALLBACK} alt={student.name} className="mx-auto h-28 w-28 rounded-3xl border bg-slate-100 object-cover" />
            <h2 className="mt-4 text-2xl font-extrabold">{student.name}</h2>
            <p className="text-sm text-muted-foreground">{student.email}</p>
            <div className="mt-6 grid gap-3 text-left">
              <InfoTile label="Room" value={`${profile.roomNumber || '-'} / ${profile.bedNumber || '-'}`} />
              <InfoTile label="Joining Date" value={formatDate(profile.joiningDate)} />
              <InfoTile label="Room Type" value={profile.roomType} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5" /> Editable Profile Settings</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={submitProfile} className="grid gap-4 md:grid-cols-2">
              <Input placeholder="Name" value={form.name || ''} onChange={(event) => setForm({ ...form, name: event.target.value })} />
              <Input placeholder="Mobile" value={form.mobile || ''} onChange={(event) => setForm({ ...form, mobile: event.target.value })} />
              <Input className="md:col-span-2" placeholder="Address" value={form.address || ''} onChange={(event) => setForm({ ...form, address: event.target.value })} />
              <Input placeholder="Guardian Name" value={form.guardianName || ''} onChange={(event) => setForm({ ...form, guardianName: event.target.value })} />
              <Input placeholder="Guardian Mobile" value={form.guardianMobile || ''} onChange={(event) => setForm({ ...form, guardianMobile: event.target.value })} />
              <Input placeholder="Emergency Contact" value={form.emergencyContact || ''} onChange={(event) => setForm({ ...form, emergencyContact: event.target.value })} />
              <select className="h-11 rounded-xl border bg-background px-4 text-sm" value={form.notificationPreference || 'all'} onChange={(event) => setForm({ ...form, notificationPreference: event.target.value })}>
                {['all', 'email', 'sms', 'whatsapp'].map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
              {message ? <p className="rounded-xl bg-primary/10 p-3 text-sm text-primary md:col-span-2">{message}</p> : null}
              <Button type="submit" className="md:col-span-2">Save Profile</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

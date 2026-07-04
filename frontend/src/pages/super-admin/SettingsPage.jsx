import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { emitToast } from '../../components/ui/toast';
import { useResource } from '../../hooks/useResource';
import { emptySettings } from '../../config/emptyStates';
import { superAdminService } from '../../services/superAdminService';
import { SuperHeader } from './superAdminUi';

export function SettingsPage() {
  const { data, setData } = useResource(superAdminService.settings, { setting: emptySettings });
  const setting = data.setting || emptySettings;
  const [form, setForm] = useState(emptySettings);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setForm({
      platform: setting.platform || emptySettings.platform,
      subscription: setting.subscription || emptySettings.subscription,
      notifications: setting.notifications || emptySettings.notifications,
      security: setting.security || emptySettings.security
    });
  }, [setting.platform, setting.subscription, setting.notifications, setting.security]);

  async function submit(event) {
    event.preventDefault();
    try {
      const payload = await superAdminService.updateSettings(form);
      setData({ setting: payload.setting });
      setMessage('Settings updated.');
      emitToast({ title: 'Settings saved', description: 'Platform settings updated.' });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not save settings.');
      emitToast({ title: 'Save failed', description: error.response?.data?.message || 'Could not save settings.', variant: 'destructive' });
    }
  }

  return (
    <>
      <SuperHeader title="Settings" description="Manage platform, subscription, notification and security settings for the PG operating system." />
      <Card>
        <CardHeader><CardTitle>Platform Settings</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
            <Input placeholder="Platform Name" value={form.platform?.name || ''} onChange={(e) => setForm({ ...form, platform: { ...form.platform, name: e.target.value } })} />
            <Input placeholder="Support Email" value={form.platform?.supportEmail || ''} onChange={(e) => setForm({ ...form, platform: { ...form.platform, supportEmail: e.target.value } })} />
            <Input placeholder="Support Phone" value={form.platform?.supportPhone || ''} onChange={(e) => setForm({ ...form, platform: { ...form.platform, supportPhone: e.target.value } })} />
            <Input placeholder="Timezone" value={form.platform?.timezone || ''} onChange={(e) => setForm({ ...form, platform: { ...form.platform, timezone: e.target.value } })} />
            <Input placeholder="Plan" value={form.subscription?.plan || ''} onChange={(e) => setForm({ ...form, subscription: { ...form.subscription, plan: e.target.value } })} />
            <Input type="number" placeholder="Max Properties" value={form.subscription?.maxProperties || 0} onChange={(e) => setForm({ ...form, subscription: { ...form.subscription, maxProperties: Number(e.target.value) } })} />
            <Input type="number" placeholder="Session Timeout Minutes" value={form.security?.sessionTimeoutMinutes || 60} onChange={(e) => setForm({ ...form, security: { ...form.security, sessionTimeoutMinutes: Number(e.target.value) } })} />
            <select className="h-11 rounded-xl border bg-background px-4 text-sm" value={form.subscription?.billingCycle || 'monthly'} onChange={(e) => setForm({ ...form, subscription: { ...form.subscription, billingCycle: e.target.value } })}>
              <option value="monthly">monthly</option>
              <option value="yearly">yearly</option>
            </select>
            {message ? <p className="rounded-xl bg-primary/10 p-3 text-sm text-primary md:col-span-2">{message}</p> : null}
            <Button type="submit" className="md:col-span-2">Save Settings</Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

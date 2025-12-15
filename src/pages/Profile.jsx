import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getUserProfile, updateUserProfile } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import BackButton from '@/components/common/BackButton';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  phone: z.string().optional(),
  dob: z
    .string()
    .refine((v) => {
      if (!v) return false;
      // YYYY-MM-DD simple check
      const m = /^\d{4}-\d{2}-\d{2}$/.test(v);
      if (!m) return false;
      const d = new Date(v);
      return !Number.isNaN(d.getTime());
    }, 'Please enter a valid date (YYYY-MM-DD)'),
});

const Profile = () => {
  const navigate = useNavigate();
  const { logout } = useAuth?.() || { logout: () => {} };
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);

  const form = useForm({ resolver: zodResolver(schema) });
  const { handleSubmit, reset } = form;

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');
    getUserProfile()
      .then((data) => {
        if (!mounted) return;
        setProfile(data);
        reset({ email: data.email || '', phone: data.phone || '', dob: data.dob || '' });
      })
      .catch((err) => {
        if (!mounted) return;
        if (err?.status === 403 || err?.status === 401) {
          try { logout?.(); } catch (_) {}
          navigate('/login');
          return;
        }
        setError(err?.message || 'Failed to load profile');
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [navigate, logout, reset]);

  const onSubmit = async (values) => {
    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const updated = await updateUserProfile(values);
      setProfile(updated);
      reset({ email: updated.email || '', phone: updated.phone || '', dob: updated.dob || '' });
      setSuccess('Profile updated successfully');
      setEditMode(false);
    } catch (err) {
      if (err?.status === 403 || err?.status === 401) {
        // eslint-disable-next-line no-unused-vars
        try { logout?.(); } catch (_) {}
        navigate('/login');
        return;
      }
      setError(err?.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    
    <div className="p-6 md:p-8 mx-auto">
      <div className="flex flex-start mb-4">
        <BackButton />
      </div>
      <h1 className="text-2xl font-semibold mb-6 text-left">My Profile</h1>
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Avatar>
            <AvatarFallback>{(profile?.username || 'U').slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-base font-medium">{profile?.username || '—'}</div>
            <div className="text-sm text-muted-foreground">Role: {profile?.role || '—'}</div>
          </div>
        </div>
        <div className="my-4 border-t" />

        {error && (
          <div className="text-sm text-red-600 mb-3" role="alert">{error}</div>
        )}
        {success && (
          <div className="text-sm text-green-600 mb-3" role="status">{success}</div>
        )}
        {!editMode && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <div className="mt-1 text-sm">{profile?.email || '—'}</div>
              </div>
              <div>
                <label className="text-sm font-medium">Phone</label>
                <div className="mt-1 text-sm">{profile?.phone || '—'}</div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Date of Birth</label>
                <div className="mt-1 text-sm">{profile?.dob || '—'}</div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button className="text-black dark:hover:text-white" variant="secondary" onClick={() => setEditMode(true)} disabled={loading}>
                Changes
              </Button>
            </div>
          </div>
        )}

        {editMode && (
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Email</FormLabel>
                      <FormControl>
                        <Input id="email" type="email" placeholder="you@example.com" disabled={loading || submitting} className="mt-1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Phone</FormLabel>
                      <FormControl>
                        <Input id="phone" type="text" placeholder="Optional" disabled={loading || submitting} className="mt-1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Date of Birth</FormLabel>
                      <FormControl>
                        <Input id="dob" type="date" placeholder="YYYY-MM-DD" disabled={loading || submitting} className="mt-1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => { reset({ email: profile?.email || '', phone: profile?.phone || '', dob: profile?.dob || '' }); setEditMode(false); }} disabled={submitting}>
                  Cancel
                </Button>
                <Button type="submit"  disabled={loading || submitting}>
                  {submitting ? 'Saving…' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default Profile;

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: zodResolver(schema) });

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
        if (err?.status === 403) {
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
    } catch (err) {
      if (err?.status === 403) {
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
    <div className="p-6 md:p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">My Profile</h1>
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium" htmlFor="username">Username</label>
              <Input id="username" value={profile?.username || ''} disabled className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="role">Role</label>
              <Input id="role" value={profile?.role || ''} disabled className="mt-1" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium" htmlFor="email">Email</label>
              <Input id="email" type="email" placeholder="you@example.com"
                disabled={loading || submitting} className="mt-1" {...register('email')} />
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium" htmlFor="phone">Phone</label>
              <Input id="phone" type="text" placeholder="Optional"
                disabled={loading || submitting} className="mt-1" {...register('phone')} />
              {errors.phone && (
                <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium" htmlFor="dob">Date of Birth</label>
              <Input id="dob" type="date" placeholder="YYYY-MM-DD"
                disabled={loading || submitting} className="mt-1" {...register('dob')} />
              {errors.dob && (
                <p className="text-xs text-red-600 mt-1">{errors.dob.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="submit" disabled={loading || submitting}>
              {submitting ? 'Saving…' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Profile;

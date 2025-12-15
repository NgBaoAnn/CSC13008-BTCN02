import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { registerUser } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import BackButton from '@/components/common/BackButton';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';

const schema = z.object({
  username: z.string().min(3, 'Username is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 chars'),
  phone: z.string().min(8, 'Phone is required'),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/g, 'Date must be YYYY-MM-DD'),
});

const Register = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    setServerError('');
    setSuccessMsg('');
    try {
      const res = await registerUser(values);
      setSuccessMsg(res?.message || 'Registered successfully');
      toast.success('Registered successfully');
      // small delay to show success
      setTimeout(() => navigate('/login'), 800);
    } catch (e) {
      setServerError(e?.message || 'Register failed');
    }
  };

  return (
    <div className="p-6 min-h-[60vh] flex flex-col">
      <div className="w-full mx-auto mb-4 flex flex-start">
        <BackButton />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-left">Username</label>
              <Input placeholder="yourusername" {...register('username')} />
              {errors.username && <p className="text-red-600 text-xs mt-1">{errors.username.message}</p>}
            </div>
            <div>
              <label className="block text-sm mb-1 text-left">Email</label>
              <Input type="email" placeholder="user@example.com" {...register('email')} />
              {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm mb-1 text-left">Password</label>
              <Input type="password" placeholder="••••••••" {...register('password')} />
              {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-sm mb-1 text-left">Phone</label>
              <Input placeholder="0123456789" {...register('phone')} />
              {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone.message}</p>}
            </div>
            <div>
              <label className="block text-sm mb-1 text-left">Date of birth</label>
              <Input type="date" {...register('dob')} />
              {errors.dob && <p className="text-red-600 text-xs mt-1">{errors.dob.message}</p>}
            </div>
            {serverError && <p className="text-red-600 text-sm">{serverError}</p>}
            {successMsg && <p className="text-green-600 text-sm">{successMsg}</p>}
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner />
                  Registering...
                </span>
              ) : (
                'Register'
              )}
            </Button>
          </form>
        </CardContent>
          <CardFooter>
            <p className="text-xs opacity-70">Already have an account? <a href="/login" className="underline">Login</a></p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;

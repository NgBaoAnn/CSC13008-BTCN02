import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import BackButton from '@/components/common/BackButton';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';

const schema = z.object({
  username: z.string().min(3, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 chars'),
});

const Login = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const onSubmit = async (values) => {
    setServerError('');
    try {
      await login(values.username, values.password);
      toast.success('Logged in successfully');
      navigate('/');
    } catch (e) {
      setServerError(e?.message || 'Login failed');
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
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-left">Username</label>
              <Input placeholder="yourusername" {...register('username')} />
              {errors.username && (
                <p className="text-red-600 text-xs mt-1">{errors.username.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm mb-1 text-left">Password</label>
              <Input type="password" placeholder="••••••••" {...register('password')} />
              {errors.password && (
                <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>
            {serverError && <p className="text-red-600 text-sm">{serverError}</p>}
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <Spinner />
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </Button>
          </form>
        </CardContent>
          <CardFooter>
            <p className="text-xs opacity-70">Don't have an account? <a href="/register" className="underline">Register</a></p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;

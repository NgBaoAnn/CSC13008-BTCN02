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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const schema = z.object({
  username: z.string().min(3, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 chars'),
});

const Login = () => {
  const form = useForm({ resolver: zodResolver(schema) });
  const { handleSubmit, formState: { isSubmitting } } = form;
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
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-left">Username</FormLabel>
                    <FormControl>
                      <Input placeholder="yourusername" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-left">Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
          </Form>
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

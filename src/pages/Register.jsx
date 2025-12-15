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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const schema = z.object({
  username: z.string().min(3, 'Username is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 chars'),
  phone: z.string().min(8, 'Phone is required'),
  dob: z.string().regex(/^\d{4}-\d{2}-\d{2}$/g, 'Date must be YYYY-MM-DD'),
});

const Register = () => {
  const form = useForm({ resolver: zodResolver(schema) });
  const { handleSubmit, formState: { isSubmitting } } = form;
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-left">Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="user@example.com" {...field} />
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

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-left">Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="0123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dob"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm text-left">Date of birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
          </Form>
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

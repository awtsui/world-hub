'use client';
import { HostSignUpFormSchema } from '@/lib/zod/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useAlertDialog } from '@/context/ModalContext';

type Inputs = z.infer<typeof HostSignUpFormSchema>;

export default function SignUpForm() {
  const router = useRouter();
  const { setError, setSuccess } = useAlertDialog();

  const form = useForm<Inputs>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: zodResolver(HostSignUpFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  const { register, handleSubmit, watch, reset, trigger, formState } = form;

  async function processForm(data: Inputs) {
    // const { name, email, password, confirmPassword } = data;

    // TODO: look into validator to prevent XSS (Cross site scripting) attack
    try {
      const signUpResp = await fetch('/api/hosts/signup', {
        body: JSON.stringify(data),
      });

      if (!signUpResp.ok) {
        throw Error('Failed to sign up');
      }
      // const signUpData = await signUpResp.json();

      const revalidateHostResp = await fetch('/api/revalidate?tag=host');

      if (!revalidateHostResp.ok) {
        throw Error('Failed to revalidate host');
      }
      // const revalidateHostData = await revalidateHostResp.json();

      setSuccess('Successfully signed up!', 3);
      router.push('/auth/signin');
    } catch (error) {
      console.error(error);
      setError('Failed to sign up', 3);
    } finally {
      reset();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(processForm)} className="w-full space-y-6">
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem id="name">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem id="email">
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="name@address.com"
                    {...field}
                  />
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Re-enter your password"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button className="w-full mt-6" type="submit">
          Sign up
        </Button>
      </form>
      <p className="text-center text-md text-gray-600 mt-5">
        Already have an account?
        <Link
          className="text-blue-500 hover:underline ml-1"
          href="/auth/signin"
        >
          Sign In
        </Link>
      </p>
    </Form>
  );
}

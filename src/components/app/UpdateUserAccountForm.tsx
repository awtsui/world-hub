'use client';
import { useAlertDialog } from '@/context/ModalContext';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { usePathname, useRouter } from 'next/navigation';
import { useToast } from '../ui/use-toast';
import { UpdateUserAccountFormSchema } from '@/lib/zod/schema';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';

type Inputs = z.infer<typeof UpdateUserAccountFormSchema>;

interface UpdateUserAccountFormProps {
  user: User;
}

export default function UpdateUserAccountForm({
  user,
}: UpdateUserAccountFormProps) {
  const { setError, setSuccess } = useAlertDialog();
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const { update } = useSession();

  const form = useForm<Inputs>({
    resolver: zodResolver(UpdateUserAccountFormSchema),
    defaultValues: {
      email: user.email ?? '',
    },
  });

  const { register, handleSubmit, watch, reset, trigger, formState } = form;

  async function processForm(data: Inputs) {
    try {
      const updateAccountResp = await fetch('/api/users', {
        body: JSON.stringify({
          ...data,
          userId: user.id,
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });

      if (!updateAccountResp.ok) {
        throw Error('Failed to update profile');
      }

      await update({ user: { ...data } });

      // TODO: refresh and push is not force reloading page
      router.push(pathname);
      router.refresh();
      toast({
        title: 'Successfully updated profile',
        description: 'Your new profile will be displayed shortly!',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Failed to update profile',
        description: 'Please try again.',
      });
      reset();
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(processForm)}
        onReset={() => reset()}
        className="w-full p-2"
      >
        <div className="flex items-center py-4 gap-2">
          <div className="space-y-2 flex-1">
            <p className="text-lg font-bold">Profile</p>
            <p className="text-sm">View and update your account details</p>
          </div>
          <Button
            variant="secondary"
            disabled={!formState.isDirty}
            type="reset"
          >
            Reset
          </Button>
          <Button type="submit" disabled={!formState.isDirty}>
            Save changes
          </Button>
        </div>
        <hr />
        <div className="space-y-4 py-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem id="email">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}

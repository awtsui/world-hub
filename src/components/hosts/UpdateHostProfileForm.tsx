'use client';
import { useAlertDialog } from '@/context/ModalContext';
import { HostProfile } from '@/lib/types';
import { UpdateHostProfileFormSchema } from '@/lib/zod/schema';
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

type Inputs = z.infer<typeof UpdateHostProfileFormSchema>;

interface UpdateHostProfileFormProps {
  hostProfile: HostProfile;
}

export default function UpdateHostProfileForm({
  hostProfile,
}: UpdateHostProfileFormProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<Inputs>({
    resolver: zodResolver(UpdateHostProfileFormSchema),
    defaultValues: {
      name: hostProfile.name,
      biography: hostProfile.biography,
    },
  });

  const { register, handleSubmit, watch, reset, trigger, formState } = form;

  async function processForm(data: Inputs) {
    try {
      const updateProfileResp = await fetch('/api/hosts/profile', {
        body: JSON.stringify({
          profile: {
            name: data.name,
            biography: data.biography,
          },
          hostId: hostProfile.hostId,
        }),
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });

      if (!updateProfileResp.ok) {
        throw Error('Failed to update profile');
      }

      const revalidateHostResp = await fetch('/api/revalidate?tag=host');

      if (!revalidateHostResp.ok) {
        throw Error('Failed to revalidate host');
      }

      // TODO: refresh and push is not force reloading page
      router.push(pathname);
      router.refresh();
      toast({
        title: 'Successfully updated profile',
        description: 'Your new profile will be displayed shortly!',
      });
      // setSuccess('Successfully updated profile', 3);
      reset();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Failed to update profile',
        description: 'Please try again.',
      });
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
            name="biography"
            render={({ field }) => (
              <FormItem id="biography">
                <FormLabel>Biography</FormLabel>
                <FormControl>
                  <Input placeholder="Biography" {...field} />
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

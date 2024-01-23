'use client';

import { ContactFormSchema } from '@/lib/zod/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '../ui/textarea';
import { useToast } from '../ui/use-toast';
import { sendContactFormMail } from '@/lib/actions';
import { useState } from 'react';

type Inputs = z.infer<typeof ContactFormSchema>;

export default function ContactForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<Inputs>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    resolver: zodResolver(ContactFormSchema),
    defaultValues: {
      name: '',
      subject: '',
      company: '',
      email: '',
      message: '',
    },
  });
  const { register, handleSubmit, watch, reset, trigger, formState } = form;

  async function processForm(data: Inputs) {
    try {
      setIsLoading(true);
      await sendContactFormMail(data);
      toast({
        title: 'Contact form successfully sent',
      });
      reset();
    } catch {
      toast({
        title: 'Contact form failed to send',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <div>
        <form onSubmit={handleSubmit(processForm)} className="space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem id="name">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input type="name" placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="Choose subject" type="subject" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-2">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem id="company">
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input type="company" placeholder="Your company" {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email Address" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Start typing here" className="resize-none" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button className="mt-6" type="submit" disabled={!formState.isDirty || isLoading}>
            Submit
          </Button>
        </form>
      </div>
    </Form>
  );
}

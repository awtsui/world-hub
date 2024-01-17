'use client';

import { ChangeEvent, useState } from 'react';
import { z } from 'zod';
import { EventFormDataSchema } from '@/lib/zod/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { categories, categoryIdToName, subCategoryIdToName } from '@/lib/data';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import MultipleSelector, { Option } from '../ui/multi-select';
import { HostProfile, Venue } from '@/lib/types';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAlertDialog } from '@/context/ModalContext';
import Image from 'next/image';
import { DateTimePicker } from '../ui/date-time-picker';

type Inputs = z.infer<typeof EventFormDataSchema>;

const steps = [
  {
    id: 'Step 1',
    name: 'Event Details',
    fields: [
      'title',
      'subTitle',
      'category',
      'subcategory',
      'datetime',
      'description',
      'lineup',
    ],
  },
  { id: 'Step 2', name: 'Image Upload', fields: ['thumbnailImage'] },
  { id: 'Step 3', name: 'Venue Information', fields: ['venueName'] },
  {
    id: 'Step 4',
    name: 'Ticket Details',
    fields: ['purchaseLimit', 'ticketTiers'],
  },
  {
    id: 'Step 5',
    name: 'Complete',
  },
];

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function EventForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState<
    string | undefined
  >();
  const { setError, setSuccess } = useAlertDialog();
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [creationSuccess, setCreationSuccess] = useState(false);

  const form = useForm<Inputs>({
    resolver: zodResolver(EventFormDataSchema),
    defaultValues: {
      title: '',
      subTitle: '',
      description: '',
      category: '',
      subcategory: '',
      lineup: [],
      thumbnailImage: null,
      datetime: undefined,
      venueId: '',
      purchaseLimit: 0,
      ticketTiers: [],
      ticketQuantity: 0,
    },
  });
  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    formState: { errors },
  } = form;

  const { fields, append } = useFieldArray({
    name: 'ticketTiers',
    control: form.control,
  });

  const { data: hosts, error: fetchHostsError } = useSWR(
    '/api/hosts/profile',
    fetcher
  );
  const { data: venues, error: fetchVenuesError } = useSWR(
    '/api/venues',
    fetcher
  );

  // TODO: integrate error checking and loading state into form component
  if (fetchHostsError || fetchVenuesError) return <div>failed to load</div>;

  // TODO: build a loading state page
  if (!hosts || !venues || !session) return <div>loading...</div>;

  const lineupOptions: Option[] = hosts.map((host: HostProfile) => ({
    label: host.name,
    value: host.name,
    key: host.hostId,
  }));

  async function handleUploadImage(
    event: ChangeEvent<HTMLInputElement>,
    onThumbnailImageChange: (...event: any[]) => void
  ) {
    const file = event.target.files?.[0];
    onThumbnailImageChange(file);

    if (thumbnailPreview) {
      URL.revokeObjectURL(thumbnailPreview);
    }
    if (file) {
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
    }
  }

  async function processForm(data: Inputs) {
    try {
      setLoading(true);
      const file = data.thumbnailImage;

      const presignedUrlResp = await fetch(
        `/api/upload?type=${file.type}&size=${file.size}&id=${session?.user?.id}`
      );

      if (!presignedUrlResp.ok) {
        throw Error('Failed to retrieve presigned url');
      }

      const { presignedUrl, mediaId } = await presignedUrlResp.json();

      const imageUploadResp = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: { 'Content-Type': file.type },
      });
      if (!imageUploadResp.ok) {
        throw Error('Thumbnail image upload failed');
      }

      const createEventResp = await fetch('/api/events/create', {
        body: JSON.stringify({
          event: {
            title: data.title,
            subTitle: data.subTitle,
            description: data.description,
            category: data.category,
            subcategory: data.subcategory,
            datetime: data.datetime,
            venueId: data.venueId,
            lineup: data.lineup.map((host) => host.key),
            purchaseLimit: data.purchaseLimit,
            ticketTiers: data.ticketTiers,
            ticketQuantity: data.ticketQuantity,
          },
          hostId: session?.user?.id,
          mediaId,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      });

      if (!createEventResp.ok) {
        throw Error('Failed to create event');
      }
      const createEventData = await createEventResp.json();

      const revalidateEventResp = await fetch(`/api/revalidate?tag=event`);
      if (!revalidateEventResp.ok) {
        throw Error('Failed to revalidate event');
      }

      setSuccess(
        `Successfully created event! Your event id is ${createEventData.eventId}`,
        3
      );
      setCreationSuccess(true);
    } catch (error) {
      console.error(error);
      setError('Failed to create event. Try again.', 3);
    } finally {
      reset();
      setLoading(false);
    }
  }

  type FieldName = keyof Inputs;

  async function next() {
    const fields = steps[currentStep].fields;
    const output = await trigger(fields as FieldName[], { shouldFocus: true });
    if (!output) return;
    if (currentStep <= steps.length - 1) {
      if (currentStep === steps.length - 2) {
        await handleSubmit(processForm)();
      }
      setCurrentStep((prev) => prev + 1);
    }
  }

  function prev() {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  }

  return (
    <section className="flex flex-col justify-between px-12 py-8 w-full">
      <nav aria-label="Progress">
        <ol role="list" className="space-y-4 md:flex md:space-x-8 md:space-y-0">
          {steps.map((step, index) => (
            <li key={step.name} className="md:flex-1">
              {currentStep > index ? (
                <div className="group flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-md font-medium text-sky-600 transition-colors ">
                    {step.id}
                  </span>
                  <span className="text-md font-medium">{step.name}</span>
                </div>
              ) : currentStep === index ? (
                <div
                  className="flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                  aria-current="step"
                >
                  <span className="text-md font-medium text-sky-600">
                    {step.id}
                  </span>
                  <span className="text-md font-medium">{step.name}</span>
                </div>
              ) : (
                <div className="group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4">
                  <span className="text-md font-medium text-gray-500 transition-colors">
                    {step.id}
                  </span>
                  <span className="text-md font-medium">{step.name}</span>
                </div>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <Form {...form}>
        <form onSubmit={handleSubmit(processForm)} className="mt-12">
          {currentStep === 0 && (
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Event Details
              </h2>
              <p className="mt-1 text-md leading-6 text-gray-600">
                Provide the details for your event.
              </p>
              <div className="flex">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem id="title">
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Title..." {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your event title.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subTitle"
                  render={({ field }) => (
                    <FormItem id="subtitle">
                      <FormLabel>Sub Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Subtitle..." {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your event subtitle.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem id="description">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us a little bit about the event"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        You can <span>@mention</span> other hosts and venues.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="datetime"
                  render={({ field }) => (
                    <FormItem className="flex flex-col" id="datetime">
                      <FormLabel className="py-1">Date & Time</FormLabel>
                      <FormControl>
                        <DateTimePicker
                          date={field.value}
                          setDate={field.onChange}
                          disabled={(date) => date < new Date()}
                        />
                      </FormControl>
                      <FormDescription>Event date & time.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem id="category">
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          setSelectedCategoryId(value);
                          field.onChange(categoryIdToName[value]);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(categories).map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        This is your event category.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subcategory"
                  render={({ field }) => (
                    <FormItem id="subcategory">
                      <FormLabel>Subcategory</FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(subCategoryIdToName[value])
                        }
                        defaultValue={field.value}
                        disabled={!selectedCategoryId}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subcategory" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {selectedCategoryId &&
                            categories[selectedCategoryId].subCategories.map(
                              (category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id}
                                >
                                  {category.name}
                                </SelectItem>
                              )
                            )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        This is your event subcategory.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="lineup"
                render={({ field }) => (
                  <FormItem id="lineup">
                    <FormLabel>Select Lineup</FormLabel>
                    <FormControl>
                      <MultipleSelector
                        value={field.value}
                        onChange={field.onChange}
                        options={lineupOptions}
                        placeholder="Select performers..."
                        disabled={!lineupOptions}
                        emptyIndicator={
                          <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
                            no results found.
                          </p>
                        }
                      />
                    </FormControl>
                    <FormDescription>This is your event lineup</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          {currentStep === 1 && (
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Event Image Upload
              </h2>
              <p className="mt-1 text-md leading-6 text-gray-600">
                Provide a thumbnail image for your event.
              </p>

              <FormField
                control={form.control}
                name="thumbnailImage"
                render={({
                  field: { onChange: onThumbnailImageChange },
                  ...field
                }) => (
                  <FormItem id="thumbnailImage">
                    <FormLabel>Thumbnail Image</FormLabel>

                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        {...field}
                        onChange={(event) =>
                          handleUploadImage(event, onThumbnailImageChange)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Choose the best image that brings spirit to your event.
                    </FormDescription>
                    <FormMessage />
                    {thumbnailPreview && (
                      <Image
                        alt="thumbnailImage"
                        width="50"
                        height="50"
                        src={thumbnailPreview}
                      />
                    )}
                  </FormItem>
                )}
              />
            </div>
          )}
          {currentStep === 2 && (
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Venue Information
              </h2>
              <p className="mt-1 text-md leading-6 text-gray-600">
                Provide information for your venue.
              </p>
              <FormField
                control={form.control}
                name="venueId"
                render={({ field }) => (
                  <FormItem id="venueId">
                    <FormLabel>Venue</FormLabel>
                    <Select
                      onValueChange={(event) => {
                        field.onChange(event);
                      }}
                      defaultValue={field.value}
                      disabled={!venues}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a venue" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {venues.map((venue: Venue) => (
                          <SelectItem key={venue.venueId} value={venue.venueId}>
                            {venue.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Select your venue.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          {currentStep === 3 && (
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Ticket Details
              </h2>
              <p className="mt-1 text-md leading-6 text-gray-600">
                Provide information for your tickets.
              </p>
              <div className="flex">
                <FormField
                  control={form.control}
                  name="ticketQuantity"
                  render={({ field }) => (
                    <FormItem id="ticketQuantity">
                      <FormLabel>Ticket Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter your ticket quantity"
                          {...field}
                          onChange={(event) =>
                            field.onChange(
                              event.target.value ? +event.target.value : 0
                            )
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Enter your ticket quantity.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="purchaseLimit"
                  render={({ field }) => (
                    <FormItem id="purchaseLimit">
                      <FormLabel>Ticket Purchase Limit</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter your ticket limit"
                          {...field}
                          onChange={(event) =>
                            field.onChange(
                              event.target.value ? +event.target.value : 0
                            )
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Enter your ticket purchase limit.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                {fields.map((field, index) => (
                  <div key={`${field.id}-${index}`} className="flex">
                    <FormField
                      control={form.control}
                      key={`ticketTiers.${index}.label-${field.id}`}
                      name={`ticketTiers.${index}.label`}
                      render={({ field }) => (
                        <FormItem id={`ticketTiers.${index}.label`}>
                          <FormLabel>Ticket Tier Label</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your label" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter your ticket tier label.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      key={`ticketTiers.${index}.price-${field.id}`}
                      name={`ticketTiers.${index}.price`}
                      render={({ field }) => (
                        <FormItem id={`ticketTiers.${index}.price`}>
                          <FormLabel>Ticket Tier Price</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="Enter your tier price"
                              {...field}
                              onChange={(event) =>
                                field.onChange(
                                  event.target.value ? +event.target.value : 0
                                )
                              }
                            />
                          </FormControl>
                          <FormDescription>
                            Enter your ticket tier price.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={() => append({ label: '', price: 0 })}
                >
                  Add Ticket Tier
                </Button>
              </div>
            </div>
          )}
          {currentStep === 4 && (
            <>
              {creationSuccess ? (
                <>
                  <h2 className="text-base font-semibold leading-7 text-gray-900">
                    Complete
                  </h2>
                  <p className="mt-1 text-md leading-6 text-gray-600">
                    Thank you for your submission.
                  </p>
                  <Button onClick={() => router.push('/dashboard/events')}>
                    View event in dashboard
                  </Button>
                </>
              ) : (
                <>
                  <h2 className="text-base font-semibold leading-7 text-gray-900">
                    Failed
                  </h2>
                  <p className="mt-1 text-md leading-6 text-gray-600">
                    Your submission failed unexpectedly.
                  </p>
                  <Button onClick={() => router.push('/dashboard/events')}>
                    Try Again
                  </Button>
                </>
              )}
            </>
          )}
        </form>
      </Form>

      <div className="mt-8 pt-5">
        <div className="flex justify-between">
          <Button
            onClick={prev}
            disabled={
              currentStep === 0 || currentStep === steps.length - 1 || loading
            }
          >
            <ChevronLeft />
          </Button>
          <Button
            onClick={next}
            disabled={currentStep === steps.length - 1 || loading}
          >
            {currentStep !== steps.length - 2 ? <ChevronRight /> : 'Complete'}
          </Button>
        </div>
      </div>
    </section>
  );
}

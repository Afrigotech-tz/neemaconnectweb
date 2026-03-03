import { z } from 'zod';

export const eventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  type: z.enum(['concert', 'service', 'live_recording', 'conference', 'other'], {
    required_error: 'Event type is required',
  }),
  date: z.string().min(1, 'Date is required'),
  location: z.string().min(1, 'Location is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  venue: z.string().min(1, 'Venue is required'),
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  ticket_price: z.number().min(0, 'Ticket price cannot be negative'),
  ticket_url: z.string().url('Invalid URL format').optional().or(z.literal('')),
  image: z.string().optional(),
  is_featured: z.boolean().default(false),
  is_public: z.boolean().default(true),
  status: z.enum(['upcoming', 'past', 'cancelled']).default('upcoming'),
});

export type EventFormData = z.infer<typeof eventSchema>;

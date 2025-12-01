import { z } from 'zod';

export const profileUpdateSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state_province: z.string().min(1, 'State/Province is required'),
  postal_code: z.string().min(1, 'Postal code is required'),
  bio: z.string().optional(),
  date_of_birth: z.string().optional().nullable(),
  occupation: z.string().optional().nullable(),
  location_public: z.boolean().default(false),
  profile_public: z.boolean().default(true),
});

export const locationUpdateSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  postal_code: z.string().min(1, 'Postal code is required'),
  location_public: z.boolean().default(false),
});

export const profilePictureSchema = z.object({
  profile_picture: z.instanceof(File).refine(
    (file) => file.size <= 5 * 1024 * 1024, // 5MB max
    'File size must be less than 5MB'
  ).refine(
    (file) => ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type),
    'File must be an image (JPEG, PNG, GIF, WEBP)'
  ),
});

export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;
export type LocationUpdateData = z.infer<typeof locationUpdateSchema>;
export type ProfilePictureData = z.infer<typeof profilePictureSchema>;

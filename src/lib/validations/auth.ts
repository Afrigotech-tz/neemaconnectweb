import { z } from 'zod';

export const registerSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  surname: z.string().min(2, 'Surname must be at least 2 characters'),
  gender: z.string().min(1, 'Please select a gender'),
  phone_number: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[0-9+\-\s()]+$/, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  password_confirmation: z.string(),
  country_id: z.coerce.number().min(1, 'Please select a country'),
  verification_method: z.enum(['email', 'mobile'], { message: 'Please select a verification method' }),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

export const userUpdateSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  surname: z.string().min(2, 'Surname must be at least 2 characters'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type UserUpdateData = z.infer<typeof userUpdateSchema>;

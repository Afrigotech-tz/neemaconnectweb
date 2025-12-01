import { z } from 'zod';

const baseRegisterSchema = {
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  surname: z.string().min(2, 'Surname must be at least 2 characters'),
  gender: z.enum(['male', 'female'], {
    errorMap: () => ({ message: 'Please select a gender' })
  }),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  password_confirmation: z.string(),
  country_id: z.number().min(1, 'Please select a country'),
};

const mobileRegisterSchema = z.object({
  ...baseRegisterSchema,
  verification_method: z.literal('mobile'),
  phone_number: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[0-9+\-\s()]+$/, 'Please enter a valid phone number'),
  email: z.string().optional(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

const emailRegisterSchema = z.object({
  ...baseRegisterSchema,
  verification_method: z.literal('email'),
  email: z.string().email('Please enter a valid email address'),
  phone_number: z.string().optional(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

export const registerSchema = z.union([mobileRegisterSchema, emailRegisterSchema]);

export const userUpdateSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  surname: z.string().min(2, 'Surname must be at least 2 characters'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type UserUpdateData = z.infer<typeof userUpdateSchema>;

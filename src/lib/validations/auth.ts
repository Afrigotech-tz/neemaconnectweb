import { z } from 'zod';

<<<<<<< HEAD
// Step 1: Personal Info Schema
export const personalInfoSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  surname: z.string().min(2, 'Surname must be at least 2 characters'),
  gender: z.enum(['male', 'female'], {
    errorMap: () => ({ message: 'Please select a gender' })
  }),
});

// Step 2: Contact Info Schema (conditional)
export const contactInfoSchemaBase = z.object({
  verification_method: z.enum(['mobile', 'email']),
  country_id: z.number().min(1, 'Please select a country'),
});

export const mobileContactSchema = contactInfoSchemaBase.extend({
  verification_method: z.literal('mobile'),
=======
export const registerSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  surname: z.string().min(2, 'Surname must be at least 2 characters'),
  gender: z.string().min(1, 'Please select a gender'),
>>>>>>> live
  phone_number: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[0-9+\-\s()]+$/, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email address'),
<<<<<<< HEAD
});

export const emailContactSchema = contactInfoSchemaBase.extend({
  verification_method: z.literal('email'),
  email: z.string().email('Please enter a valid email address'),
  phone_number: z.string().optional(),
});

export const contactInfoSchema = z.union([mobileContactSchema, emailContactSchema]);

// Step 3: Security Schema
export const securitySchema = z.object({
=======
>>>>>>> live
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  password_confirmation: z.string(),
<<<<<<< HEAD
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

// Combined full schema
const sharedFields = {
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  surname: z.string().min(2, 'Surname must be at least 2 characters'),
  gender: z.enum(['male', 'female'], {
    errorMap: () => ({ message: 'Please select a gender' })
  }),
  country_id: z.number().min(1, 'Please select a country'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  password_confirmation: z.string(),
};

const mobileRegisterSchema = z.object({
  ...sharedFields,
  verification_method: z.literal('mobile'),
  phone_number: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[0-9+\-\s()]+$/, 'Please enter a valid phone number'),
  email: z.string().optional(),
=======
  country_id: z.coerce.number().min(1, 'Please select a country'),
  verification_method: z.enum(['email', 'mobile'], { message: 'Please select a verification method' }),
>>>>>>> live
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

<<<<<<< HEAD
const emailRegisterSchema = z.object({
  ...sharedFields,
  verification_method: z.literal('email'),
  email: z.string().email('Please enter a valid email address'),
  phone_number: z.string().optional(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
});

export const registerSchema = z.union([mobileRegisterSchema, emailRegisterSchema]);

=======
>>>>>>> live
export const userUpdateSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  surname: z.string().min(2, 'Surname must be at least 2 characters'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
export type UserUpdateData = z.infer<typeof userUpdateSchema>;
export type PersonalInfoData = z.infer<typeof personalInfoSchema>;
export type ContactInfoData = z.infer<typeof contactInfoSchema>;
export type SecurityData = z.infer<typeof securitySchema>;

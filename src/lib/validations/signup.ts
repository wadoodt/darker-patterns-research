import { z } from 'zod';

export const signupSchema = z.object({
  displayName: z.string().min(2, { message: 'Display name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  isResearcher: z.boolean().default(false).optional(),
});

export type SignupFormValues = z.infer<typeof signupSchema>;

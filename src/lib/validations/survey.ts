import { z } from 'zod';

export const participationEmailSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }).min(1, { message: 'Email is required' }),
});

export const participationSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('email'),
    email: z.string().email({ message: 'Please enter a valid email address' }).min(1, { message: 'Email is required' }),
    termsAgreed: z.literal(true, { message: 'You must agree to the terms and privacy policy' }),
  }),
  z.object({
    type: z.literal('anonymous'),
    email: z.string().optional(),
    termsAgreed: z.literal(true, { message: 'You must agree to the terms and privacy policy' }),
  }),
]);

export type ParticipationFormValues = z.infer<typeof participationSchema>;
export type ParticipationEmailValues = z.infer<typeof participationEmailSchema>;

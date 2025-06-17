import { z } from 'zod';

// Schema for a single DPO entry in the dataset to be ingested.
// This schema is flexible, accepting multiple field names for compatibility,
// and transforms the data into a consistent internal format.
export const dpoEntrySchema = z
  .object({
    instruction: z.string().min(1, { message: 'Instruction cannot be empty.' }),
    prompt: z.string().optional(),
    discussion: z.string().optional(),

    // Accept `acceptedResponse` or `accepted`
    acceptedResponse: z.string().optional(),
    accepted: z.string().optional(),

    // Accept `rejectedResponse` or `rejected`
    rejectedResponse: z.string().optional(),
    rejected: z.string().optional(),

    // Accept `categories` (array) or `category` (string)
    categories: z.array(z.string()).optional(),
    category: z.string().optional(),
  })
  .transform((data, ctx) => {
    // 1. Consolidate `categories` from either `categories` or `category`
    const categories = data.categories ?? (data.category ? [data.category] : undefined);
    if (!categories || categories.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Each entry must have either a `categories` array or a `category` string.',
      });
      return z.NEVER;
    }

    // 2. Consolidate `acceptedResponse` from either `acceptedResponse` or `accepted`
    const acceptedResponse = data.acceptedResponse ?? data.accepted;
    if (!acceptedResponse) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Each entry must have either an `acceptedResponse` or `accepted` string.',
      });
      return z.NEVER;
    }

    // 3. Consolidate `rejectedResponse` from either `rejectedResponse` or `rejected`
    const rejectedResponse = data.rejectedResponse ?? data.rejected;
    if (!rejectedResponse) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Each entry must have either a `rejectedResponse` or `rejected` string.',
      });
      return z.NEVER;
    }

    return {
      instruction: data.instruction,
      prompt: data.prompt,
      discussion: data.discussion,
      categories,
      acceptedResponse,
      rejectedResponse,
    };
  });

// Schema for the entire dataset to be ingested.
export const ingestDpoDatasetSchema = z.array(dpoEntrySchema);

export type DpoEntryData = z.infer<typeof dpoEntrySchema>;

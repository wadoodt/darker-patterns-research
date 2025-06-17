import { z } from 'zod';

// Schema for a single DPO entry in the dataset to be ingested.
// This schema is flexible, accepting multiple field names for compatibility,
// and transforms the data into a consistent internal format.
export const dpoEntrySchema = z
  .object({
    instruction: z
      .string()
      .min(1, { message: 'Instruction cannot be empty.' })
      .transform((s) => s.trim()),
    prompt: z.string().optional(),
    discussion: z.string().optional(),

    // Accept either field name and ensure non-empty string
    acceptedResponse: z.string().min(1, 'acceptedResponse cannot be empty').optional(),
    accepted: z.string().min(1, 'accepted cannot be empty').optional(),

    // Accept either field name and ensure non-empty string
    rejectedResponse: z.string().min(1, 'rejectedResponse cannot be empty').optional(),
    rejected: z.string().min(1, 'rejected cannot be empty').optional(),

    // Accept either categories array or single category string
    categories: z.array(z.string().min(1, 'Category cannot be empty')).optional(),
    category: z.string().min(1, 'Category cannot be empty').optional(),
  })
  .passthrough() // Allow additional fields that aren't in the schema
  .transform((data, ctx) => {
    // Helper function to get the first non-empty string from multiple fields
    const getFirstNonEmpty = (...fields: (string | undefined)[]): string | undefined => {
      for (const field of fields) {
        if (field && field.trim()) {
          return field.trim();
        }
      }
      return undefined;
    };

    // 1. Consolidate `categories` from either `categories` or `category`
    const categories =
      data.categories && Array.isArray(data.categories) && data.categories.length > 0
        ? data.categories.filter((c): c is string => Boolean(c && typeof c === 'string'))
        : data.category && typeof data.category === 'string' && data.category.trim() !== ''
          ? [data.category.trim()]
          : undefined;

    if (!categories || categories.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Each entry must have either a non-empty `categories` array or a non-empty `category` string.',
      });
      return z.NEVER;
    }

    // 2. Get accepted response from either field
    const acceptedResponse = getFirstNonEmpty(data.acceptedResponse, data.accepted);
    if (!acceptedResponse) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Each entry must have either a non-empty `acceptedResponse` or `accepted` field.',
      });
      return z.NEVER;
    }

    // 3. Get rejected response from either field
    const rejectedResponse = getFirstNonEmpty(data.rejectedResponse, data.rejected);
    if (!rejectedResponse) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Each entry must have either a non-empty `rejectedResponse` or `rejected` field.',
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

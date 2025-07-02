import { participationEmailSchema, participationSchema } from '@/lib/validations/survey';
import type { DemographicData } from '@/types/dpo';
import { ZodError } from 'zod';

export function validateParticipationDetails(details: {
  type: 'email' | 'anonymous';
  email?: string;
  termsAgreed: boolean;
}): string | null {
  try {
    participationSchema.parse(details);
    return null;
  } catch (error) {
    if (error instanceof ZodError && error.errors?.[0]?.message) {
      return error.errors[0].message;
    }
    return 'Please complete all required fields and agree to terms.';
  }
}

export function canProceedFromIntroStep(details: {
  type: 'email' | 'anonymous' | null;
  email?: string | null;
  termsAgreed: boolean;
}): boolean {
  // Must have a participation type selected
  if (!details.type) return false;

  // Must agree to terms
  if (!details.termsAgreed) return false;

  // For email participation, must have valid email
  if (details.type === 'email') {
    if (!details.email || !details.email.trim()) return false;
    const emailError = validateEmail(details.email);
    return emailError === null;
  }

  // For anonymous participation, just need terms agreement
  return true;
}

export function validateEmail(email: string): string | null {
  if (!email.trim()) {
    return 'Email is required';
  }

  try {
    participationEmailSchema.parse({ email });
    return null;
  } catch (error) {
    if (error instanceof ZodError && error.errors?.[0]?.message) {
      return error.errors[0].message;
    }
    return 'Please enter a valid email address';
  }
}

export function validateDemographics(data: DemographicData): string | null {
  if (
    !data ||
    !data.ageGroup ||
    !data.gender ||
    !data.educationLevel ||
    !data.fieldOfExpertise ||
    !data.aiFamiliarity
  ) {
    return 'Please fill out all required demographic fields.';
  }

  if (data.gender === 'Prefer to self-describe' && !data.genderOther?.trim()) {
    return "Please specify your gender if 'Prefer to self-describe' is selected.";
  }

  if (data.educationLevel === 'Other' && !data.educationOther?.trim()) {
    return "Please specify your education if 'Other' is selected.";
  }

  if (data.fieldOfExpertise === 'Other' && !data.expertiseOther?.trim()) {
    return "Please specify your field of expertise if 'Other' is selected.";
  }

  return null;
}

import type { DemographicData } from '@/types/dpo';

export function validateParticipationDetails(details: {
  type: 'email' | 'anonymous';
  email?: string;
  termsAgreed: boolean;
}): string | null {
  if (!details.type || !details.termsAgreed) {
    return 'Please select participation type and agree to terms.';
  }

  if (details.type === 'email') {
    if (!details.email || !validateEmail(details.email)) {
      return 'Please provide a valid email address or choose anonymous.';
    }
  }

  return null;
}

export function validateEmail(email: string): string | null {
  if (!/\S+@\S+\.\S+/.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
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

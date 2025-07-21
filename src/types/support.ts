export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  [key: string]: unknown; // Index signature for Entity constraint
}

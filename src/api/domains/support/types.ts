
export interface TicketMessage {
  author: "user" | "support";
  content: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  subject: string;
  email: string;
  status: "open" | "in_progress" | "closed";
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
  [key: string]: string | TicketMessage[] | "open" | "in_progress" | "closed" | undefined;
}

// Responses
export interface PaginatedTicketsResponse {
  supportTickets: SupportTicket[];
  totalItems: number;
  page: number;
  totalPages: number;
}

export type TicketResponse = {
  supportTicket: SupportTicket;
};

export type ContactSubmissionResponse = {
  support: {
    message: string;
  };
};

// Payloads
export type ContactSubmissionPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type CreateTicketReplyPayload = Omit<TicketMessage, "createdAt">; 
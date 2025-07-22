export interface TicketMessage {
  author: "user" | "support";
  content: string;
  createdAt: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- allow index signature for dynamic properties
  [key: string]: any;
}

export interface SupportTicket {
  id: string;
  subject: string;
  email: string;
  status: "open" | "in_progress" | "closed";
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- allow index signature for dynamic properties
  [key: string]: any;
}


export interface TicketMessage {
  author: "user" | "support";
  content: string;
  createdAt: string;
  [key: string]: string | number | boolean;
}

export interface SupportTicket {
  id: string;
  subject: string;
  email: string;
  status: "open" | "in_progress" | "closed";
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
  [key: string]: string | number | boolean | TicketMessage[];
}

export interface PaginatedTicketsResponse {
  supportTickets?: SupportTicket[];
  totalItems?: number;
  currentPage?: number;
  totalPages?: number;
} 
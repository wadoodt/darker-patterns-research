 export interface TicketMessage {
    author: 'user' | 'support';
    content: string;
    createdAt: string;
}

export interface SupportTicket {
    id: string;
    subject: string;
    email: string;
    status: 'open' | 'in_progress' | 'closed';
    createdAt: string;
    updatedAt: string;
    messages: TicketMessage[];
}

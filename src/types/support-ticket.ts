 
export interface SupportTicket {
    [key: string]: unknown;
    id: string;
    subject: string;
    email: string;
    message: string;
    status: 'open' | 'in_progress' | 'closed';
    createdAt: string;
    updatedAt: string;
}

import { db } from '../db';

export const createContactSubmission = async (request: Request) => {
  const body = await request.json();
  db.contactSubmissions.create(body);
  return new Response(JSON.stringify({ message: 'Submission received' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const getMyTickets = async () => {
  const tickets = db.supportTickets.findMany({});
  return new Response(JSON.stringify(tickets), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const getTicketById = async (_request: Request, { ticketId }: { ticketId: string }) => {
  const ticket = db.supportTickets.findFirst({ where: { id: ticketId } });
  if (!ticket) {
    return new Response('Ticket not found', { status: 404 });
  }
  return new Response(JSON.stringify(ticket), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const createTicketReply = async (request: Request, { ticketId }: { ticketId: string }) => {
  const body = await request.json();
  const ticket = db.supportTickets.findFirst({ where: { id: ticketId } });

  if (!ticket) {
    return new Response('Ticket not found', { status: 404 });
  }

  const updatedTicket = db.supportTickets.update({
    where: { id: ticketId },
    data: {
      messages: [...ticket.messages, { ...body, createdAt: new Date().toISOString() }],
      updatedAt: new Date().toISOString(),
    },
  });

  return new Response(JSON.stringify(updatedTicket), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

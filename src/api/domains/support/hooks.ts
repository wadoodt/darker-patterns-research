
import { useAsyncCache } from "@hooks/useAsyncCache";
import { support } from "./index";

export const useMyTickets = (page: number = 1, limit: number = 10) => {
  return useAsyncCache(
    ["support", "tickets", page, limit],
    () => support.myTickets(page, limit),
    { ttl: 5 * 60 * 1000 } // 5 minutes
  );
};

export const useTicket = (ticketId: string) => {
  return useAsyncCache(
    ["support", "tickets", ticketId],
    () => support.getTicket(ticketId),
    { ttl: 5 * 60 * 1000 } // 5 minutes
  );
};

export const useReplyToTicket = () => {
  const { refresh } = useAsyncCache(["support", "tickets"], () => Promise.resolve({ tickets: [], totalPages: 0, currentPage: 1 }));
  
  return {
    mutate: async (ticketId: string, reply: { content: string }) => {
      const result = await support.replyToTicket(ticketId, reply);
      await refresh();
      return result;
    },
    isLoading: false,
  };
};

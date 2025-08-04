import { db } from "../db";
import type { Table } from "../drizzle/createMockTable";
import { RESPONSE_CODES } from "../../codes";

type AnyTable = Table<Record<string, unknown> & { id: string | number }>;

interface PagedResponseArgs<T extends keyof typeof db> {
  table: T;
  page: number;
  limit: number;
  domain: string;
  where?: Parameters<AnyTable["findMany"]>[0]["where"];
  orderBy?: Parameters<AnyTable["findMany"]>[0]["orderBy"];
}

export const createPagedResponse = <T extends keyof typeof db>({
  table,
  page,
  limit,
  domain,
  where,
  orderBy,
}: PagedResponseArgs<T>) => {
  const tableAccessor = db[table] as AnyTable;

  // Get all items to calculate total pages, then paginate
  const allItems = tableAccessor.findMany({ where, orderBy });
  const totalItems = allItems.length;
  const totalPages = Math.ceil(totalItems / limit);

  const paginatedData = allItems.slice((page - 1) * limit, page * limit);

  const { status, message } = RESPONSE_CODES.OPERATION_SUCCESS;

  return new Response(
    JSON.stringify({
      [domain]: paginatedData,
      currentPage: page,
      totalPages,
      total: totalItems,
    }),
    { status, statusText: message }
  );
};

import { db } from "../db";
import type { Table } from "../lib/createTable";

type AnyTable = Table<Record<string, unknown> & { id: string | number }>;

interface PagedResponseArgs<T extends keyof typeof db> {
  table: T;
  page: number;
  limit: number;
  where?: Parameters<AnyTable["findMany"]>[0]["where"];
  orderBy?: Parameters<AnyTable["findMany"]>[0]["orderBy"];
}

export const createPagedResponse = <T extends keyof typeof db>({
  table,
  page,
  limit,
  where,
  orderBy,
}: PagedResponseArgs<T>) => {
  const tableAccessor = db[table] as AnyTable;

  // Get all items to calculate total pages, then paginate
  const allItems = tableAccessor.findMany({ where, orderBy });
  const totalItems = allItems.length;
  const totalPages = Math.ceil(totalItems / limit);

  const paginatedData = allItems.slice((page - 1) * limit, page * limit);

  return {
    data: paginatedData,
    currentPage: page,
    totalPages,
    total: totalItems,
  };
};

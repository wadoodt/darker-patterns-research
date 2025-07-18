// A generic type for the objects our DB will hold.
// Assumes an 'id' property, but can be adapted.
type Entity = { id: string | number; [key: string]: unknown };

// Mimics Drizzle's 'where' clause for simple key-value equality.
type WhereClause<T> = Partial<T>;

// Defines the structure for our Drizzle-like query options.
export interface QueryOptions<T> {
  where?: WhereClause<T>;
  page?: number;
  limit?: number;
  orderBy?: { [K in keyof T]?: "asc" | "desc" };
  query?: string; // For full-text search
}

/**
 * Creates a mock database table with Drizzle-like query methods.
 * This factory provides a stateful, in-memory data store that can be manipulated
 * and queried, closely emulating a real database table for development and testing.
 *
 * @template T The type of the entity, which must have an 'id' property.
 * @param {T[]} initialData The initial array of data to seed the table. This data is deep-copied.
 * @returns An object with methods to interact with the table data.
 */
export function createTable<T extends Entity>(initialData: T[]) {
  // Use a deep copy to ensure the original seed data is never mutated.
  let tableData = JSON.parse(JSON.stringify(initialData));

  const matches = (item: T, where: WhereClause<T>): boolean => {
    return Object.entries(where).every(
      ([key, value]) => item[key as keyof T] === value,
    );
  };

  return {
    /**
     * Finds the first record that matches the provided `where` clause.
     * @param {{ where?: WhereClause<T> }} params - The query parameters.
     * @param {WhereClause<T>} [params.where] - An object where keys are property names and values are the desired values to match.
     * @returns {T | undefined} The first matching record, or `undefined` if no match is found.
     */
    findFirst({ where = {} }: { where?: WhereClause<T> }): T | undefined {
      return tableData.find((item: T) => matches(item, where));
    },

    /**
     * Finds all records, with support for filtering, full-text search, sorting, and pagination.
     * @param {QueryOptions<T>} [options] - The query options.
     * @param {WhereClause<T>} [options.where] - An object for key-value equality filtering.
     * @param {number} [options.page=1] - The page number for pagination.
     * @param {number} [options.limit=10] - The number of records per page.
     * @param {object} [options.orderBy] - An object to specify sorting order, e.g., `{ name: 'asc' }`.
     * @param {string} [options.query] - A string for full-text search across all string properties of the records.
     * @returns {T[]} An array of matching records.
     */
    findMany({
      where = {},
      page = 1,
      limit = 10,
      orderBy = {},
      query = "",
    }: QueryOptions<T>): T[] {
      let results = tableData.filter((item: T) => matches(item, where));

      // Full-text search across all string properties
      if (query) {
        const lowerCaseQuery = query.toLowerCase();
        results = results.filter((item: T) =>
          Object.values(item).some(
            (value) =>
              typeof value === "string" &&
              value.toLowerCase().includes(lowerCaseQuery),
          ),
        );
      }

      // Sorting
      const [field, direction] = Object.entries(orderBy)[0] || [];
      if (field) {
        results.sort((a: T, b: T) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const valA = a[field] as any;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const valB = b[field] as any;
          if (valA < valB) return direction === "asc" ? -1 : 1;
          if (valA > valB) return direction === "asc" ? 1 : -1;
          return 0;
        });
      }

      // Pagination
      const startIndex = (page - 1) * limit;
      return results.slice(startIndex, startIndex + limit);
    },

    /**
     * Creates a new record in the table. The ID is auto-incremented.
     * @param {{ data: Omit<T, 'id'> }} params - The creation parameters.
     * @param {Omit<T, 'id'>} params.data - The data for the new record, excluding the 'id'.
     * @returns {T} The newly created record, including its new ID.
     */
    create(data: Omit<T, "id"> & { id?: string | number }): T {
      const newItem = { ...data, id: data.id || crypto.randomUUID() } as T;
      tableData.push(newItem);
      return newItem;
    },

    /**
     * Finds the first record matching the `where` clause and updates it with new data.
     * @param {{ where?: WhereClause<T>, data: Partial<T> }} params - The update parameters.
     * @param {WhereClause<T>} [params.where] - The clause to find the record to update.
     * @param {Partial<T>} params.data - An object containing the fields to update.
     * @returns {T | undefined} The updated record, or `undefined` if no record was found.
     */
    update({
      where = {},
      data,
    }: {
      where?: WhereClause<T>;
      data: Partial<T>;
    }): T | undefined {
      const itemIndex = tableData.findIndex((item: T) => matches(item, where));
      if (itemIndex === -1) return undefined;

      tableData[itemIndex] = { ...tableData[itemIndex], ...data };
      return tableData[itemIndex];
    },

    /**
     * Deletes the first record that matches the `where` clause.
     * @param {{ where?: WhereClause<T> }} params - The deletion parameters.
     * @param {WhereClause<T>} [params.where] - The clause to find the record to delete.
     * @returns {T | undefined} The deleted record, or `undefined` if no record was found.
     */
    delete({ where = {} }: { where?: WhereClause<T> }): T | undefined {
      const itemIndex = tableData.findIndex((item: T) => matches(item, where));
      if (itemIndex === -1) return undefined;

      const [deletedItem] = tableData.splice(itemIndex, 1);
      return deletedItem;
    },

    /**
     * Resets the table to its initial state. Useful for testing.
     */
    _reset() {
      tableData = JSON.parse(JSON.stringify(initialData));
    },
  };
}

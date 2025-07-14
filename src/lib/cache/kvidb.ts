// src/lib/cache/kvidb.ts

/**
 * Minimal IndexedDB key-value store wrapper for async/await usage, tailored for cache context.
 * Usage: const kv = await kvidb('db', 'store', 1)
 * Methods: get, put, del, clear, keys
 */
export default async function kvidb(
  db_name = "db",
  store_name = "store",
  version = 1
) {
  const indexedDB = window.indexedDB;
  const idb = indexedDB.open(db_name, version);
  idb.onupgradeneeded = () => idb.result.createObjectStore(store_name);
  const db: IDBDatabase = await new Promise((resolve, reject) => {
    idb.onsuccess = () => resolve(idb.result);
    idb.onerror = () => reject(idb.error);
    idb.onblocked = () => reject(new Error("IndexedDB open blocked"));
  });
  return { get, put, del, clear, keys };

  function pfyRequest<T>(request: IDBRequest<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  function getstore(): IDBObjectStore {
    return db.transaction(store_name, "readonly").objectStore(store_name);
  }
  function allstore(): IDBObjectStore {
    return db.transaction(store_name, "readwrite").objectStore(store_name);
  }
  function get<T = unknown>(key: IDBValidKey): Promise<T | undefined> {
    const store = getstore();
    return pfyRequest<T | undefined>(store.get(key));
  }
  async function put<T = unknown>(key: IDBValidKey, val: T): Promise<boolean> {
    const store = allstore();
    store.put(val, key);
    return await new Promise((resolve, reject) => {
      store.transaction.oncomplete = () => resolve(true);
      store.transaction.onerror = () => reject(store.transaction.error);
      store.transaction.onabort = () => reject(store.transaction.error);
    });
  }
  async function del(key: IDBValidKey): Promise<boolean> {
    const store = allstore();
    store.delete(key);
    return await new Promise((resolve, reject) => {
      store.transaction.oncomplete = () => resolve(true);
      store.transaction.onerror = () => reject(store.transaction.error);
      store.transaction.onabort = () => reject(store.transaction.error);
    });
  }
  async function clear(): Promise<boolean> {
    const store = allstore();
    store.clear();
    return await new Promise((resolve, reject) => {
      store.transaction.oncomplete = () => resolve(true);
      store.transaction.onerror = () => reject(store.transaction.error);
      store.transaction.onabort = () => reject(store.transaction.error);
    });
  }
  function keys(): Promise<IDBValidKey[]> {
    const store = getstore();
    return pfyRequest<IDBValidKey[]>(store.getAllKeys());
  }
}

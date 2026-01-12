export declare const __kind__: unique symbol

export type Id<T> = string & { [__kind__] ?: T }

export namespace Id {
  export type Table = {
    [id: string]: any
  }
}

const GLOBAL =  { } satisfies Id.Table

export function acquire<T>(what: T, id ?: string, use: Id.Table = GLOBAL) {
  id ??= uniqueId(use)
  if (id in use)
    throw new Error(`[Id.acquire] Resource with id '${id}' already exists.`)
  use[id] = what
  return id as Id<T>
}

export function resolve<T>(id: Id<T>, use: Id.Table = GLOBAL) {
  if (!(id in use))
    throw new Error(`[Id.resolve] Resource with id '${id}' does not exist.`)
  return use[id] as T
}

export function release<T>(id: Id<T>, use: Id.Table = GLOBAL) {
  if (!(id in use))
    throw new Error(`[Id.release] Resource with id '${id}' does not exist.`)
  delete use[id]
}

export function id<T>(what: Id<T> | T, use: Id.Table = GLOBAL) {
  if (typeof what !== "string")
    what = acquire(what)
  return what
}

export function un<T>(what: Id<T> | T, use: Id.Table = GLOBAL) {
  if (typeof what === "string")
    what = resolve(what)
  return what
}

export const Id = {
  acquire,
  resolve,
  release,

  Table: {
    new() {
      return { } satisfies Id.Table
    }
  }
}

function uniqueId(table: { [id: string]: any }) {
  let id = crypto.randomUUID()
  while (id in table)
      id = crypto.randomUUID()
  return id
}
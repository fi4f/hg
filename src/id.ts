declare const __kind__: unique symbol

export type Id<T> = string & { [__kind__] ?: T }

export namespace Id {
  export type Table = {
    [id: string]: any
  }
}

export const Id = {
  Table: {
    new() {
      return { } satisfies Id.Table
    },

    acquire<T>(table: Id.Table, what: T, id ?: string) {
      id ??= uniqueId(table)
      if (id in table)
        throw new Error(`[Id.Table.acquire] Resource with id '${id}' already exists.`)
      table[id] = what
      return id as Id<T>
    },

    resolve<T>(table: Id.Table, id   : Id<T>    ) {
      if (!(id in table))
        throw new Error(`[Id.Table.resolve] Resource with id '${id}' does not exist.`)
      return table[id] as T
    },

    release<T>(table: Id.Table, id   : Id<T>    ) {
      if (!(id in table))
        throw new Error(`[Id.Table.release] Resource with id '${id}' does not exist.`)
      delete table[id]
    },

      wrap <T>(table: Id.Table, maybe: Id<T> | T) {
      return typeof maybe !== "string" ? Id.Table.acquire(table, maybe): maybe as Id<T>
    },

    unwrap <T>(table: Id.Table, maybe: Id<T> | T) {
      return typeof maybe === 'string' ? Id.Table.resolve(table, maybe): maybe as T
    },

    __default__: { } satisfies Id.Table,
  },  

  acquire<T>(what: T, id ?: string) {
    return Id.Table.acquire(Id.Table.__default__, what, id)
  },

  resolve<T>(id   : Id<T>    ) {
    return Id.Table.resolve(Id.Table.__default__, id   )
  },

  release<T>(id   : Id<T>    ) {
    return Id.Table.release(Id.Table.__default__, id   )
  },

    wrap <T>(maybe: Id<T> | T) {
    return Id.Table.  wrap (Id.Table.__default__, maybe)
  },

  unwrap <T>(maybe: Id<T> | T) {
    return Id.Table.unwrap (Id.Table.__default__, maybe)
  }
}

function uniqueId(table: { [id: string]: any }) {
  let id = crypto.randomUUID()
  while (id in table)
      id = crypto.randomUUID()
  return id
}
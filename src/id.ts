declare const __kind__: unique symbol

export type Id<T> = string & { [__kind__] ?: T }

export const Id = {
  acquire<T>(what: T, id ?: string) {
    return Lookup.acquire(what, id)
  },

  resolve<T>(id   : Id<T>    ) {
    return Lookup.resolve(id )
  },

  release<T>(id   : Id<T>    ) {
    return Lookup.release(id )
  },

    wrap <T>(any: Id<T> | T) {
    return Lookup.  wrap (any)
  },

  unwrap <T>(any: Id<T> | T) {
    return Lookup.unwrap (any)
  },
}

export namespace Lookup {
  export type Instance = {
    [id: Id<any>]: any
  }
}

let __default__: Lookup.Instance;

export const Lookup = {
  Instance: {
    new() {
      return { } satisfies Lookup.Instance
    },

    acquire<T>(lookup: Lookup.Instance, what: T, id ?: string) {
      id ??= uniqueId(lookup)
      if (id in lookup)
        throw new Error(`[Lookup.Instance.acquire] Resource with id '${id}' already exists.`)
      lookup[id] = what
      return id as Id<T>
    },

    resolve<T>(lookup: Lookup.Instance, id : Id<T>    ) {
      if (!(id in lookup))
        throw new Error(`[Lookup.Instance.resolve] Resource with id '${id}' does not exist.`)
      return lookup[id] as T
    },

    release<T>(lookup: Lookup.Instance, id : Id<T>    ) {
      if (!(id in lookup))
        throw new Error(`[Lookup.Instance.release] Resource with id '${id}' does not exist.`)
      delete lookup[id]
    },

      wrap <T>(lookup: Lookup.Instance, any: Id<T> | T) {
      return typeof any !== "string" ? Lookup.Instance.acquire(lookup, any): any as Id<T>
    },

    unwrap <T>(lookup: Lookup.Instance, any: Id<T> | T) {
      return typeof any === 'string' ? Lookup.Instance.resolve(lookup, any): any as T
    }
  },

  acquire<T>(what: T, id ?: string) {
    return Lookup.Instance.acquire(Lookup.__default__, what, id)
  },

  resolve<T>(id   : Id<T>    ) {
    return Lookup.Instance.resolve(Lookup.__default__, id )
  },

  release<T>(id   : Id<T>    ) {
    return Lookup.Instance.release(Lookup.__default__, id )
  },

    wrap <T>(any: Id<T> | T) {
    return Lookup.Instance.  wrap (Lookup.__default__, any)
  },

  unwrap <T>(any: Id<T> | T) {
    return Lookup.Instance.unwrap (Lookup.__default__, any)
  },

  get __default__() { return __default__ ??= Lookup.Instance.new() }
}

function uniqueId(lookup: { [id: string]: any }) {
  let id = crypto.randomUUID()
  while (id in lookup)
      id = crypto.randomUUID()
  return id
}
import type { Plain } from "./plain.js"
import { Id } from "./id.js"

declare const __kind__: unique symbol

export namespace Event {
  export type Category<E extends Plain = any> = string & { [__kind__] ?: E }
  export type Callback<E extends Plain = any> = {
    (what: E, context: Context<E>): void
  }
  export type Context<E extends Plain = any> = {
    from: Bus.Instance
    kind:    Category<E>
    self: Id<Callback<E>>
  }
}

export const Event = {
  on  <E extends Plain>(kind: Event.Category<E>, call:    Event.Callback<E> , defer=true) {
    Bus.on  (kind, call, defer)
  },

  off <E extends Plain>(kind: Event.Category<E>, call: Id<Event.Callback<E>>, defer=true) {
    Bus.off (kind, call, defer)
  },

  emit<E extends Plain>(kind: Event.Category<E>, what: E, defer=true) {
    Bus.emit(kind, what, defer)
  },

  poll() {
    Bus.poll()
  },

  once<E extends Plain>(call: Event.Callback<E>) {
    return ((what, {from, kind, self}) => {
      call(what, {from, kind, self})
      Bus.off(kind, self, false)
    }) as Event.Callback<E>
  }
}

export namespace Bus {
  export type Instance = {
    pending: Array<Bus.Action>
    handles: {[kind: Event.Category]: Array<Id<Event.Callback>>}
  }

  export type Action<E extends Plain = any> =
    | { is: "on"  , kind: Event.Category<E>, call: Id<Event.Callback<E>> }
    | { is: "off" , kind: Event.Category<E>, call: Id<Event.Callback<E>> }
    | { is: "emit", kind: Event.Category<E>, what: E                      }
}

let __default__: Bus.Instance;

export const Bus = {
  Instance: {
    new() {
      return {
        pending: [ ],
        handles: { }
      } satisfies Bus.Instance
    },

    on  <E extends Plain>(bus: Bus.Instance, kind: Event.Category<E>, call:    Event.Callback<E> , defer=true) {
      const a = { is: "on"  , kind, call: Id.acquire(call) } satisfies Bus.Action & { is: "on"  }
      if (defer) queue(bus, a)
      else       flush(bus, a)
    },

    off <E extends Plain>(bus: Bus.Instance, kind: Event.Category<E>, call: Id<Event.Callback<E>>, defer=true) {
      const a = { is: "off" , kind, call                   } satisfies Bus.Action & { is: "off" }
      if (defer) queue(bus, a)
      else       flush(bus, a)
    },

    emit<E extends Plain>(bus: Bus.Instance, kind: Event.Category<E>, what: E            , defer=true) {
      const a = { is: "emit", kind, what } satisfies Bus.Action & { is: "emit" }
      if (defer) queue(bus, a)
      else       flush(bus, a)
    },

    poll(bus: Bus.Instance) {
      bus.pending.splice(0).forEach(
        a => flush(bus, a)
      )
    }
  },

  on  <E extends Plain>(kind: Event.Category<E>, call:    Event.Callback<E> , defer=true) {
    Bus.Instance.on  (Bus.__default__, kind, call, defer)
  },

  off <E extends Plain>(kind: Event.Category<E>, call: Id<Event.Callback<E>>, defer=true) {
    Bus.Instance.off (Bus.__default__, kind, call, defer)
  },

  emit<E extends Plain>(kind: Event.Category<E>, what: E, defer=true) {
    Bus.Instance.emit(Bus.__default__, kind, what, defer)
  },

  poll() {
    Bus.Instance.poll(Bus.__default__)
  },

  get __default__() { return __default__ ??= Bus.Instance.new() }
}

function queue(bus: Bus.Instance, a: Bus.Action) {
  bus.pending.push(a)
}

function flush(bus: Bus.Instance, a: Bus.Action) {
  switch (a.is) { 
    case "on"  : return on  (bus, a);
    case "off" : return off (bus, a);
    case "emit": return emit(bus, a);
  }
}

function on  (bus: Bus.Instance, { kind, call }: Bus.Action & { is: "on"   }) {
  const list = bus.handles[kind] ?? (bus.handles[kind] = [ ])
  if (list.includes(call))
    throw new Error(`[Bus.on] Listener<${kind}> with id '${call}' already exists.`)
  list.push(call)
}

function off (bus: Bus.Instance, { kind, call }: Bus.Action & { is: "off"  }) {
  const list = bus.handles[kind]
  if (!list || !list.includes(call))
    throw new Error(`[Bus.off] Listener<${kind}> with id '${call}' does not exist.`)
  Id.release(list.splice(list.indexOf(call), 1)[0]!)
}

function emit(from: Bus.Instance, { kind, what }: Bus.Action & { is: "emit" }) {
  from.handles[kind]?.forEach(self => Id.resolve(self)(what, {from, kind, self}))
}


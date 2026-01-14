import type { Plain } from "../util/plain.js"
import { Id } from "./id.js"

declare const __when__: unique symbol

export namespace Event {
  export type Signal<E extends Plain = any> = string & { [__when__] ?: E }

  export type Listener<E extends Plain = any> = {
    (what: E, context: Context<E>): void
  }

  export type Context<E extends Plain = any> = {
    from: Bus
    when: Signal<E>
    self: Id<Listener<E>>
  }

  export type Action<E extends Plain = any> =
  | { is: "on"  , when: Signal<E>, then: Id<Listener<E>> }
  | { is: "off" , when: Signal<E>, then: Id<Listener<E>> }
  | { is: "emit", when: Signal<E>, what: E               }

  export type Bus = {
    queue    : Array<Action>
    listeners: {[when: Signal]: Array<Id<Listener>>}
  }
}

export const Event = {
  Bus: {
    on  <E extends Plain>(bus: Event.Bus, when: Event.Signal<E>, then:    Event.Listener<E> , defer=true) {
      const a = { is: "on"  , when, then: Id.acquire(then) } satisfies Event.Action & { is: "on"  }
      if (defer) queue(bus, a)
      else       flush(bus, a)
    },

    off <E extends Plain>(bus: Event.Bus, when: Event.Signal<E>, then: Id<Event.Listener<E>>, defer=true) {
      const a = { is: "off" , when, then                   } satisfies Event.Action & { is: "off" }
      if (defer) queue(bus, a) 
      else       flush(bus, a)
    },

    emit<E extends Plain>(bus: Event.Bus, when: Event.Signal<E>, what: E, defer=true) {
      const a = { is: "emit", when, what } satisfies Event.Action & { is: "emit" }
      if (defer) queue(bus, a)
      else       flush(bus, a)
    },

    poll(bus: Event.Bus) {
      bus.queue.splice(0).forEach(
        a => flush(bus, a)
      )
    },

    __default__: {
      queue    : [ ],
      listeners: { }
    } satisfies Event.Bus
  },

  on  <E extends Plain>(when: Event.Signal<E>, then:    Event.Listener<E> , defer=true) {
    Event.Bus.on  (Event.Bus.__default__, when, then, defer)
  },

  off <E extends Plain>(when: Event.Signal<E>, then: Id<Event.Listener<E>>, defer=true) {
    Event.Bus.off (Event.Bus.__default__, when, then, defer)
  },

  emit<E extends Plain>(  as: Event.Signal<E>, what: E, defer=true) {
    Event.Bus.emit(Event.Bus.__default__, as, what, defer)
  },

  poll() {
    Event.Bus.poll(Event.Bus.__default__)
  },

  once<E extends Plain>(then: Event.Listener<E>) {
    return ((what, {from, when, self}) => {
      then(what, {from, when, self})
      Event.Bus.off(from, when, self, false)
    }) as Event.Listener<E>
  }
}

function queue(bus: Event.Bus, a: Event.Action) {
  bus.queue.push(a)
}

function flush(bus: Event.Bus, a: Event.Action) {
  switch (a.is) { 
    case "on"  : return on  (bus, a);
    case "off" : return off (bus, a);
    case "emit": return emit(bus, a);
  }
}

function on  (from: Event.Bus, { when, then }: Event.Action & { is: "on"   }) {
  const list = from.listeners[when] ?? (from.listeners[when] = [ ])
  if (list.includes(then))
    throw new Error(`[Event.Bus] Listener<${when}> with id '${then}' already exists.`)
  list.push(then)
}

function off (from: Event.Bus, { when, then }: Event.Action & { is: "off"  }) {
  const list = from.listeners[when]
  if (!list || !list.includes(then))
    throw new Error(`[Event.Bus] Listener<${when}> with id '${then}' does not exist.`)
  Id.release(list.splice(list.indexOf(then), 1)[0]!)
}

function emit(from: Event.Bus, { when, what }: Event.Action & { is: "emit" }) {
  from.listeners[when]?.forEach(self => Id.resolve(self)(what, {from, when, self}))
}
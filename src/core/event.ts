import type { Plain } from "../util/plain.js"
import { Id, un } from "./id.js"

declare const __kind__: unique symbol

export namespace Event {
  export type Signal<E extends Plain> = string & { [__kind__] ?: E }

  export type Handle<E extends Plain> = {
    (what: E, kind: Signal<E>, self: Id<Handle<E>>): void
  }

  export type Context<E extends Plain> = {
    kind:    Signal<E>
    self: Id<Handle<E>>
  }

  export type Action =
    | { action: "attach"  , kind: string, then: Id<Handle<any>> }
    | { action: "detach"  , kind: string, then: Id<Handle<any>> }
    | { action: "dispatch", kind: string, what: any             }

  export type Bus = {
    pending:                        Array<   Action      >
    handles: { [kind: Signal<any>]: Array<Id<Handle<any>>>}
  }
}

const GLOBAL = {
  pending: [ ],
  handles: { }
} satisfies Event.Bus

export function on  <E extends Plain>(kind: Event.Signal<E>, then: Id<Event.Handle<E>> | Event.Handle<E>, defer ?: boolean, use: Event.Bus = GLOBAL) {
  if (typeof then !== "string")
    then = Id.acquire(then)

  const a = { action: "attach", kind, then } satisfies Event.Action
  if (defer ?? true) queue(use, a)
  else               flush(use, a)

  return then
}

export function off <E extends Plain>(kind: Event.Signal<E>, then: Id<Event.Handle<E>>                  , defer ?: boolean, use: Event.Bus = GLOBAL) {
  const a = { action: "detach", kind, then } satisfies Event.Action
  if (defer ?? true) queue(use, a)
  else               flush(use, a)
}

export function emit<E extends Plain>(kind: Event.Signal<E>, what: E, defer ?: boolean, use: Event.Bus = GLOBAL) {
  const a = { action: "dispatch", kind, what } satisfies Event.Action
  if (defer ?? true) queue(use, a)
  else               flush(use, a)
}

export function poll(bus: Event.Bus = GLOBAL) {
  bus.pending.splice(0).forEach(
    a => flush(bus, a)
  )
}

function queue(bus: Event.Bus, a: Event.Action) {
  bus.pending.push(a)
}

function flush(bus: Event.Bus, a: Event.Action) {
  switch (a.action) {
    case "attach"  : return onAttach  (bus, a);
    case "detach"  : return onDetach  (bus, a);
    case "dispatch": return onDispatch(bus, a);
  }
}

function requestHandles(bus: Event.Bus, kind: string) {
  let list = bus.handles[kind]
  if (!list) return
  return list
}

function requireHandles(bus: Event.Bus, kind: string) {
  let list = bus.handles[kind]
  if (!list) bus.handles[kind] = (
    list = [ ]
  )
  return list
}

function onAttach  (bus: Event.Bus, a: Event.Action & { action: "attach" }) {
  const list = requireHandles(bus, a.kind)
  if (!list.includes(a.then)) 
    list.push(a.then)
}

function onDetach  (bus: Event.Bus, a: Event.Action & { action: "detach" }) {
  const list = requestHandles(bus, a.kind)
  if (list && list.includes(a.then))
    Id.release(list.splice(list.indexOf(a.then), 1)[0]!)
}

function onDispatch(bus: Event.Bus, a: Event.Action & { action: "dispatch" }) {
  const list = requestHandles(bus, a.kind)
  if (list) list.forEach(
    self => un(self)(a.what, a.kind, self)
  )
}

export const Event = {
  on, off, emit, poll,

  Bus: {
    new() {
      return {
        pending: [ ],
        handles: { }
      } satisfies Event.Bus
    },

    once<E extends Plain>(bus: Event.Bus, then: Id<Event.Handle<E>> | Event.Handle<E>) {
      return ((what, kind, self) => {
        un (then)(what, kind, self)
        off(kind, self, false, bus)
      }) satisfies Event.Handle<E>
    }
  }
}


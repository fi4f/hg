import type { Id } from "./id.js"






export namespace Event {

  export type Listener = {
    (): void
  }

  export type Graph = {

  }

  export type Scope = {
    children: {[id: string]: Scope}
    trickle : Array<Id<Listener>>
    bubble  : Array<Id<Listener>>
  }

  // trickle
  // bubble
}
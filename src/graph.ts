import type { Id } from "./id.js";





export type Graph<T> = {
  [from: Id<T>]: Array<Id<T>>
}

export const Graph = {

}


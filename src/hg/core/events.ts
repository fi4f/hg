import type { dict, list, str } from "../data"


export type Events = dict<{
  handlers: dict<{ [on: str]: list }>
  requests: list
}>

export type Handler = dict<{

}>

export type Context = dict<{

}>


export const Events = {
  new() {

  },

  on  () { },
  off () { },
  emit() { },
}
import { dict, list, type str } from "../data";


export type Handler<T = unknown> = (context: T) => void;

export type Context<T = unknown> = {
}

export type Events<T = unknown> = {
  handler: dict
  pending: list
}

const __on__   = "__on__";
const __off__  = "__off__";
const __emit__ = "__emit__";


export const Events = {
  new<T = unknown>(): Events<T> {
    return {
      handler: dict.new(),
      pending: list.new(),
    };
  },

  on  <T>(events: Events<T>, on: str, then: Handler<T>, defer = true) {

  },

  off <T>(events: Events<T>, on: str, then: Handler<T>, defer = true) {

  },

  emit<T>(events: Events<T>, on: str, what: T, defer = true) {

  },

  poll<T>(events: Events<T>) {
    
  }
}

import { num } from "./index";

export type list<T extends unknown[] = unknown[]> = T

export const list = {
  // (list a ...)
  new(a: unknown = []): list {
    if (!list.maybe(a)) throw new TypeError(`[list.new] Cannot coerce ${a} to list`);
    return a as list;
  },

  // (list? a)
  maybe(a: unknown): a is list {
    return Array.isArray(a);
  },

  // a:list
  assert(a: unknown): list {
    if (!list.maybe(a)) throw new TypeError(`[list.assert] Expected list, got ${a}`);
    return a;
  },

  get(a: list, i: num, v: unknown = null) {
    return a[i] ?? v;
  },

  put(a: list, v: unknown, i: num = a.length) {
    a[i] = v;
  },

  del(a: list, i: num) {
    if (i < 0 || i >= a.length) throw new RangeError(`[list.del] Index ${i} out of range`);
    a.splice(i, 1);
  },  
}
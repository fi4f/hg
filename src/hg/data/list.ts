import { __list__ } from "./type";
import { Type } from ".";
import { num } from "./num";
import { str } from "./str";

export type list = unknown[];


export const list = Type.new({
  __type__: __list__,

  // (list ...)
  new(...a: unknown[]): list {
    return a;
  },

  // (list? a ...)
  query(a: unknown, ..._: unknown[]): a is list {
    if (_.length > 0) throw new TypeError("[list?] Expected zero or one argument(s)");
    return Array.isArray(a)
  },

  // a:list
  assert(a: unknown): list {
    if (!list.query(a)) throw new TypeError(`[:list] Expected list, got ${a}`);
    return a;
  },

  __get__(a: list, i: any, v: unknown = null) {
    if (!num.query(i)) throw new TypeError(`[list.__get__] Expected num, got ${i}`);
    return a[i] ?? v;
  },

  __put__(a: list, v: unknown, i: any = a.length) {
    if (!num.query(i)) throw new TypeError(`[list.__put__] Expected num, got ${i}`);
    a[i] = v;
    return a;
  },

  __del__(a: list, i: any) {
    if (!num.query(i)) throw new TypeError(`[list.__del__] Expected num, got ${i}`);
    a.splice(i, 1);
    return a;
  },

  __len__(a: list): num {
    return a.length;
  },

  __str__(a: list): str {
    return `[${a.map(v => str.new(v)).join(",")}]`;
  },
})
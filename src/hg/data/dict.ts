import { __dict__ } from "./type";
import { Type } from ".";
import { list } from "./list";
import { nil } from "./nil";
import type { num } from "./num";
import { str } from "./str";

export type dict<T extends {} = {}> = T & Record<str, unknown>;

export const dict = Type.new({
  __type__: __dict__,

  // (dict ...)
  new(...a: unknown[]) {
    let dict = {} as dict

    for (let i = 0; i < a.length; i += 2) {
      const k = str.new(list.__get__!(a, i + 0));
      const v =         list.__get__!(a, i + 1) ;
      if (k === "__type__") throw new TypeError("[dic] Reserved key __type__");

      dict[k] = v;
    }

    return dict;
  },

  // (dict? a ...)
  query(a: unknown, ..._: unknown[]): a is dict {
    if (_.length > 0) throw new TypeError("[dict?] Expected zero or one argument(s)");
    return typeof a === "object" && !nil.query(a) && !list.query(a) && !("__type__" in a);
  },

  // a:dict
  assert(a: unknown): dict {
    if (!dict.query(a)) throw new TypeError(`[:dict] Expected dict, got ${a}`);
    return a;
  },

  __get__(a: dict, k: unknown, v: unknown = null) {
    if (!str.query(k)) throw new TypeError(`[dict.__get__] Expected str, got ${k}`);
    return a[k] ?? v;
  },

  __put__(a: dict, v: unknown, k: unknown) {
    if (!str.query(k)) throw new TypeError(`[dict.__put__] Expected str, got ${k}`);
    a[k] = v;
    return a;
  },

  __del__(a: dict, k: unknown) {
    if (!str.query(k)) throw new TypeError(`[dict.__del__] Expected str, got ${k}`);
    delete a[k];
    return a;
  },

  __len__(a: dict): num {
    return Object.keys(a).length;
  },

  __str__(a: dict): str {
    return `{${Object.entries(a).map(([k, v]) => `${str.new(k)}:${str.new(v)}`).join(",")}}`;
  },
})
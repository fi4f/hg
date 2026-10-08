import { list, str } from "./index";

export type dict<T = {}> = T & Record<string, unknown>;

export const dict = {
  // (dict a ...)
  new(a: unknown = null): dict {
    if (a === null) return Object.create(null);
    else if (dict.maybe(a)) return a
    else if (list.maybe(a))  {
      let dict = Object.create(null);

      for (let i = 0; i < a.length; i += 2) {
        const key = str.new(a[i + 0]);
        const val = a[i + 1] ?? null;
        dict[key] = val;
      }

      return dict;
    }

    throw new TypeError(`[dict.new] Cannot coerce ${a} to dict`);
  },

  // (dict? a)
  maybe(a: unknown): a is dict {
    return typeof a === "object" && a !== null && (a as any).__type__ === undefined;
  },

  // a:dict
  assert(a: unknown): dict {
    if (!dict.maybe(a)) throw new TypeError(`[dict.assert] Expected dict, got ${a}`);
    return a;
  },

  get(a: dict, k: str, v: unknown = null) {
    return a[k] ?? v;
  },

  put(a: dict, k: str, v: unknown) {
    a[k] = v;
  },

  del(a: dict, k: str) {
    delete a[k];
  }
}
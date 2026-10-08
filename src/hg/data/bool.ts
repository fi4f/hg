import { __type__, dict, list, num, str } from "./index";

export type bool = boolean

export const bool = {
  // (bool a)
  new(...a: unknown[]): bool {

    if (a.length === 0) return false;
    else if (a.length === 1) 
    try {
      return typeof a === "boolean"
        ?         a  as bool
        : Boolean(a) as bool;
    } catch (e) {
      throw new TypeError(`[bool.new] Cannot coerce ${a} to bool`);
    }
  },

  // (bool? a)
  maybe(a: unknown = null): a is bool {
    return typeof a === "boolean";
  },

  // a:bool
  assert(a: unknown = null): bool {
    if (!bool.maybe(a)) throw new TypeError(`[bool.assert] Expected bool, got ${a}`);
    return a;
  },

  coerce(a: unknown = null): bool {
    if
    if (bool.maybe(a)) return a;
    else if (num .maybe(a)) return a !==  0;
    else if (str .maybe(a)) return a !== "";
    else if (list.maybe(a)) return a.length > 0;
    else if (dict.maybe(a)) return Object.keys(a).length > 0;
    else throw new TypeError(`[bool.coerce] Cannot coerce ${a} to bool`);
  },
}
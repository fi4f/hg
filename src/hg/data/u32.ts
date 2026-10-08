import { __type__ } from "./index";

export const __u32__ = "__u32__";

export type __u32__ = typeof __u32__;

export type u32 = number & { [__type__]: __u32__ };

export const u32 = {
  __min__:           0,
  __max__:  4294967295,

  // (u32 a)
  new(a: unknown = 0): u32 {    
    try {
      return typeof a === "number"
        ? Math.min(Math.max(       a , u32.__min__), u32.__max__) as u32
        : Math.min(Math.max(Number(a), u32.__min__), u32.__max__) as u32
    } catch (e) {
      throw new TypeError(`[u32.new] Cannot coerce ${a} to u32`);
    }
  },

  // (u32? a)
  maybe(a: unknown): a is u32 {
    return typeof a === "number" && a % 1 === 0 && a >= u32.__min__ && a <= u32.__max__;
  },

  // a:u32
  assert(a: unknown): u32 {
    if (!u32.maybe(a)) throw new TypeError(`[u32.assert] Expected u32, got ${a}`);
    return a;
  }
}
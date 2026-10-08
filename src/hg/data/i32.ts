import { __type__ } from "./index";

export const __i32__ = "__i32__";

export type __i32__ = typeof __i32__;

export type i32 = number & { [__type__]: __i32__ };

export const i32 = {
  __min__: -2147483648,
  __max__:  2147483647,

  // (i32 a)
  new(a: unknown = 0): i32 {
    try {
      return typeof a === "number"
        ? Math.min(Math.max(       a , i32.__min__), i32.__max__) as i32
        : Math.min(Math.max(Number(a), i32.__min__), i32.__max__) as i32
    } catch (e) {
      throw new TypeError(`[i32.new] Cannot coerce ${a} to i32`);
    }
  },

  // (i32? a)
  maybe(a: unknown): a is i32 {
    return typeof a === "number" && a % 1 === 0 && a >= i32.__min__ && a <= i32.__max__;
  },

  // a:i32
  assert(a: unknown): i32 {
    if (!i32.maybe(a)) throw new TypeError(`[i32.assert] Expected i32, got ${a}`);
    return a;
  }
}
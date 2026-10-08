import { __type__ } from "./index";

export const __f32__ = "__f32__";

export type __f32__ = typeof __f32__;

export type f32 = number & { [__type__]: __f32__ };

export const f32 = {
  __min__: -3.4028235e38,
  __max__:  3.4028235e38,

  // (f32 a)
  new(a: unknown = 0): f32 {
    try {
      return typeof a === "number"
        ? Math.min(Math.max(       a , f32.__min__), f32.__max__) as f32
        : Math.min(Math.max(Number(a), f32.__min__), f32.__max__) as f32
    } catch (e) {
      throw new TypeError(`[f32.new] Cannot coerce ${a} to f32`);
    }
  },

  // (f32? a)
  maybe(a: unknown): a is f32 {
    return typeof a === "number" && a >= f32.__min__ && a <= f32.__max__;
  },

  // a:f32
  assert(a: unknown): f32 {
    if (!f32.maybe(a)) throw new TypeError(`[f32.assert] Expected f32, got ${a}`);
    return a;
  }
}
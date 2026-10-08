import { __type__ } from "./index";

export type nil = null

export const nil = {
  // (nil a)
  new(): nil {
    return null;
  },

  // (nil? a)
  maybe(a: unknown): a is nil {
    return a === null;
  },

  // a:nil
  assert(a: unknown): nil {
    if (!nil.maybe(a)) throw new TypeError(`[nil.assert] Expected nil, got ${a}`);
    return a;
  }
}
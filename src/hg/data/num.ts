import { __type__ } from "./index";

export type num = number

export const num = {
  // (num a)
  new(a: unknown = 0): num {
    try {
      return  typeof a === "number"
        ?        a  as num
        : Number(a) as num;
    } catch (e) {
      throw new TypeError(`[num.new] Cannot coerce ${a} to num`);
    }
  },

  // (num? a)
  maybe(a: unknown): a is num {
    return typeof a === "number";
  },

  // a:num
  assert(a: unknown): num {
    if (!num.maybe(a)) throw new TypeError(`[num.assert] Expected num, got ${a}`);
    return a;
  }
}
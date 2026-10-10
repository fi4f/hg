import { __i32__ } from "./type";
import { Type } from ".";
import type { __kind__ } from ".";
import { num } from "./num";


export type i32 = number & { [__kind__]: __i32__ };

const __min__ = -2147483648;
const __max__ =  2147483647;

export const i32 = Type.new({
  __type__: __i32__,

  // (i32 ...)
  new(a: unknown = null, ..._: unknown[]): i32 {
    if (_.length > 0) throw new TypeError("[i32] Expected zero or one argument(s)");
    return Math.min(Math.max(Math.trunc(num.new(a)), __min__), __max__) as i32;
  },

  // (i32? a ...)
  query(a: unknown, ..._: unknown[]): a is i32 {
    if (_.length > 0) throw new TypeError("[i32?] Expected zero or one argument(s)");
    return num.query(a) && a % 1 === 0 && a >= __min__ && a <= __max__;
  },

  // a:i32
  assert(a: unknown = null): i32 {
    if (!i32.query(a)) throw new TypeError(`[:i32] Expected i32, got ${a}`);
    return a;
  },
})

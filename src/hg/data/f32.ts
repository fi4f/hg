import { __f32__ } from "./type";
import { Type } from ".";
import type { __kind__ } from ".";
import { nil } from "./nil";
import { num } from "./num";

export type f32 = number & { [__kind__]: __f32__ };

const __min__ = -3.4028235e38;
const __max__ =  3.4028235e38;

export const f32 = Type.new({
  __type__: __f32__,

  // (f32 ...)
  new(a: unknown = nil, ..._: unknown[]): f32 {
    if (_.length > 0) throw new TypeError("[f32] Expected zero or one argument(s)");
    return Math.min(Math.max(num.new(a), __min__), __max__) as f32;
  },

  // (f32? a ...)
  query (a: unknown, ..._: unknown[]): a is f32 {
    if (_.length > 0) throw new TypeError("[f32?] Expected zero or one argument(s)");
    return num.query(a) && a >= __min__ && a <= __max__;
  },

  // a:f32
  assert(a: unknown): f32 {
    if (!f32.query(a)) throw new TypeError(`[:f32] Expected f32, got ${a}`);
    return a;
  },
})

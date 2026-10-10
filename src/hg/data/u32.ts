import { __u32__ } from "./type";
import { Type } from ".";
import type { __kind__ } from ".";
import { num } from "./num";


export type u32 = number & { [__kind__]: __u32__ };

const __min__ =           0;
const __max__ =  4294967295;

export const u32 = Type.new({
  __type__: __u32__,

  // (u32 ...)
  new(a: unknown = null, ..._: unknown[]): u32 {
    if (_.length > 0) throw new TypeError("[u32] Expected zero or one argument(s)");
    return Math.min(Math.max(Math.trunc(num.new(a)), __min__), __max__) as u32;
  },

  // (u32? a ...)
  query(a: unknown, ..._: unknown[]): a is u32 {
    if (_.length > 0) throw new TypeError("[u32?] Expected zero or one argument(s)");
    return num.query(a) && a % 1 === 0 && a >= __min__ && a <= __max__;
  },

  // a:u32 
  assert(a: unknown = null): u32 {
    if (!u32.query(a)) throw new TypeError(`[:u32] Expected u32, got ${a}`);
    return a;
  },
})

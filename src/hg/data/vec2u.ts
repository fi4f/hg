import { __type__, Type, __vec2u__ } from "./type";
import { u32 } from "./u32";
import { list } from "./list";
import { __flat__ } from "./vec";

export type vec2u = {
  __type__: __vec2u__;
  x: u32;
  y: u32;
}

export const vec2u = Type.new({
  __type__: __vec2u__,

  // (vec2u ...)
  new(... a: unknown[]): vec2u {
    const _ = __flat__(a, u32.new, "vec2u");
    const x = u32.new(list.__get__!(_, 0));
    const y = u32.new(list.__get__!(_, 1));
    return { __type__: __vec2u__, x, y };
  },

  // (vec2u? a ...)
  query(a: unknown, ..._: unknown[]): a is vec2u {
    if (_.length > 0) throw new TypeError("[vec2u?] Expected zero or one argument(s)");
    return __type__(a) === __vec2u__;
  },

  // a:vec2u
  assert(a: unknown): vec2u {
    if (!vec2u.query(a)) throw new TypeError(`[:vec2u] Expected vec2u, got ${a}`);
    return a;
  },
})

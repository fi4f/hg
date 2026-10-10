import { __type__, Type, __vec4u__ } from "./type";
import { u32 } from "./u32";
import { list } from "./list";
import { __flat__ } from "./vec";

export type vec4u = {
  __type__: __vec4u__;
  x: u32;
  y: u32;
  z: u32;
  w: u32;
}

export const vec4u = Type.new({
  __type__: __vec4u__,

  // (vec4u ...)
  new(... a: unknown[]): vec4u {
    const _ = __flat__(a, u32.new, "vec4u");
    const x = u32.new(list.__get__!(_, 0));
    const y = u32.new(list.__get__!(_, 1));
    const z = u32.new(list.__get__!(_, 2));
    const w = u32.new(list.__get__!(_, 3));
    return { __type__: __vec4u__, x, y, z, w };
  },

  // (vec4u? a ...)
  query(a: unknown, ..._: unknown[]): a is vec4u {
    if (_.length > 0) throw new TypeError("[vec4u?] Expected zero or one argument(s)");
    return __type__(a) === __vec4u__;
  },

  // a:vec4u
  assert(a: unknown): vec4u {
    if (!vec4u.query(a)) throw new TypeError(`[:vec4u] Expected vec4u, got ${a}`);
    return a;
  },
})

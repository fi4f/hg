import { __type__, Type, __vec4i__ } from "./type";
import { i32 } from "./i32";
import { list } from "./list";
import { __flat__ } from "./vec";

export type vec4i = {
  __type__: __vec4i__;
  x: i32;
  y: i32;
  z: i32;
  w: i32;
}

export const vec4i = Type.new({
  __type__: __vec4i__,

  // (vec4i ...)
  new(... a: unknown[]): vec4i {
    const _ = __flat__(a, i32.new, "vec4i");
    const x = i32.new(list.__get__!(_, 0));
    const y = i32.new(list.__get__!(_, 1));
    const z = i32.new(list.__get__!(_, 2));
    const w = i32.new(list.__get__!(_, 3));
    return { __type__: __vec4i__, x, y, z, w };
  },

  // (vec4i? a ...)
  query(a: unknown, ..._: unknown[]): a is vec4i {
    if (_.length > 0) throw new TypeError("[vec4i?] Expected zero or one argument(s)");
    return __type__(a) === __vec4i__;
  },

  // a:vec4i
  assert(a: unknown): vec4i {
    if (!vec4i.query(a)) throw new TypeError(`[:vec4i] Expected vec4i, got ${a}`);
    return a;
  },
})

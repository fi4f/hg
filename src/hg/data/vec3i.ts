import { __type__, Type, __vec3i__ } from "./type";
import { i32 } from "./i32";
import { list } from "./list";
import { __flat__ } from "./vec";

export type vec3i = {
  __type__: __vec3i__;
  x: i32;
  y: i32;
  z: i32;
}

export const vec3i = Type.new({
  __type__: __vec3i__,

  // (vec3i ...)
  new(... a: unknown[]): vec3i {
    const _ = __flat__(a, i32.new, "vec3i");
    const x = i32.new(list.__get__!(_, 0));
    const y = i32.new(list.__get__!(_, 1));
    const z = i32.new(list.__get__!(_, 2));
    return { __type__: __vec3i__, x, y, z };
  },

  // (vec3i? a ...)
  query(a: unknown, ..._: unknown[]): a is vec3i {
    if (_.length > 0) throw new TypeError("[vec3i?] Expected zero or one argument(s)");
    return __type__(a) === __vec3i__;
  },

  // a:vec3i
  assert(a: unknown): vec3i {
    if (!vec3i.query(a)) throw new TypeError(`[:vec3i] Expected vec3i, got ${a}`);
    return a;
  },
})

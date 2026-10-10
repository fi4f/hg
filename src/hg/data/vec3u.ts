import { __type__, Type, __vec3u__ } from "./type";
import { u32 } from "./u32";
import { list } from "./list";
import { __flat__ } from "./vec";

export type vec3u = {
  __type__: __vec3u__;
  x: u32;
  y: u32;
  z: u32;
}

export const vec3u = Type.new({
  __type__: __vec3u__,

  // (vec3u ...)
  new(... a: unknown[]): vec3u {
    const _ = __flat__(a, u32.new, "vec3u");
    const x = u32.new(list.__get__!(_, 0));
    const y = u32.new(list.__get__!(_, 1));
    const z = u32.new(list.__get__!(_, 2));
    return { __type__: __vec3u__, x, y, z };
  },

  // (vec3u? a ...)
  query(a: unknown, ..._: unknown[]): a is vec3u {
    if (_.length > 0) throw new TypeError("[vec3u?] Expected zero or one argument(s)");
    return __type__(a) === __vec3u__;
  },

  // a:vec3u
  assert(a: unknown): vec3u {
    if (!vec3u.query(a)) throw new TypeError(`[:vec3u] Expected vec3u, got ${a}`);
    return a;
  },
})

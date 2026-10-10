import { __type__, Type, __vec3f__ } from "./type";
import { f32 } from "./f32";
import { list } from "./list";
import { __flat__ } from "./vec";

export type vec3f = {
  __type__: __vec3f__;
  x: f32;
  y: f32;
  z: f32;
}

export const vec3f = Type.new({
  __type__: __vec3f__,

  // (vec3f ...)
  new(... a: unknown[]): vec3f {
    const _ = __flat__(a, f32.new, "vec3f");
    const x = f32.new(list.__get__!(_, 0));
    const y = f32.new(list.__get__!(_, 1));
    const z = f32.new(list.__get__!(_, 2));
    return { __type__: __vec3f__, x, y, z };
  },

  // (vec3f? a ...)
  query(a: unknown, ..._: unknown[]): a is vec3f {
    if (_.length > 0) throw new TypeError("[vec3f?] Expected zero or one argument(s)");
    return __type__(a) === __vec3f__;
  },

  // a:vec3f
  assert(a: unknown): vec3f {
    if (!vec3f.query(a)) throw new TypeError(`[:vec3f] Expected vec3f, got ${a}`);
    return a;
  },
})

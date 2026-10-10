import { __type__, Type, __vec4f__ } from "./type";
import { f32 } from "./f32";
import { list } from "./list";
import { __flat__ } from "./vec";

export type vec4f = {
  __type__: __vec4f__;
  x: f32;
  y: f32;
  z: f32;
  w: f32;
}

export const vec4f = Type.new({
  __type__: __vec4f__,

  // (vec4f ...)
  new(... a: unknown[]): vec4f {
    const _ = __flat__(a, f32.new, "vec4f");
    const x = f32.new(list.__get__!(_, 0));
    const y = f32.new(list.__get__!(_, 1));
    const z = f32.new(list.__get__!(_, 2));
    const w = f32.new(list.__get__!(_, 3));
    return { __type__: __vec4f__, x, y, z, w };
  },

  // (vec4f? a ...)
  query(a: unknown, ..._: unknown[]): a is vec4f {
    if (_.length > 0) throw new TypeError("[vec4f?] Expected zero or one argument(s)");
    return __type__(a) === __vec4f__;
  },

  // a:vec4f
  assert(a: unknown): vec4f {
    if (!vec4f.query(a)) throw new TypeError(`[:vec4f] Expected vec4f, got ${a}`);
    return a;
  },
})

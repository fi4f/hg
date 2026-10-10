import { __type__, Type, __vec2f__ } from "./type";
import { f32 } from "./f32";
import { list } from "./list";
import { __flat__ } from "./vec";

export type vec2f = {
  __type__: __vec2f__;
  x: f32;
  y: f32;
}

export const vec2f = Type.new({
  __type__: __vec2f__,

  // (vec2f ...)
  new(... a: unknown[]): vec2f {
    const _ = __flat__(a, f32.new, "vec2f");
    const x = f32.new(list.__get__!(_, 0));
    const y = f32.new(list.__get__!(_, 1));
    return { __type__: __vec2f__, x, y };
  },

  // (vec2f? a ...)
  query(a: unknown, ..._: unknown[]): a is vec2f {
    if (_.length > 0) throw new TypeError("[vec2f?] Expected zero or one argument(s)");
    return __type__(a) === __vec2f__;
  },

  // a:vec2f
  assert(a: unknown): vec2f {
    if (!vec2f.query(a)) throw new TypeError(`[:vec2f] Expected vec2f, got ${a}`);
    return a;
  },
})

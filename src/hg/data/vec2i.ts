import { __type__, Type, __vec2i__ } from "./type";
import { i32 } from "./i32";
import { list } from "./list";
import { __flat__ } from "./vec";

export type vec2i = {
  __type__: __vec2i__;
  x: i32;
  y: i32;
}

export const vec2i = Type.new({
  __type__: __vec2i__,

  // (vec2i ...)
  new(... a: unknown[]): vec2i {
    const _ = __flat__(a, i32.new, "vec2i");
    const x = i32.new(list.__get__!(_, 0));
    const y = i32.new(list.__get__!(_, 1));
    return { __type__: __vec2i__, x, y };
  },

  // (vec2i? a ...)
  query(a: unknown, ..._: unknown[]): a is vec2i {
    if (_.length > 0) throw new TypeError("[vec2i?] Expected zero or one argument(s)");
    return __type__(a) === __vec2i__;
  },

  // a:vec2i
  assert(a: unknown): vec2i {
    if (!vec2i.query(a)) throw new TypeError(`[:vec2i] Expected vec2i, got ${a}`);
    return a;
  },
})

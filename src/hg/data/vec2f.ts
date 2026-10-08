import { list } from "./list";
import { num } from "./num";

export const __vec2f__ = "__vec2f__";

export type __vec2f__ = typeof __vec2f__;

export type vec2f = {
  __type__: __vec2f__
  x: num
  y: num
}

export const vec2f = {
  // (vec2f a)
  new(a: unknown = null): vec2f {
    if (a === null) return { __type__: __vec2f__, x: 0, y: 0 };
    else if (  num.maybe(a)) return { __type__: __vec2f__, x: a, y: a };
    else if (vec2f.maybe(a)) return { __type__: __vec2f__, x: a.x, y: a.y };
    else if (vec3f.maybe(a)) return { __type__: __vec2f__, x: a.x, y: a.y };
    else if (vec4f.maybe(a)) return { __type__: __vec2f__, x: a.x, y: a.y };
    else if ( list.maybe(a)) {
      const x = num.assert(list.get(a, 0));
      const y = num.assert(list.get(a, 1));
      return { __type__: __vec2f__, x, y };
    }

    throw new TypeError(`[vec2f.new] Cannot coerce ${a} to vec2f`);
  },

  // (vec2f? a)
  maybe(a: unknown = null): a is vec2f {
    return typeof a === "object" && a !== null && (a as any).__type__ === __vec2f__;
  },

  // a:vec2f
  assert(a: unknown): vec2f {
    if (!vec2f.maybe(a)) throw new TypeError(`[vec2f.assert] Expected vec2f, got ${a}`);
    return a;
  }
}
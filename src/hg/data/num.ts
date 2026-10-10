import { __num__ } from "./type";
import { __type__, Type } from ".";
import type { bool } from "./bool";
import { str } from "./str";


export type num = number;

export const num = Type.new({
  __type__: __num__,

  // (num a ...)
  new(a: unknown = null, ..._: unknown[]): num {
    if (_.length > 0) throw new TypeError("[num] Expected zero or one argument(s)");
    const t = Type.which(__type__(a));
    if (!t.__num__) throw new TypeError(`[num] Cannot coerce ${a} to num`);
    const n = t.__num__(a);
    if (!Number.isFinite(n)) throw new TypeError(`[num] Expected finite number, got ${n}`);
    return n;
  },

  // (num? a ...)
  query(a: unknown, ..._: unknown[]): a is num {
    if (_.length > 0) throw new TypeError("[num?] Expected zero or one argument(s)");
    return typeof a === "number" && Number.isFinite(a);
  },

  // a:num
  assert(a: unknown): num {
    if (!num.query(a)) throw new TypeError(`[:num] Expected num, got ${a}`);
    return a;
  },

  __str__(a: num): str {
    return `${a}`;
  },

  __num__(a: num): num {
    return a;
  },
  
  __bool__(a: num): bool {
    return a !== 0;
  },

  __json__(a: num): string {
    return `${num.assert(a)}`;
  },
})

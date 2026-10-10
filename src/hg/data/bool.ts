import { __bool__ } from "./type";
import { __type__, Type } from ".";
import type { num } from "./num";
import type { str } from "./str";

export type bool = boolean;


export const bool = Type.new({
  __type__: __bool__,

  new(a: unknown = null, ..._: unknown[]): bool {
    if (_.length > 0) throw new TypeError("[bool] Expected zero or one argument(s)");
    const t = Type.which(__type__(a));
    if (!t.__bool__) throw new TypeError(`[bool] Cannot coerce ${a} to bool`);
    return t.__bool__(a);
  },

  query (a: unknown = null, ..._: unknown[]): a is bool {
    if (_.length > 0) throw new TypeError("[bool?] Expected zero or one argument(s)");
    return typeof a === "boolean"
  },

  assert(a: unknown = null): bool {
    if (!bool.query(a)) throw new TypeError(`[:bool] Expected bool, got ${a}`);
    return a;
  },

  __str__(a: bool): str {
    return `${a}`;
  },

  __num__(a: bool): num {
    return a ? 1 : 0;
  },

  __bool__(a: bool): bool {
    return a;
  },

  __json__(a: bool): string {
    return `${a}`;
  },
})
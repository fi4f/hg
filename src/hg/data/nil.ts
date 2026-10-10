import { __nil__ } from "./type";
import { Type } from ".";
import type { bool } from "./bool";
import type { num } from "./num";
import type { str } from "./str";

export type nil = null

export const nil = Type.new({
  __type__: __nil__,

  new(..._: unknown[]): nil {
    if (_.length > 1) throw new TypeError("[nil] Expected zero or one argument(s)");
    return null
  },

  query(a: unknown = nil, ..._: unknown[]): a is nil {
    if (_.length > 0) throw new TypeError("[nil?] Expected zero or one argument(s)");
    return a === null
  },

  assert(a: unknown = null): nil {
    if (!nil.query(a)) throw new TypeError(`[:nil] Expected nil, got ${a}`);
    return a;
  },

  __str__(_: nil): str {
    return "nil";
  },

  __num__(_: nil): num {
    return 0;
  },

  __bool__(_: nil): bool {
    return false;
  },

  __json__(_: nil): string {
    return "null";
  },
})
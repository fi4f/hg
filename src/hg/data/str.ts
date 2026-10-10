import { __str__ } from "./type";
import { __type__, Type } from ".";
import type { bool } from "./bool";
import { num } from "./num";
import { i32 } from "./i32";
import { u32 } from "./u32";
import { f32 } from "./f32";

export type str = string;


export const str = Type.new({
  __type__: __str__,

  // (str a ...)
  new(a: unknown = "", ..._: unknown[]): str {
    if (_.length > 0) throw new TypeError("[str] Expected zero or one argument(s)");
    const t = Type.which(__type__(a));
    if (!t.__str__) throw new TypeError(`[str] Cannot coerce ${a} to str`);
    return t.__str__(a);
  },

  // (str? a ...)
  query(a: unknown, ..._: unknown[]): a is str {
    if (_.length > 0) throw new TypeError("[str?] Expected zero or one argument(s)");
    return typeof a === "string"
  },
  
  // a:str
  assert(a: unknown): str {
    if (!str.query(a)) throw new TypeError(`[:str] Expected str, got ${a}`);
    return a;
  },

  __str__(a: str): str {
    return a;
  },

  __num__(a: str): num {
    const parts = a.split(":");
    const n     = parts[0]?.trim() ?? "";
    const t     = parts[1]?.trim() ?? "";
    switch (t) {
      case "i": return i32.new(Number(n));
      case "f": return f32.new(Number(n));
      case "u": return u32.new(Number(n));
      case "" : return num.new(Number(n));
      default : throw new SyntaxError(`[num] Cannot coerce ${a} to num`);
    }
  },

  __bool__(a: str): bool {
    return a !== "";
  },

  __json__(a: str): string {
    return `"${a}"`;
  },
})

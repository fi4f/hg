import type { bool } from "./bool";
import type { num } from "./num";
import type { str } from "./str";

export declare const __kind__: unique symbol;

export const __nil__ = "__nil__";
export type __nil__ = typeof __nil__;

export const __str__ = "__str__";
export type __str__ = typeof __str__;

export const __num__ = "__num__";
export type __num__ = typeof __num__;

export const __bool__ = "__bool__";
export type __bool__ = typeof __bool__;

export const __list__ = "__list__";
export type __list__ = typeof __list__;

export const __dict__ = "__dict__";
export type __dict__ = typeof __dict__;

export const __i32__ = "__i32__";
export type __i32__ = typeof __i32__;

export const __u32__ = "__u32__";
export type __u32__ = typeof __u32__;

export const __f32__ = "__f32__";
export type __f32__ = typeof __f32__;

export const __ref__ = "__ref__";
export type __ref__ = typeof __ref__;

export const __vec2f__ = "__vec2f__";
export type __vec2f__ = typeof __vec2f__;

export const __vec3f__ = "__vec3f__";
export type __vec3f__ = typeof __vec3f__;

export const __vec4f__ = "__vec4f__";
export type __vec4f__ = typeof __vec4f__;

export const __vec2i__ = "__vec2i__";
export type __vec2i__ = typeof __vec2i__;

export const __vec3i__ = "__vec3i__";
export type __vec3i__ = typeof __vec3i__;

export const __vec4i__ = "__vec4i__";
export type __vec4i__ = typeof __vec4i__;

export const __vec2u__ = "__vec2u__";
export type __vec2u__ = typeof __vec2u__;

export const __vec3u__ = "__vec3u__";
export type __vec3u__ = typeof __vec3u__;

export const __vec4u__ = "__vec4u__";
export type __vec4u__ = typeof __vec4u__;

export const __types__ = [
  __nil__, __str__, __num__, __bool__, __list__, __dict__,
  __i32__, __u32__, __f32__, __ref__,
  __vec2f__, __vec3f__, __vec4f__,
  __vec2i__, __vec3i__, __vec4i__,
  __vec2u__, __vec3u__, __vec4u__,
] as const;

export type __type__ = typeof __types__[number];

// (type a ...)
export function __type__(a: unknown = null, ..._: unknown[]): __type__ {
  if (_.length > 0) throw new TypeError("[type] Expected zero or one argument");
  switch (typeof a) {
    case "undefined": return __nil__;
    case "boolean"  : return __bool__;
    case "string"   : return __str__;
    case "number"   : return __num__;
    case "object"   :
      if (a === null) return __nil__;
      else if (Array.isArray(a)) return __list__;
      else if (!("__type__" in a)) return __dict__;
      else if (__types__.includes(a.__type__ as __type__)) return a.__type__ as __type__;
  }
  throw new TypeError("[type] Cannot get type of value");
}

export type Type<T, __T__ extends __type__> = {
  __type__: __T__;

  // (type  a ...)
  new   : (a ?: unknown, ..._: unknown[]) =>      T;
  // (type? a ...)
  query : (a ?: unknown, ..._: unknown[]) => a is T;
  // a:type
  assert: (a: unknown                 ) =>      T;

  __str__ ?: (a: T) => str ;
  __num__ ?: (a: T) => num ;
  __bool__?: (a: T) => bool;
  __json__?: (a: T) => string;

  __get__ ?: (a: T, k: unknown, v ?: unknown) => unknown;
  __put__ ?: (a: T, v: unknown, k  : unknown) =>       T;
  __del__ ?: (a: T, k: unknown              ) =>       T;
  __len__ ?: (a: T                          ) =>     num;
}

export const Type = {
  __table__: { } as Record<__type__, Type<any, __type__>>,

  new<T, __T__ extends __type__>(type: Type<T, __T__>) {
    if (Type.__table__[type.__type__] !== undefined) throw new Error(`[Type] Type with descriptor ${type.__type__} already exists`);
    Type.__table__[type.__type__] = type;
    return type;
  },

  which<T, __T__ extends __type__>(__type__: __T__) {
    if (Type.__table__[     __type__] === undefined) throw new Error(`[Type] Type with descriptor ${     __type__} does not exist`);
    return Type.__table__[__type__] as Type<T, __T__>;
  }
}
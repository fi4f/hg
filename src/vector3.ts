import { ADD, SUB, MUL, DIV, MOD } from "./math.js";

export type Vector3 = [number, number, number]

export const X = 0 as const;
export const Y = 1 as const;
export const Z = 2 as const;

export const __get__ = {
  x(a: Vector3) { return a[X] },
  y(a: Vector3) { return a[Y] },
  z(a: Vector3) { return a[Z] },
}

export const __set__ = {
  x(a: Vector3, x: number) { return a[X] = x },
  y(a: Vector3, y: number) { return a[Y] = y },
  z(a: Vector3, z: number) { return a[Z] = z },
}

export function x(a: Vector3, x ?: number) {
  return x === undefined ? __get__.x(a) : __set__.x(a, x)
}

export function y(a: Vector3, y ?: number) {
  return y === undefined ? __get__.y(a) : __set__.y(a, y)
}

export function z(a: Vector3, z ?: number) {
  return z === undefined ? __get__.z(a) : __set__.z(a, z)
}

export const Vector3 = {
  X, Y, Z,
  __get__,
  __set__,
  x, y, z,

  new(...a: Array<number>) {
    if (a.length === 1) return [ a[X]!    , a[X]!    , a[X]!     ] satisfies Vector3
    else                return [ a[X] ?? 0, a[Y] ?? 0, a[Z] ?? 0 ] satisfies Vector3
  },

  from(a: number | Array<number>) {
    if (typeof a === "number") return [ a        , a        , a         ] satisfies Vector3
    else                       return [ a[X] ?? 0, a[Y] ?? 0, a[Z] ?? 0 ] satisfies Vector3
  },

  el(op: (a: number, b: number) => number, a: number | Vector3, b: number | Vector3, out: Vector3 = Vector3.new()) {
    const [ xa, ya, za ] = Vector3.from(a)
    const [ xb, yb, zb ] = Vector3.from(b)
    __set__.x(out, op(xa, xb))
    __set__.y(out, op(ya, yb))
    __set__.z(out, op(za, zb))
    return out
  },

  add(a: number | Vector3, b: number | Vector3, out: Vector3 = Vector3.new()) {
    return Vector3.el(ADD, a, b, out)
  },

  sub(a: number | Vector3, b: number | Vector3, out: Vector3 = Vector3.new()) {
    return Vector3.el(SUB, a, b, out)
  },

  hmul(a: number | Vector3, b: number | Vector3, out: Vector3 = Vector3.new()) {
    return Vector3.el(MUL, a, b, out)
  },

  hdiv(a: number | Vector3, b: number | Vector3, out: Vector3 = Vector3.new()) {
    return Vector3.el(DIV, a, b, out)
  },

  hmod(a: number | Vector3, b: number | Vector3, out: Vector3 = Vector3.new()) {
    return Vector3.el(MOD, a, b, out)
  },

  dot(a: number | Vector3, b: number | Vector3 = a) {
    const [xa, ya, za] = Vector3.from(a)
    const [xb, yb, zb] = Vector3.from(b)
    return xa * xb + ya * yb + za * zb
  },

  toString(a: number | Vector3) {
    const [x, y, z] = Vector3.from(a)
    return `vec3<${x}, ${y}, ${z}>`
  }
}
import { ADD, SUB, MUL, DIV, MOD } from "./math.js";

export type Vector2 = [number, number]

export const X = 0 as const;
export const Y = 1 as const;

export const __get__ = {
  x(a: Vector2) { return a[X] },
  y(a: Vector2) { return a[Y] },
}

export const __set__ = {
  x(a: Vector2, x: number) { return a[X] = x },
  y(a: Vector2, y: number) { return a[Y] = y },
}

export function x(a: Vector2, x ?: number) {
  return x === undefined ? __get__.x(a) : __set__.x(a, x)
}

export function y(a: Vector2, y ?: number) {
  return y === undefined ? __get__.y(a) : __set__.y(a, y)
}

export const Vector2 = {
  X, Y,
  __get__,
  __set__,
  x, y,

  new(...a: Array<number>) {
    if (a.length === 1) return [ a[X]!    , a[X]!     ] satisfies Vector2
    else                return [ a[X] ?? 0, a[Y] ?? 0 ] satisfies Vector2
  },

  from(a: number | Array<number>) {
    if (typeof a === "number") return [ a        , a         ] satisfies Vector2
    else                       return [ a[X] ?? 0, a[Y] ?? 0 ] satisfies Vector2
  },

  el(op: (a: number, b: number) => number, a: number | Vector2, b: number | Vector2, out: Vector2 = Vector2.new()) {
    const [ xa, ya ] = Vector2.from(a)
    const [ xb, yb ] = Vector2.from(b)
    __set__.x(out, op(xa, xb))
    __set__.y(out, op(ya, yb))
    return out
  },

  add(a: number | Vector2, b: number | Vector2, out: Vector2 = Vector2.new()) {
    return Vector2.el(ADD, a, b, out)
  },

  sub(a: number | Vector2, b: number | Vector2, out: Vector2 = Vector2.new()) {
    return Vector2.el(SUB, a, b, out)
  },

  hmul(a: number | Vector2, b: number | Vector2, out: Vector2 = Vector2.new()) {
    return Vector2.el(MUL, a, b, out)
  },

  hdiv(a: number | Vector2, b: number | Vector2, out: Vector2 = Vector2.new()) {
    return Vector2.el(DIV, a, b, out)
  },

  hmod(a: number | Vector2, b: number | Vector2, out: Vector2 = Vector2.new()) {
    return Vector2.el(MOD, a, b, out)
  },

  dot(a: number | Vector2, b: number | Vector2 = a) {
    const [xa, ya] = Vector2.from(a)
    const [xb, yb] = Vector2.from(b)
    return xa * xb + ya * yb
  },

  toString(a: number | Vector2) {
    const [x, y] = Vector2.from(a)
    return `vec2<${x}, ${y}>`
  }
}
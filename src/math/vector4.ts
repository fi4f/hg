import { add, sub, mul, div, mod } from "./el.js";

export type Vector4 = [number, number, number, number]

const X = 0 as const;
const Y = 1 as const;
const Z = 2 as const;
const W = 3 as const;

const __get__ = {
  x(a: Vector4) { return a[X] },
  y(a: Vector4) { return a[Y] },
  z(a: Vector4) { return a[Z] },
  w(a: Vector4) { return a[W] },
}

const __set__ = {
  x(a: Vector4, x: number) { return a[X] = x },
  y(a: Vector4, y: number) { return a[Y] = y },
  z(a: Vector4, z: number) { return a[Z] = z },
  w(a: Vector4, w: number) { return a[W] = w },
}

function x(a: Vector4, x ?: number) {
  return x === undefined ? __get__.x(a) : __set__.x(a, x)
}

function y(a: Vector4, y ?: number) {
  return y === undefined ? __get__.y(a) : __set__.y(a, y)
}

function z(a: Vector4, z ?: number) {
  return z === undefined ? __get__.z(a) : __set__.z(a, z)
}

function w(a: Vector4, w ?: number) {
  return w === undefined ? __get__.w(a) : __set__.w(a, w)
}

export const Vector4 = {
  X, Y, Z, W,
  __get__,
  __set__,
  x, y, z, w,

  new(...a: Array<number>) {
    if (a.length === 1) return [ a[X]!    , a[X]!    , a[X]!    , a[X]!     ] satisfies Vector4
    else                return [ a[X] ?? 0, a[Y] ?? 0, a[Z] ?? 0, a[W] ?? 0 ] satisfies Vector4
  },

  from(a: number | Array<number>) {
    if (typeof a === "number") return [ a        , a        , a        , a         ] satisfies Vector4
    else                       return [ a[X] ?? 0, a[Y] ?? 0, a[Z] ?? 0, a[W] ?? 0 ] satisfies Vector4
  },

  el(op: (a: number, b: number) => number, a: number | Vector4, b: number | Vector4, out: Vector4 = Vector4.new()) {
    const [ xa, ya, za, wa ] = Vector4.from(a)
    const [ xb, yb, zb, wb ] = Vector4.from(b)
    __set__.x(out, op(xa, xb))
    __set__.y(out, op(ya, yb))
    __set__.z(out, op(za, zb))
    __set__.w(out, op(wa, wb))
    return out
  },

  add(a: number | Vector4, b: number | Vector4, out: Vector4 = Vector4.new()) {
    return Vector4.el(add, a, b, out)
  },

  sub(a: number | Vector4, b: number | Vector4, out: Vector4 = Vector4.new()) {
    return Vector4.el(sub, a, b, out)
  },

  hmul(a: number | Vector4, b: number | Vector4, out: Vector4 = Vector4.new()) {
    return Vector4.el(mul, a, b, out)
  },

  hdiv(a: number | Vector4, b: number | Vector4, out: Vector4 = Vector4.new()) {
    return Vector4.el(div, a, b, out)
  },

  hmod(a: number | Vector4, b: number | Vector4, out: Vector4 = Vector4.new()) {
    return Vector4.el(mod, a, b, out)
  },

  dot(a: number | Vector4, b: number | Vector4 = a) {
    const [xa, ya, za, wa] = Vector4.from(a)
    const [xb, yb, zb, wb] = Vector4.from(b)
    return xa * xb + ya * yb + za * zb + wa * wb
  },

  toString(a: number | Vector4) {
    const [x, y, z, w] = Vector4.from(a)
    return `vec4<${x}, ${y}, ${z}, ${w}>`
  }
}
import { Vector2 } from "./vector2.js";
import { ADD, SUB, MUL, DIV, MOD } from "./math.js";

export type Matrix2 = [
  number, number,
  number, number,
]

export const XX = 0 as const;
export const XY = 1 as const;
export const YX = 2 as const;
export const YY = 3 as const;

export const __get__ = {
  xx(a: Matrix2) { return a[XX] },
  xy(a: Matrix2) { return a[XY] },
  yx(a: Matrix2) { return a[YX] },
  yy(a: Matrix2) { return a[YY] },

  r0(a: Matrix2) { return [ a[XX], a[XY] ] satisfies Vector2 },
  r1(a: Matrix2) { return [ a[YX], a[YY] ] satisfies Vector2 },

  c0(a: Matrix2) { return [ a[XX], a[YX] ] satisfies Vector2 },
  c1(a: Matrix2) { return [ a[XY], a[YY] ] satisfies Vector2 },

  row(a: Matrix2, i: 0 | 1) { switch (i) {
    case 0: return __get__.r0(a)
    case 1: return __get__.r1(a)
  }},

  col(a: Matrix2, j: 0 | 1) { switch (j) {
    case 0: return __get__.c0(a)
    case 1: return __get__.c1(a)
  }},
}

export const __set__ = {
  xx(a: Matrix2, xx: number) { return a[XX] = xx },
  xy(a: Matrix2, xy: number) { return a[XY] = xy },
  yx(a: Matrix2, yx: number) { return a[YX] = yx },
  yy(a: Matrix2, yy: number) { return a[YY] = yy },

  r0(a: Matrix2, r0: number | Vector2) {
    const [x, y] = Vector2.from(r0)
    __set__.xx(a, x)
    __set__.xy(a, y)
    return [x, y] satisfies Vector2
  },

  r1(a: Matrix2, r1: number | Vector2) {
    const [x, y] = Vector2.from(r1)
    __set__.yx(a, x)
    __set__.yy(a, y)
    return [x, y] satisfies Vector2
  },

  c0(a: Matrix2, c0: number | Vector2) {
    const [x, y] = Vector2.from(c0)
    __set__.xx(a, x)
    __set__.yx(a, y)
    return [x, y] satisfies Vector2
  },

  c1(a: Matrix2, c1: number | Vector2) {
    const [x, y] = Vector2.from(c1)
    __set__.xy(a, x)
    __set__.yy(a, y)
    return [x, y] satisfies Vector2
  },

  row(a: Matrix2, i: 0 | 1, ri: number | Vector2) {
    switch (i) {
      case 0: return __set__.r0(a, ri)
      case 1: return __set__.r1(a, ri)
    }
  },

  col(a: Matrix2, j: 0 | 1, cj: number | Vector2) {
    switch (j) {
      case 0: return __set__.c0(a, cj)
      case 1: return __set__.c1(a, cj)
    }
  },
}

export function xx(a: Matrix2, xx ?: number) {
  return xx === undefined ? __get__.xx(a) : __set__.xx(a, xx)
}

export function xy(a: Matrix2, xy ?: number) {
  return xy === undefined ? __get__.xy(a) : __set__.xy(a, xy)
}

export function yx(a: Matrix2, yx ?: number) {
  return yx === undefined ? __get__.yx(a) : __set__.yx(a, yx)
}

export function yy(a: Matrix2, yy ?: number) {
  return yy === undefined ? __get__.yy(a) : __set__.yy(a, yy)
}

export function r0(a: Matrix2, r0 ?: number | Vector2) {
  return r0 === undefined ? __get__.r0(a) : __set__.r0(a, r0)
}

export function r1(a: Matrix2, r1 ?: number | Vector2) {
  return r1 === undefined ? __get__.r1(a) : __set__.r1(a, r1)
}

export function c0(a: Matrix2, c0 ?: number | Vector2) {
  return c0 === undefined ? __get__.c0(a) : __set__.c0(a, c0)
}

export function c1(a: Matrix2, c1 ?: number | Vector2) {
  return c1 === undefined ? __get__.c1(a) : __set__.c1(a, c1)
}

export function row(a: Matrix2, i: 0 | 1, ri ?: number | Vector2) {
  return ri === undefined ? __get__.row(a, i) : __set__.row(a, i, ri)
}

export function col(a: Matrix2, j: 0 | 1, cj ?: number | Vector2) {
  return cj === undefined ? __get__.col(a, j) : __set__.col(a, j, cj)
}

export const Matrix2 = {
  XX, XY, YX, YY,
  __get__,
  __set__,
  xx, xy, yx, yy,

  id(a: number = 1) {
    return [
      a, 0,
      0, a
    ] satisfies Matrix2
  }, 

  new(...a: Array<number>) {
    if (a.length === 1) return [ 
      a[XX]!, a[XX]!, 
      a[XX]!, a[XX]!
    ] satisfies Matrix2
    else                return [ 
      a[XX] ?? 0, a[XY] ?? 0, 
      a[YX] ?? 0, a[YY] ?? 0 
    ] satisfies Matrix2
  },

  from(a: number | Array<number>) {
    if (typeof a === "number") return [
      a, a,
      a, a
    ] satisfies Matrix2
    else                       return [
      a[XX] ?? 0, a[XY] ?? 0, 
      a[YX] ?? 0, a[YY] ?? 0 
    ] satisfies Matrix2
  },

  el(op: (a: number, b: number) => number, a: number | Matrix2, b: number | Matrix2, out: Matrix2 = Matrix2.new()) {
    const [ xxa, xya, yxa, yya ] = Matrix2.from(a)
    const [ xxb, xyb, yxb, yyb ] = Matrix2.from(b)
    __set__.xx(out, op(xxa, xxb))
    __set__.xy(out, op(xya, xyb))
    __set__.yx(out, op(yxa, yxb))
    __set__.yy(out, op(yya, yyb))
    return out
  },

  add(a: number | Matrix2, b: number | Matrix2, out: Matrix2 = Matrix2.new()) {
    return Matrix2.el(ADD, a, b, out)
  },

  sub(a: number | Matrix2, b: number | Matrix2, out: Matrix2 = Matrix2.new()) {
    return Matrix2.el(SUB, a, b, out)
  },

  hmul(a: number | Matrix2, b: number | Matrix2, out: Matrix2 = Matrix2.new()) {
    return Matrix2.el(MUL, a, b, out)
  },

  hdiv(a: number | Matrix2, b: number | Matrix2, out: Matrix2 = Matrix2.new()) {
    return Matrix2.el(DIV, a, b, out)
  },

  hmod(a: number | Matrix2, b: number | Matrix2, out: Matrix2 = Matrix2.new()) {
    return Matrix2.el(MOD, a, b, out)
  },

  mul(a: number | Matrix2, b: number | Matrix2, out: Matrix2 = Matrix2.new()) {
    const A  = Matrix2.from(a)
    const B  = Matrix2.from(b)
    const r0 = __get__.r0(A)
    const r1 = __get__.r1(A)
    const c0 = __get__.c0(B)
    const c1 = __get__.c1(B)

    __set__.xx(out, Vector2.dot(r0, c0))
    __set__.xy(out, Vector2.dot(r0, c1))
    __set__.yx(out, Vector2.dot(r1, c0))
    __set__.yy(out, Vector2.dot(r1, c1))

    return out
  },


  toString(a: number | Matrix2) {
    const [
      xx, xy,
      yx, yy
    ] = Matrix2.from(a)
    return `mat2<${xx}, ${xy}, ${yx}, ${yy}>`
  }
}
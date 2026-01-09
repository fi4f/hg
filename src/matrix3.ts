import { Vector3 } from "./vector3.js";
import { ADD, SUB, MUL, DIV, MOD } from "./math.js";

export type Matrix3 = [
  number, number, number,
  number, number, number,
  number, number, number
]

export const XX = 0 as const;
export const XY = 1 as const;
export const XZ = 2 as const;
export const YX = 3 as const;
export const YY = 4 as const;
export const YZ = 5 as const;
export const ZX = 6 as const;
export const ZY = 7 as const;
export const ZZ = 8 as const;

export const __get__ = {
  xx(a: Matrix3) { return a[XX] },
  xy(a: Matrix3) { return a[XY] },
  xz(a: Matrix3) { return a[XZ] },
  yx(a: Matrix3) { return a[YX] },
  yy(a: Matrix3) { return a[YY] },
  yz(a: Matrix3) { return a[YZ] },
  zx(a: Matrix3) { return a[ZX] },
  zy(a: Matrix3) { return a[ZY] },
  zz(a: Matrix3) { return a[ZZ] },

  r0(a: Matrix3) { return [ a[XX], a[XY], a[XZ] ] satisfies Vector3 },
  r1(a: Matrix3) { return [ a[YX], a[YY], a[YZ] ] satisfies Vector3 },
  r2(a: Matrix3) { return [ a[ZX], a[ZY], a[ZZ] ] satisfies Vector3 },

  c0(a: Matrix3) { return [ a[XX], a[YX], a[ZX] ] satisfies Vector3 },
  c1(a: Matrix3) { return [ a[XY], a[YY], a[ZY] ] satisfies Vector3 },
  c2(a: Matrix3) { return [ a[XZ], a[YZ], a[ZZ] ] satisfies Vector3 },

  row(a: Matrix3, i: 0 | 1 | 2) { switch (i) {
    case 0: return __get__.r0(a)
    case 1: return __get__.r1(a)
    case 2: return __get__.r2(a)
  }},

  col(a: Matrix3, j: 0 | 1 | 2) { switch (j) {
    case 0: return __get__.c0(a)
    case 1: return __get__.c1(a)
    case 2: return __get__.c2(a)
  }},
}

export const __set__ = {
  xx(a: Matrix3, xx: number) { return a[XX] = xx },
  xy(a: Matrix3, xy: number) { return a[XY] = xy },
  xz(a: Matrix3, xz: number) { return a[XZ] = xz },
  yx(a: Matrix3, yx: number) { return a[YX] = yx },
  yy(a: Matrix3, yy: number) { return a[YY] = yy },
  yz(a: Matrix3, yz: number) { return a[YZ] = yz },
  zx(a: Matrix3, zx: number) { return a[ZX] = zx },
  zy(a: Matrix3, zy: number) { return a[ZY] = zy },
  zz(a: Matrix3, zz: number) { return a[ZZ] = zz },

  r0(a: Matrix3, r0: number | Vector3) {
    const [x, y, z] = Vector3.from(r0)
    __set__.xx(a, x)
    __set__.xy(a, y)
    __set__.xz(a, z)
    return [x, y, z] satisfies Vector3
  },

  r1(a: Matrix3, r1: number | Vector3) {
    const [x, y, z] = Vector3.from(r1)
    __set__.yx(a, x)
    __set__.yy(a, y)
    __set__.yz(a, z)
    return [x, y, z] satisfies Vector3
  },

  r2(a: Matrix3, r2: number | Vector3) {
    const [x, y, z] = Vector3.from(r2)
    __set__.zx(a, x)
    __set__.zy(a, y)
    __set__.zz(a, z)
    return [x, y, z] satisfies Vector3
  },

  c0(a: Matrix3, c0: number | Vector3) {
    const [x, y, z] = Vector3.from(c0)
    __set__.xx(a, x)
    __set__.yx(a, y)
    __set__.zx(a, z)
    return [x, y, z] satisfies Vector3
  },

  c1(a: Matrix3, c1: number | Vector3) {
    const [x, y, z] = Vector3.from(c1)
    __set__.xy(a, x)
    __set__.yy(a, y)
    __set__.zy(a, y)
    return [x, y, z] satisfies Vector3
  },

  c2(a: Matrix3, c2: number | Vector3) {
    const [x, y, z] = Vector3.from(c2)
    __set__.xz(a, x)
    __set__.yz(a, y)
    __set__.zz(a, z)
    return [x, y, z] satisfies Vector3
  },

  row(a: Matrix3, i: 0 | 1 | 2, ri: number | Vector3) {
    switch (i) {
      case 0: return __set__.r0(a, ri)
      case 1: return __set__.r1(a, ri)
      case 2: return __set__.r2(a, ri)
    }
  },

  col(a: Matrix3, j: 0 | 1 | 2, cj: number | Vector3) {
    switch (j) {
      case 0: return __set__.c0(a, cj)
      case 1: return __set__.c1(a, cj)
      case 2: return __set__.c2(a, cj)
    }
  },
}

export function xx(a: Matrix3, xx ?: number) {
  return xx === undefined ? __get__.xx(a) : __set__.xx(a, xx)
}

export function xy(a: Matrix3, xy ?: number) {
  return xy === undefined ? __get__.xy(a) : __set__.xy(a, xy)
}

export function xz(a: Matrix3, xz ?: number) {
  return xz === undefined ? __get__.xz(a) : __set__.xz(a, xz)
}

export function yx(a: Matrix3, yx ?: number) {
  return yx === undefined ? __get__.yx(a) : __set__.yx(a, yx)
}

export function yy(a: Matrix3, yy ?: number) {
  return yy === undefined ? __get__.yy(a) : __set__.yy(a, yy)
}

export function yz(a: Matrix3, yz ?: number) {
  return yz === undefined ? __get__.yz(a) : __set__.yz(a, yz)
}

export function zx(a: Matrix3, zx ?: number) {
  return zx === undefined ? __get__.zx(a) : __set__.zx(a, zx)
}

export function zy(a: Matrix3, zy ?: number) {
  return zy === undefined ? __get__.zy(a) : __set__.zy(a, zy)
}

export function zz(a: Matrix3, zz ?: number) {
  return zz === undefined ? __get__.zz(a) : __set__.zz(a, zz)
}

export function r0(a: Matrix3, r0 ?: number | Vector3) {
  return r0 === undefined ? __get__.r0(a) : __set__.r0(a, r0)
}

export function r1(a: Matrix3, r1 ?: number | Vector3) {
  return r1 === undefined ? __get__.r1(a) : __set__.r1(a, r1)
}

export function r2(a: Matrix3, r2 ?: number | Vector3) {
  return r2 === undefined ? __get__.r2(a) : __set__.r2(a, r2)
}

export function c0(a: Matrix3, c0 ?: number | Vector3) {
  return c0 === undefined ? __get__.c0(a) : __set__.c0(a, c0)
}

export function c1(a: Matrix3, c1 ?: number | Vector3) {
  return c1 === undefined ? __get__.c1(a) : __set__.c1(a, c1)
}

export function c2(a: Matrix3, c2 ?: number | Vector3) {
  return c2 === undefined ? __get__.c2(a) : __set__.c2(a, c2)
}

export function row(a: Matrix3, i: 0 | 1 | 2, ri ?: number | Vector3) {
  return ri === undefined ? __get__.row(a, i) : __set__.row(a, i, ri)
}

export function col(a: Matrix3, j: 0 | 1 | 2, cj ?: number | Vector3) {
  return cj === undefined ? __get__.col(a, j) : __set__.col(a, j, cj)
}

export const Matrix3 = {
  XX, XY, XZ, YX, YY, YZ, ZX, ZY, ZZ,
  __get__,
  __set__,
  xx, xy, xz, yx, yy, yz, zx, zy, zz,

  id(a: number = 1) {
    return [
      a, 0, 0,
      0, a, 0,
      0, 0, a
    ] satisfies Matrix3
  }, 

  new(...a: Array<number>) {
    if (a.length === 1) return [ 
      a[XX]!, a[XX]!, a[XX]!, 
      a[XX]!, a[XX]!, a[XX]!, 
      a[XX]!, a[XX]!, a[XX]!
    ] satisfies Matrix3
    else                return [ 
      a[XX] ?? 0, a[XY] ?? 0, a[XZ] ?? 0, 
      a[YX] ?? 0, a[YY] ?? 0, a[YZ] ?? 0, 
      a[ZX] ?? 0, a[ZY] ?? 0, a[ZZ] ?? 0 
    ] satisfies Matrix3
  },

  from(a: number | Array<number>) {
    if (typeof a === "number") return [
      a, a, a,
      a, a, a,
      a, a, a
    ] satisfies Matrix3
    else                       return [
      a[XX] ?? 0, a[XY] ?? 0, a[XZ] ?? 0, 
      a[YX] ?? 0, a[YY] ?? 0, a[YZ] ?? 0, 
      a[ZX] ?? 0, a[ZY] ?? 0, a[ZZ] ?? 0 
    ] satisfies Matrix3
  },

  el(op: (a: number, b: number) => number, a: number | Matrix3, b: number | Matrix3, out: Matrix3 = Matrix3.new()) {
    const [ xxa, xya, xza, yxa, yya, yza, zxa, zya, zza ] = Matrix3.from(a)
    const [ xxb, xyb, xzb, yxb, yyb, yzb, zxb, zyb, zzb ] = Matrix3.from(b)
    __set__.xx(out, op(xxa, xxb))
    __set__.xy(out, op(xya, xyb))
    __set__.xz(out, op(xza, xzb))
    __set__.yx(out, op(yxa, yxb))
    __set__.yy(out, op(yya, yyb))
    __set__.yz(out, op(yza, yzb))
    __set__.zx(out, op(zxa, zxb))
    __set__.zy(out, op(zya, zyb))
    __set__.zz(out, op(zza, zzb))
    return out
  },

  add(a: number | Matrix3, b: number | Matrix3, out: Matrix3 = Matrix3.new()) {
    return Matrix3.el(ADD, a, b, out)
  },

  sub(a: number | Matrix3, b: number | Matrix3, out: Matrix3 = Matrix3.new()) {
    return Matrix3.el(SUB, a, b, out)
  },

  hmul(a: number | Matrix3, b: number | Matrix3, out: Matrix3 = Matrix3.new()) {
    return Matrix3.el(MUL, a, b, out)
  },

  hdiv(a: number | Matrix3, b: number | Matrix3, out: Matrix3 = Matrix3.new()) {
    return Matrix3.el(DIV, a, b, out)
  },

  hmod(a: number | Matrix3, b: number | Matrix3, out: Matrix3 = Matrix3.new()) {
    return Matrix3.el(MOD, a, b, out)
  },

  mul(a: number | Matrix3, b: number | Matrix3, out: Matrix3 = Matrix3.new()) {
    const A  = Matrix3.from(a)
    const B  = Matrix3.from(b)
    const r0 = __get__.r0(A)
    const r1 = __get__.r1(A)
    const r2 = __get__.r2(A)
    const c0 = __get__.c0(B)
    const c1 = __get__.c1(B)
    const c2 = __get__.c2(B)

    __set__.xx(out, Vector3.dot(r0, c0))
    __set__.xy(out, Vector3.dot(r0, c1))
    __set__.xz(out, Vector3.dot(r0, c2))
    __set__.yx(out, Vector3.dot(r1, c0))
    __set__.yy(out, Vector3.dot(r1, c1))
    __set__.yz(out, Vector3.dot(r1, c2))
    __set__.zx(out, Vector3.dot(r2, c0))
    __set__.zy(out, Vector3.dot(r2, c1))
    __set__.zz(out, Vector3.dot(r2, c2))

    return out
  },

  toString(a: number | Matrix3) {
    const [
      xx, xy, xz,
      yx, yy, yz,
      zx, zy, zz
    ] = Matrix3.from(a)
    return `mat3<${xx}, ${xy}, ${xz}, ${yx}, ${yy}, ${yz}, ${zx}, ${zy}, ${zz}>`
  }
}
import { Vector4 } from "./vector4.js";
import { ADD, SUB, MUL, DIV, MOD } from "./index.js";

export type Matrix4 = [
  number, number, number, number,
  number, number, number, number,
  number, number, number, number,
  number, number, number, number
]

const XX = 0 as const;
const XY = 1 as const;
const XZ = 2 as const;
const XW = 3 as const;

const YX = 4 as const;
const YY = 5 as const;
const YZ = 6 as const;
const YW = 7 as const;

const ZX = 8 as const;
const ZY = 9 as const;
const ZZ = 10 as const;
const ZW = 11 as const;

const WX = 12 as const;
const WY = 13 as const;
const WZ = 14 as const;
const WW = 15 as const;

const __get__ = {
  xx(a: Matrix4) { return a[XX] },
  xy(a: Matrix4) { return a[XY] },
  xz(a: Matrix4) { return a[XZ] },
  xw(a: Matrix4) { return a[XW] },
  yx(a: Matrix4) { return a[YX] },
  yy(a: Matrix4) { return a[YY] },
  yz(a: Matrix4) { return a[YZ] },
  yw(a: Matrix4) { return a[YW] },
  zx(a: Matrix4) { return a[ZX] },
  zy(a: Matrix4) { return a[ZY] },
  zz(a: Matrix4) { return a[ZZ] },
  zw(a: Matrix4) { return a[ZW] },
  wx(a: Matrix4) { return a[WX] },
  wy(a: Matrix4) { return a[WY] },
  wz(a: Matrix4) { return a[WZ] },
  ww(a: Matrix4) { return a[WW] },

  r0(a: Matrix4) { return [ a[XX], a[XY], a[XZ], a[XW] ] satisfies Vector4 },
  r1(a: Matrix4) { return [ a[YX], a[YY], a[YZ], a[YW] ] satisfies Vector4 },
  r2(a: Matrix4) { return [ a[ZX], a[ZY], a[ZZ], a[ZW] ] satisfies Vector4 },
  r3(a: Matrix4) { return [ a[WX], a[WY], a[WZ], a[WW] ] satisfies Vector4 },

  c0(a: Matrix4) { return [ a[XX], a[YX], a[ZX], a[WX] ] satisfies Vector4 },
  c1(a: Matrix4) { return [ a[XY], a[YY], a[ZY], a[WY] ] satisfies Vector4 },
  c2(a: Matrix4) { return [ a[XZ], a[YZ], a[ZZ], a[WZ] ] satisfies Vector4 },
  c3(a: Matrix4) { return [ a[XW], a[YW], a[ZW], a[WW] ] satisfies Vector4 },

  row(a: Matrix4, i: 0 | 1 | 2 | 3) { switch (i) {
    case 0: return __get__.r0(a)
    case 1: return __get__.r1(a)
    case 2: return __get__.r2(a)
    case 3: return __get__.r3(a)
  }},

  col(a: Matrix4, j: 0 | 1 | 2 | 3) { switch (j) {
    case 0: return __get__.c0(a)
    case 1: return __get__.c1(a)
    case 2: return __get__.c2(a)
    case 3: return __get__.c3(a)
  }},
}

const __set__ = {
  xx(a: Matrix4, xx: number) { return a[XX] = xx },
  xy(a: Matrix4, xy: number) { return a[XY] = xy },
  xz(a: Matrix4, xz: number) { return a[XZ] = xz },
  xw(a: Matrix4, xw: number) { return a[XW] = xw },
  yx(a: Matrix4, yx: number) { return a[YX] = yx },
  yy(a: Matrix4, yy: number) { return a[YY] = yy },
  yz(a: Matrix4, yz: number) { return a[YZ] = yz },
  yw(a: Matrix4, yw: number) { return a[YW] = yw },
  zx(a: Matrix4, zx: number) { return a[ZX] = zx },
  zy(a: Matrix4, zy: number) { return a[ZY] = zy },
  zz(a: Matrix4, zz: number) { return a[ZZ] = zz },
  zw(a: Matrix4, zw: number) { return a[ZW] = zw },
  wx(a: Matrix4, wx: number) { return a[WX] = wx },
  wy(a: Matrix4, wy: number) { return a[WY] = wy },
  wz(a: Matrix4, wz: number) { return a[WZ] = wz },
  ww(a: Matrix4, ww: number) { return a[WW] = ww },

  r0(a: Matrix4, r0: number | Vector4) {
    const [x, y, z, w] = Vector4.from(r0)
    __set__.xx(a, x)
    __set__.xy(a, y)
    __set__.xz(a, z)
    __set__.xw(a, w)
    return [x, y, z, w] satisfies Vector4
  },

  r1(a: Matrix4, r1: number | Vector4) {
    const [x, y, z, w] = Vector4.from(r1)
    __set__.yx(a, x)
    __set__.yy(a, y)
    __set__.yz(a, z)
    __set__.yw(a, w)
    return [x, y, z, w] satisfies Vector4
  },

  r2(a: Matrix4, r2: number | Vector4) {
    const [x, y, z, w] = Vector4.from(r2)
    __set__.zx(a, x)
    __set__.zy(a, y)
    __set__.zz(a, z)
    __set__.zw(a, w)
    return [x, y, z, w] satisfies Vector4
  },

  r3(a: Matrix4, r3: number | Vector4) {
    const [x, y, z, w] = Vector4.from(r3)
    __set__.wx(a, x)
    __set__.wy(a, y)
    __set__.wz(a, z)
    __set__.ww(a, w)
    return [x, y, z, w] satisfies Vector4
  },

  c0(a: Matrix4, c0: number | Vector4) {
    const [x, y, z, w] = Vector4.from(c0)
    __set__.xx(a, x)
    __set__.yx(a, y)
    __set__.zx(a, z)
    __set__.wx(a, w)
    return [x, y, z, w] satisfies Vector4
  },

  c1(a: Matrix4, c1: number | Vector4) {
    const [x, y, z, w] = Vector4.from(c1)
    __set__.xy(a, x)
    __set__.yy(a, y)
    __set__.zy(a, y)
    __set__.wy(a, y)
    return [x, y, z, w] satisfies Vector4
  },

  c2(a: Matrix4, c2: number | Vector4) {
    const [x, y, z, w] = Vector4.from(c2)
    __set__.xz(a, x)
    __set__.yz(a, y)
    __set__.zz(a, z)
    __set__.wz(a, z)
    return [x, y, z, w] satisfies Vector4
  },

  c3(a: Matrix4, c3: number | Vector4) {
    const [x, y, z, w] = Vector4.from(c3)
    __set__.xw(a, x)
    __set__.yw(a, y)
    __set__.zw(a, z)
    __set__.ww(a, w)
    return [x, y, z, w] satisfies Vector4
  },

  row(a: Matrix4, i: 0 | 1 | 2 | 3, ri: number | Vector4) {
    switch (i) {
      case 0: return __set__.r0(a, ri)
      case 1: return __set__.r1(a, ri)
      case 2: return __set__.r2(a, ri)
      case 3: return __set__.r3(a, ri)
    }
  },

  col(a: Matrix4, j: 0 | 1 | 2 | 3, cj: number | Vector4) {
    switch (j) {
      case 0: return __set__.c0(a, cj)
      case 1: return __set__.c1(a, cj)
      case 2: return __set__.c2(a, cj)
      case 3: return __set__.c3(a, cj)
    }
  },
}

function xx(a: Matrix4, xx ?: number) {
  return xx === undefined ? __get__.xx(a) : __set__.xx(a, xx)
}

function xy(a: Matrix4, xy ?: number) {
  return xy === undefined ? __get__.xy(a) : __set__.xy(a, xy)
}

function xz(a: Matrix4, xz ?: number) {
  return xz === undefined ? __get__.xz(a) : __set__.xz(a, xz)
}

function xw(a: Matrix4, xw ?: number) {
  return xw === undefined ? __get__.xw(a) : __set__.xw(a, xw)
}

function yx(a: Matrix4, yx ?: number) {
  return yx === undefined ? __get__.yx(a) : __set__.yx(a, yx)
}

function yy(a: Matrix4, yy ?: number) {
  return yy === undefined ? __get__.yy(a) : __set__.yy(a, yy)
}

function yz(a: Matrix4, yz ?: number) {
  return yz === undefined ? __get__.yz(a) : __set__.yz(a, yz)
}

function yw(a: Matrix4, yw ?: number) {
  return yw === undefined ? __get__.yw(a) : __set__.yw(a, yw)
}

function zx(a: Matrix4, zx ?: number) {
  return zx === undefined ? __get__.zx(a) : __set__.zx(a, zx)
}

function zy(a: Matrix4, zy ?: number) {
  return zy === undefined ? __get__.zy(a) : __set__.zy(a, zy)
}

function zz(a: Matrix4, zz ?: number) {
  return zz === undefined ? __get__.zz(a) : __set__.zz(a, zz)
}

function zw(a: Matrix4, zw ?: number) {
  return zw === undefined ? __get__.zw(a) : __set__.zw(a, zw)
}

function wx(a: Matrix4, wx ?: number) {
  return wx === undefined ? __get__.wx(a) : __set__.wx(a, wx)
}

function wy(a: Matrix4, wy ?: number) {
  return wy === undefined ? __get__.wy(a) : __set__.wy(a, wy)
}

function wz(a: Matrix4, wz ?: number) {
  return wz === undefined ? __get__.wz(a) : __set__.wz(a, wz)
}

function ww(a: Matrix4, ww ?: number) {
  return ww === undefined ? __get__.ww(a) : __set__.ww(a, ww)
}

function r0(a: Matrix4, r0 ?: number | Vector4) {
  return r0 === undefined ? __get__.r0(a) : __set__.r0(a, r0)
}

function r1(a: Matrix4, r1 ?: number | Vector4) {
  return r1 === undefined ? __get__.r1(a) : __set__.r1(a, r1)
}

function r2(a: Matrix4, r2 ?: number | Vector4) {
  return r2 === undefined ? __get__.r2(a) : __set__.r2(a, r2)
}

function r3(a: Matrix4, r3 ?: number | Vector4) {
  return r3 === undefined ? __get__.r3(a) : __set__.r3(a, r3)
}

function c0(a: Matrix4, c0 ?: number | Vector4) {
  return c0 === undefined ? __get__.c0(a) : __set__.c0(a, c0)
}

function c1(a: Matrix4, c1 ?: number | Vector4) {
  return c1 === undefined ? __get__.c1(a) : __set__.c1(a, c1)
}

function c2(a: Matrix4, c2 ?: number | Vector4) {
  return c2 === undefined ? __get__.c2(a) : __set__.c2(a, c2)
}

function c3(a: Matrix4, c3 ?: number | Vector4) {
  return c3 === undefined ? __get__.c3(a) : __set__.c3(a, c3)
}

function row(a: Matrix4, i: 0 | 1 | 2 | 3, ri ?: number | Vector4) {
  return ri === undefined ? __get__.row(a, i) : __set__.row(a, i, ri)
}

function col(a: Matrix4, j: 0 | 1 | 2 | 3, cj ?: number | Vector4) {
  return cj === undefined ? __get__.col(a, j) : __set__.col(a, j, cj)
}

export const Matrix4 = {
  XX, XY, XZ, XW, YX, YY, YZ, YW, ZX, ZY, ZZ, ZW, WX, WY, WZ, WW,
  __get__,
  __set__,
  xx, xy, xz, xw, yx, yy, yz, yw, zx, zy, zz, zw, wx, wy, wz, ww,

  id(a: number = 1) {
    return [
      a, 0, 0, 0,
      0, a, 0, 0,
      0, 0, a, 0,
      0, 0, 0, a
    ] satisfies Matrix4
  },

  new(...a: Array<number>) {
    if (a.length === 1) return [ 
      a[XX]!, a[XX]!, a[XX]!, a[XX]!, 
      a[XX]!, a[XX]!, a[XX]!, a[XX]!, 
      a[XX]!, a[XX]!, a[XX]!, a[XX]!, 
      a[XX]!, a[XX]!, a[XX]!, a[XX]!
    ] satisfies Matrix4
    else                return [ 
      a[XX] ?? 0, a[XY] ?? 0, a[XZ] ?? 0, a[XW] ?? 0, 
      a[YX] ?? 0, a[YY] ?? 0, a[YZ] ?? 0, a[YW] ?? 0, 
      a[ZX] ?? 0, a[ZY] ?? 0, a[ZZ] ?? 0, a[ZW] ?? 0, 
      a[WX] ?? 0, a[WY] ?? 0, a[WZ] ?? 0, a[WW] ?? 0 
    ] satisfies Matrix4
  },

  from(a: number | Array<number>) {
    if (typeof a === "number") return [
      a, a, a, a,
      a, a, a, a,
      a, a, a, a,
      a, a, a, a
    ] satisfies Matrix4
    else                       return [
      a[XX] ?? 0, a[XY] ?? 0, a[XZ] ?? 0, a[XW] ?? 0, 
      a[YX] ?? 0, a[YY] ?? 0, a[YZ] ?? 0, a[YW] ?? 0, 
      a[ZX] ?? 0, a[ZY] ?? 0, a[ZZ] ?? 0, a[ZW] ?? 0, 
      a[WX] ?? 0, a[WY] ?? 0, a[WZ] ?? 0, a[WW] ?? 0 
    ] satisfies Matrix4
  },

  el(op: (a: number, b: number) => number, a: number | Matrix4, b: number | Matrix4, out: Matrix4 = Matrix4.new()) {
    const [ xxa, xya, xza, xwa, yxa, yya, yza, ywa, zxa, zya, zza, zwa, wxa, wya, wza, wwa ] = Matrix4.from(a)
    const [ xxb, xyb, xzb, xwb, yxb, yyb, yzb, ywb, zxb, zyb, zzb, zwb, wxb, wyb, wzb, wwb ] = Matrix4.from(b)
    __set__.xx(out, op(xxa, xxb))
    __set__.xy(out, op(xya, xyb))
    __set__.xz(out, op(xza, xzb))
    __set__.xw(out, op(xwa, xwb))
    __set__.yx(out, op(yxa, yxb))
    __set__.yy(out, op(yya, yyb))
    __set__.yz(out, op(yza, yzb))
    __set__.yw(out, op(ywa, ywb))
    __set__.zx(out, op(zxa, zxb))
    __set__.zy(out, op(zya, zyb))
    __set__.zz(out, op(zza, zzb))
    __set__.zw(out, op(zwa, zwb))
    __set__.wx(out, op(wxa, wxb))
    __set__.wy(out, op(wya, wyb))
    __set__.wz(out, op(wza, wzb))
    __set__.ww(out, op(wwa, wwb))
    return out
  },

  add(a: number | Matrix4, b: number | Matrix4, out: Matrix4 = Matrix4.new()) {
    return Matrix4.el(ADD, a, b, out)
  },

  sub(a: number | Matrix4, b: number | Matrix4, out: Matrix4 = Matrix4.new()) {
    return Matrix4.el(SUB, a, b, out)
  },

  hmul(a: number | Matrix4, b: number | Matrix4, out: Matrix4 = Matrix4.new()) {
    return Matrix4.el(MUL, a, b, out)
  },

  hdiv(a: number | Matrix4, b: number | Matrix4, out: Matrix4 = Matrix4.new()) {
    return Matrix4.el(DIV, a, b, out)
  },

  hmod(a: number | Matrix4, b: number | Matrix4, out: Matrix4 = Matrix4.new()) {
    return Matrix4.el(MOD, a, b, out)
  },

  mul(a: number | Matrix4, b: number | Matrix4, out: Matrix4 = Matrix4.new()) {
    const A  = Matrix4.from(a)
    const B  = Matrix4.from(b)
    const r0 = __get__.r0(A)
    const r1 = __get__.r1(A)
    const r2 = __get__.r2(A)
    const r3 = __get__.r3(A)
    const c0 = __get__.c0(B)
    const c1 = __get__.c1(B)
    const c2 = __get__.c2(B)
    const c3 = __get__.c3(B)

    __set__.xx(out, Vector4.dot(r0, c0))
    __set__.xy(out, Vector4.dot(r0, c1))
    __set__.xz(out, Vector4.dot(r0, c2))
    __set__.xw(out, Vector4.dot(r0, c3))
    __set__.yx(out, Vector4.dot(r1, c0))
    __set__.yy(out, Vector4.dot(r1, c1))
    __set__.yz(out, Vector4.dot(r1, c2))
    __set__.yw(out, Vector4.dot(r1, c3))
    __set__.zx(out, Vector4.dot(r2, c0))
    __set__.zy(out, Vector4.dot(r2, c1))
    __set__.zz(out, Vector4.dot(r2, c2))
    __set__.zw(out, Vector4.dot(r2, c3))
    __set__.wx(out, Vector4.dot(r3, c0))
    __set__.wy(out, Vector4.dot(r3, c1))
    __set__.wz(out, Vector4.dot(r3, c2))
    __set__.ww(out, Vector4.dot(r3, c3))

    return out
  },

  toString(a: number | Matrix4) {
    const [
      xx, xy, xz, xw,
      yx, yy, yz, yw,
      zx, zy, zz, zw,
      wx, wy, wz, ww
    ] = Matrix4.from(a)
    return `mat4<${xx}, ${xy}, ${xz}, ${xw}, ${yx}, ${yy}, ${yz}, ${yw}, ${zx}, ${zy}, ${zz}, ${zw}, ${wx}, ${wy}, ${wz}, ${ww}>`
  }
}
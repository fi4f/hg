import { Vector4 } from "./vector4.js";
import { add, sub, mul, div, mod } from "./el.js";

export type Matrix4 = [
  number, number, number, number,
  number, number, number, number,
  number, number, number, number,
  number, number, number, number
]

export const Matrix4 = {
  /** Constant index for the xx-component of a Matrix4 */
  XX: 0 as const,
  /** Constant index for the xy-component of a Matrix4 */
  XY: 1 as const,
  /** Constant index for the xz-component of a Matrix4 */
  XZ: 2 as const,
  /** Constant index for the xw-component of a Matrix4 */
  XW: 3 as const,
  /** Constant index for the yx-component of a Matrix4 */
  YX: 4 as const,
  /** Constant index for the yy-component of a Matrix4 */
  YY: 5 as const,
  /** Constant index for the yz-component of a Matrix4 */
  YZ: 6 as const,
  /** Constant index for the yw-component of a Matrix4 */
  YW: 7 as const,
  /** Constant index for the zx-component of a Matrix4 */
  ZX: 8 as const,
  /** Constant index for the zy-component of a Matrix4 */
  ZY: 9 as const,
  /** Constant index for the zz-component of a Matrix4 */
  ZZ: 10 as const,
  /** Constant index for the zw-component of a Matrix4 */
  ZW: 11 as const,
  /** Constant index for the wx-component of a Matrix4 */
  WX: 12 as const,
  /** Constant index for the wy-component of a Matrix4 */
  WY: 13 as const,
  /** Constant index for the wz-component of a Matrix4 */
  WZ: 14 as const,
  /** Constant index for the ww-component of a Matrix4 */
  WW: 15 as const,

  /** A collection of getters for Matrix4 objects */
  Get: {
    /** Get the xx-component of a Matrix4 */
    xx(a: Matrix4) { return a[Matrix4.XX] },
    /** Get the xy-component of a Matrix4 */
    xy(a: Matrix4) { return a[Matrix4.XY] },
    /** Get the xz-component of a Matrix4 */
    xz(a: Matrix4) { return a[Matrix4.XZ] },
    /** Get the xw-component of a Matrix4 */
    xw(a: Matrix4) { return a[Matrix4.XW] },
    /** Get the yx-component of a Matrix4 */
    yx(a: Matrix4) { return a[Matrix4.YX] },
    /** Get the yy-component of a Matrix4 */
    yy(a: Matrix4) { return a[Matrix4.YY] },
    /** Get the yz-component of a Matrix4 */
    yz(a: Matrix4) { return a[Matrix4.YZ] },
    /** Get the yw-component of a Matrix4 */
    yw(a: Matrix4) { return a[Matrix4.YW] },
    /** Get the zx-component of a Matrix4 */
    zx(a: Matrix4) { return a[Matrix4.ZX] },
    /** Get the zy-component of a Matrix4 */
    zy(a: Matrix4) { return a[Matrix4.ZY] },
    /** Get the zz-component of a Matrix4 */
    zz(a: Matrix4) { return a[Matrix4.ZZ] },
    /** Get the zw-component of a Matrix4 */
    zw(a: Matrix4) { return a[Matrix4.ZW] },
    /** Get the wx-component of a Matrix4 */
    wx(a: Matrix4) { return a[Matrix4.WX] },
    /** Get the wy-component of a Matrix4 */
    wy(a: Matrix4) { return a[Matrix4.WY] },
    /** Get the wz-component of a Matrix4 */
    wz(a: Matrix4) { return a[Matrix4.WZ] },
    /** Get the ww-component of a Matrix4 */
    ww(a: Matrix4) { return a[Matrix4.WW] },

    /** Get the 0th row of a Matrix4 as a Vector4 */
    r0(a: Matrix4) { 
      return [ 
        a[Matrix4.XX], 
        a[Matrix4.XY], 
        a[Matrix4.XZ], 
        a[Matrix4.XW] 
      ] satisfies Vector4 
    },
    /** Get the 1st row of a Matrix4 as a Vector4 */
    r1(a: Matrix4) { 
      return [ 
        a[Matrix4.YX], 
        a[Matrix4.YY], 
        a[Matrix4.YZ], 
        a[Matrix4.YW] 
      ] satisfies Vector4 
    },
    /** Get the 2nd row of a Matrix4 as a Vector4 */
    r2(a: Matrix4) { 
      return [ 
        a[Matrix4.ZX], 
        a[Matrix4.ZY], 
        a[Matrix4.ZZ], 
        a[Matrix4.ZW] 
      ] satisfies Vector4 
    },
    /** Get the 3rd row of a Matrix4 as a Vector4 */
    r3(a: Matrix4) { 
      return [ 
        a[Matrix4.WX], 
        a[Matrix4.WY], 
        a[Matrix4.WZ], 
        a[Matrix4.WW] 
      ] satisfies Vector4 
    },
    /** Get the i-th row of a Matrix4 as a Vector4 */
    row(a: Matrix4, i: 0 | 1 | 2 | 3) { 
      switch(i) {
        case 0: return Matrix4.Get.r0(a)
        case 1: return Matrix4.Get.r1(a)
        case 2: return Matrix4.Get.r2(a)
        case 3: return Matrix4.Get.r3(a)
      }
    },

    /** Get the 0th column of a Matrix4 as a Vector4 */
    c0(a: Matrix4) { 
      return [ 
        a[Matrix4.XX], 
        a[Matrix4.YX], 
        a[Matrix4.ZX], 
        a[Matrix4.WX] 
      ] satisfies Vector4 
    },
    /** Get the 1st column of a Matrix4 as a Vector4 */
    c1(a: Matrix4) { 
      return [ 
        a[Matrix4.XY], 
        a[Matrix4.YY], 
        a[Matrix4.ZY], 
        a[Matrix4.WY] 
      ] satisfies Vector4 
    },
    /** Get the 2nd column of a Matrix4 as a Vector4 */
    c2(a: Matrix4) { 
      return [ 
        a[Matrix4.XZ], 
        a[Matrix4.YZ], 
        a[Matrix4.ZZ], 
        a[Matrix4.WZ] 
      ] satisfies Vector4 
    },
    /** Get the 3rd column of a Matrix4 as a Vector4 */
    c3(a: Matrix4) { 
      return [ 
        a[Matrix4.XW], 
        a[Matrix4.YW], 
        a[Matrix4.ZW], 
        a[Matrix4.WW] 
      ] satisfies Vector4 
    },
    /** Get the j-th column of a Matrix4 as a Vector4 */
    col(a: Matrix4, j: 0 | 1 | 2 | 3) {
      switch(j) {
        case 0: return Matrix4.Get.c0(a)
        case 1: return Matrix4.Get.c1(a)
        case 2: return Matrix4.Get.c2(a)
        case 3: return Matrix4.Get.c3(a)
      }
    },
  },

  /** A collection of setters for Matrix4 objects */
  Set: {
    /** Set the xx-component of a Matrix4 */
    xx(a: Matrix4, xx: number) { return a[Matrix4.XX] = xx },
    /** Set the xy-component of a Matrix4 */
    xy(a: Matrix4, xy: number) { return a[Matrix4.XY] = xy },
    /** Set the xz-component of a Matrix4 */
    xz(a: Matrix4, xz: number) { return a[Matrix4.XZ] = xz },
    /** Set the xw-component of a Matrix4 */
    xw(a: Matrix4, xw: number) { return a[Matrix4.XW] = xw },
    /** Set the yx-component of a Matrix4 */
    yx(a: Matrix4, yx: number) { return a[Matrix4.YX] = yx },
    /** Set the yy-component of a Matrix4 */
    yy(a: Matrix4, yy: number) { return a[Matrix4.YY] = yy },
    /** Set the yz-component of a Matrix4 */
    yz(a: Matrix4, yz: number) { return a[Matrix4.YZ] = yz },
    /** Set the yw-component of a Matrix4 */
    yw(a: Matrix4, yw: number) { return a[Matrix4.YW] = yw },
    /** Set the zx-component of a Matrix4 */
    zx(a: Matrix4, zx: number) { return a[Matrix4.ZX] = zx },
    /** Set the zy-component of a Matrix4 */
    zy(a: Matrix4, zy: number) { return a[Matrix4.ZY] = zy },
    /** Set the zz-component of a Matrix4 */
    zz(a: Matrix4, zz: number) { return a[Matrix4.ZZ] = zz },
    /** Set the zw-component of a Matrix4 */
    zw(a: Matrix4, zw: number) { return a[Matrix4.ZW] = zw },
    /** Set the wx-component of a Matrix4 */
    wx(a: Matrix4, wx: number) { return a[Matrix4.WX] = wx },
    /** Set the wy-component of a Matrix4 */
    wy(a: Matrix4, wy: number) { return a[Matrix4.WY] = wy },
    /** Set the wz-component of a Matrix4 */
    wz(a: Matrix4, wz: number) { return a[Matrix4.WZ] = wz },
    /** Set the ww-component of a Matrix4 */
    ww(a: Matrix4, ww: number) { return a[Matrix4.WW] = ww },

    /** Set the 0th row of a Matrix4 */
    r0(a: Matrix4, [xx, xy, xz, xw]: Vector4) {
      a[Matrix4.XX] = xx
      a[Matrix4.XY] = xy
      a[Matrix4.XZ] = xz
      a[Matrix4.XW] = xw
      return [xx, xy, xz, xw] satisfies Vector4
    },
    /** Set the 1st row of a Matrix4 */
    r1(a: Matrix4, [yx, yy, yz, yw]: Vector4) {
      a[Matrix4.YX] = yx
      a[Matrix4.YY] = yy
      a[Matrix4.YZ] = yz
      a[Matrix4.YW] = yw
      return [yx, yy, yz, yw] satisfies Vector4
    },
    /** Set the 2nd row of a Matrix4 */
    r2(a: Matrix4, [zx, zy, zz, zw]: Vector4) {
      a[Matrix4.ZX] = zx
      a[Matrix4.ZY] = zy
      a[Matrix4.ZZ] = zz
      a[Matrix4.ZW] = zw
      return [zx, zy, zz, zw] satisfies Vector4
    },
    /** Set the 3rd row of a Matrix4 */
    r3(a: Matrix4, [wx, wy, wz, ww]: Vector4) {
      a[Matrix4.WX] = wx
      a[Matrix4.WY] = wy
      a[Matrix4.WZ] = wz
      a[Matrix4.WW] = ww
      return [wx, wy, wz, ww] satisfies Vector4
    },
    /** Set the i-th row of a Matrix4 */
    row(a: Matrix4, i: 0 | 1 | 2 | 3, ri: Vector4) {
      switch(i) {
        case 0: return Matrix4.Set.r0(a, ri)
        case 1: return Matrix4.Set.r1(a, ri)
        case 2: return Matrix4.Set.r2(a, ri)
        case 3: return Matrix4.Set.r3(a, ri)
      }
    },

    /** Set the 0th column of a Matrix4 */
    c0(a: Matrix4, [xx, yx, zx, wx]: Vector4) {
      a[Matrix4.XX] = xx
      a[Matrix4.YX] = yx
      a[Matrix4.ZX] = zx
      a[Matrix4.WX] = wx
      return [xx, yx, zx, wx] satisfies Vector4
    },
    /** Set the 1st column of a Matrix4 */
    c1(a: Matrix4, [xy, yy, zy, wy]: Vector4) {
      a[Matrix4.XY] = xy
      a[Matrix4.YY] = yy
      a[Matrix4.ZY] = zy
      a[Matrix4.WY] = wy
      return [xy, yy, zy, wy] satisfies Vector4
    },
    /** Set the 2nd column of a Matrix4 */
    c2(a: Matrix4, [xz, yz, zz, wz]: Vector4) {
      a[Matrix4.XZ] = xz
      a[Matrix4.YZ] = yz
      a[Matrix4.ZZ] = zz
      a[Matrix4.WZ] = wz
      return [xz, yz, zz, wz] satisfies Vector4
    },
    /** Set the 3rd column of a Matrix4 */
    c3(a: Matrix4, [xw, yw, zw, ww]: Vector4) {
      a[Matrix4.XW] = xw
      a[Matrix4.YW] = yw
      a[Matrix4.ZW] = zw
      a[Matrix4.WW] = ww
      return [xw, yw, zw, ww] satisfies Vector4
    },
    /** Set the j-th column of a Matrix4 */
    col(a: Matrix4, j: 0 | 1 | 2 | 3, cj: Vector4) {
      switch(j) {
        case 0: return Matrix4.Set.c0(a, cj)
        case 1: return Matrix4.Set.c1(a, cj)
        case 2: return Matrix4.Set.c2(a, cj)
        case 3: return Matrix4.Set.c3(a, cj)
      }
    },
  },

  /** Construct an identity Matrix4 with an optional scale factor */
  id(a: number = 1) {
    return [
      a, 0, 0, 0,
      0, a, 0, 0,
      0, 0, a, 0,
      0, 0, 0, a
    ] satisfies Matrix4
  },

  /**
   * Construct a Matrix4 from a variadic array of numbers.
   * 
   * Constructs a uniform Matrix4 when `a.length === 1`
   * ```js
   * Matrix4.new(1) // [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
   * ```
   * 
   * Otherwise constructs a standard zero-padded row-major Matrix4
   * ```js
   * Matrix4.new(          ) // [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
   * Matrix4.new(1, 2      ) // [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
   * Matrix4.new(1, 2, 3, 4) // [1, 2, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
   * ```
   */
  new(...a: Array<number>) {
    if (a.length === 1) return [ 
      a[Matrix4.XX]!    , a[Matrix4.XX]!    , a[Matrix4.XX]!    , a[Matrix4.XX]!    , 
      a[Matrix4.XX]!    , a[Matrix4.XX]!    , a[Matrix4.XX]!    , a[Matrix4.XX]!    , 
      a[Matrix4.XX]!    , a[Matrix4.XX]!    , a[Matrix4.XX]!    , a[Matrix4.XX]!    , 
      a[Matrix4.XX]!    , a[Matrix4.XX]!    , a[Matrix4.XX]!    , a[Matrix4.XX]!    
    ] satisfies Matrix4
    else                return [ 
      a[Matrix4.XX] ?? 0, a[Matrix4.XY] ?? 0, a[Matrix4.XZ] ?? 0, a[Matrix4.XW] ?? 0, 
      a[Matrix4.YX] ?? 0, a[Matrix4.YY] ?? 0, a[Matrix4.YZ] ?? 0, a[Matrix4.YW] ?? 0, 
      a[Matrix4.ZX] ?? 0, a[Matrix4.ZY] ?? 0, a[Matrix4.ZZ] ?? 0, a[Matrix4.ZW] ?? 0, 
      a[Matrix4.WX] ?? 0, a[Matrix4.WY] ?? 0, a[Matrix4.WZ] ?? 0, a[Matrix4.WW] ?? 0 
    ] satisfies Matrix4
  },

  /**
   * Constructs a Matrix4 from a number or an array of numbers.
   * 
   * Constructs a uniform Matrix4 when `a` is a number
   * ```js
   * Matrix4.from(1) // [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
   * ```
   * 
   * Otherwise constructs a standard zero-padded Matrix4
   * ```js
   * Matrix4.from([          ]) // [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
   * Matrix4.from([1         ]) // [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
   * Matrix4.from([1, 2      ]) // [1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
   * Matrix4.from([1, 2, 3, 4]) // [1, 2, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
   * ```
   */
  from(a: number | Array<number>) {
    if (typeof a === "number") return [
      a, a, a, a,
      a, a, a, a,
      a, a, a, a,
      a, a, a, a
    ] satisfies Matrix4
    else                       return [
      a[Matrix4.XX] ?? 0, a[Matrix4.XY] ?? 0, a[Matrix4.XZ] ?? 0, a[Matrix4.XW] ?? 0, 
      a[Matrix4.YX] ?? 0, a[Matrix4.YY] ?? 0, a[Matrix4.YZ] ?? 0, a[Matrix4.YW] ?? 0, 
      a[Matrix4.ZX] ?? 0, a[Matrix4.ZY] ?? 0, a[Matrix4.ZZ] ?? 0, a[Matrix4.ZW] ?? 0, 
      a[Matrix4.WX] ?? 0, a[Matrix4.WY] ?? 0, a[Matrix4.WZ] ?? 0, a[Matrix4.WW] ?? 0 
    ] satisfies Matrix4
  },

  /**
   * Perform an element-wise operation on two Matrix4 objects.
   * Number-like arguments are promoted to uniform Matrix4 objects
   * before performing the operation. Constructs a new Matrix4 when an
   * output argument is not provided.
   */
  el(op: (a: number, b: number) => number, a: number | Matrix4, b: number | Matrix4, out: Matrix4 = Matrix4.new()) {
    const [ xxa, xya, xza, xwa, yxa, yya, yza, ywa, zxa, zya, zza, zwa, wxa, wya, wza, wwa ] = Matrix4.from(a)
    const [ xxb, xyb, xzb, xwb, yxb, yyb, yzb, ywb, zxb, zyb, zzb, zwb, wxb, wyb, wzb, wwb ] = Matrix4.from(b)
    Matrix4.Set.xx(out, op(xxa, xxb))
    Matrix4.Set.xy(out, op(xya, xyb))
    Matrix4.Set.xz(out, op(xza, xzb))
    Matrix4.Set.xw(out, op(xwa, xwb))
    Matrix4.Set.yx(out, op(yxa, yxb))
    Matrix4.Set.yy(out, op(yya, yyb))
    Matrix4.Set.yz(out, op(yza, yzb))
    Matrix4.Set.yw(out, op(ywa, ywb))
    Matrix4.Set.zx(out, op(zxa, zxb))
    Matrix4.Set.zy(out, op(zya, zyb))
    Matrix4.Set.zz(out, op(zza, zzb))
    Matrix4.Set.zw(out, op(zwa, zwb))
    Matrix4.Set.wx(out, op(wxa, wxb))
    Matrix4.Set.wy(out, op(wya, wyb))
    Matrix4.Set.wz(out, op(wza, wzb))
    Matrix4.Set.ww(out, op(wwa, wwb))
    return out
  },

  /**
   * Compute the sum of two Matrix4 objects. Number-like arguments are
   * promoted to uniform Matrix4 objects before performing the operation.
   * Constructs a new Matrix4 when an output argument is not provided.
   */
  add(a: number | Matrix4, b: number | Matrix4, out: Matrix4 = Matrix4.new()) {
    return Matrix4.el(add, a, b, out)
  },

  /**
   * Compute the difference of two Matrix4 objects. Number-like arguments
   * are promoted to uniform Matrix4 objects before performing the
   * operation. Constructs a new Matrix4 when an output argument is not
   * provided.
   */
  sub(a: number | Matrix4, b: number | Matrix4, out: Matrix4 = Matrix4.new()) {
    return Matrix4.el(sub, a, b, out)
  },

  /**
   * Compute the hadamard (element-wise) product of two Matrix4 objects.
   * Number-like arguments are promoted to uniform Matrix4 objects before
   * performing the operation. Constructs a new Matrix4 when an output
   * argument is not provided.
   */
  hmul(a: number | Matrix4, b: number | Matrix4, out: Matrix4 = Matrix4.new()) {
    return Matrix4.el(mul, a, b, out)
  },

  /**
   * Compute the hadamard (element-wise) quotient of two Matrix4 objects.
   * Number-like arguments are promoted to uniform Matrix4 objects before
   * performing the operation. Constructs a new Matrix4 when an output
   * argument is not provided.
   */
  hdiv(a: number | Matrix4, b: number | Matrix4, out: Matrix4 = Matrix4.new()) {
    return Matrix4.el(div, a, b, out)
  },

  /**
   * Compute the hadamard (element-wise) remainder of two Matrix4 objects.
   * Number-like arguments are promoted to uniform Matrix4 objects before
   * performing the operation. Constructs a new Matrix4 when an output
   * argument is not provided.
   */
  hmod(a: number | Matrix4, b: number | Matrix4, out: Matrix4 = Matrix4.new()) {
    return Matrix4.el(mod, a, b, out)
  },

  /**
   * Compute the standard product of two Matrix4 objects. Number-like arguments are
   * promoted to uniform Matrix4 objects before performing the operation.
   * Constructs a new Matrix4 when an output argument is not provided.
   */
  mul(a: number | Matrix4, b: number | Matrix4, out: Matrix4 = Matrix4.new()) {
    const A  = Matrix4.from(a)
    const B  = Matrix4.from(b)
    const r0 = Matrix4.Get.r0(A)
    const r1 = Matrix4.Get.r1(A)
    const r2 = Matrix4.Get.r2(A)
    const r3 = Matrix4.Get.r3(A)
    const c0 = Matrix4.Get.c0(B)
    const c1 = Matrix4.Get.c1(B)
    const c2 = Matrix4.Get.c2(B)
    const c3 = Matrix4.Get.c3(B)
    Matrix4.Set.xx(out, Vector4.dot(r0, c0))
    Matrix4.Set.xy(out, Vector4.dot(r0, c1))
    Matrix4.Set.xz(out, Vector4.dot(r0, c2))
    Matrix4.Set.xw(out, Vector4.dot(r0, c3))
    Matrix4.Set.yx(out, Vector4.dot(r1, c0))
    Matrix4.Set.yy(out, Vector4.dot(r1, c1))
    Matrix4.Set.yz(out, Vector4.dot(r1, c2))
    Matrix4.Set.yw(out, Vector4.dot(r1, c3))
    Matrix4.Set.zx(out, Vector4.dot(r2, c0))
    Matrix4.Set.zy(out, Vector4.dot(r2, c1))
    Matrix4.Set.zz(out, Vector4.dot(r2, c2))
    Matrix4.Set.zw(out, Vector4.dot(r2, c3))
    Matrix4.Set.wx(out, Vector4.dot(r3, c0))
    Matrix4.Set.wy(out, Vector4.dot(r3, c1))
    Matrix4.Set.wz(out, Vector4.dot(r3, c2))
    Matrix4.Set.ww(out, Vector4.dot(r3, c3))
    return out
  },

  /**
   * Convert a Matrix4 into its string representation.
   * ```js
   * Matrix4.toString([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]) // "mat4<1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16>"
   * ```  
   */
  toString([xx, xy, xz, xw, yx, yy, yz, yw, zx, zy, zz, zw, wx, wy, wz, ww]:  Matrix4) {
    return `mat4<${xx}, ${xy}, ${xz}, ${xw}, ${yx}, ${yy}, ${yz}, ${yw}, ${zx}, ${zy}, ${zz}, ${zw}, ${wx}, ${wy}, ${wz}, ${ww}>` as const
  }
}
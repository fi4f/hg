import { Vector3 } from "./vector3.js";
import { add, sub, mul, div, mod } from "./el.js";

export type Matrix3 = [
  number, number, number,
  number, number, number,
  number, number, number
]



export const Matrix3 = {

  /** Constant index for the xx-component of a Matrix3 */
  XX: 0 as const,
  /** Constant index for the xy-component of a Matrix3 */
  XY: 1 as const,
  /** Constant index for the xz-component of a Matrix3 */
  XZ: 2 as const,
  /** Constant index for the yx-component of a Matrix3 */
  YX: 3 as const,
  /** Constant index for the yy-component of a Matrix3 */
  YY: 4 as const,
  /** Constant index for the yz-component of a Matrix3 */
  YZ: 5 as const,
  /** Constant index for the zx-component of a Matrix3 */
  ZX: 6 as const,
  /** Constant index for the zy-component of a Matrix3 */
  ZY: 7 as const,
  /** Constant index for the zz-component of a Matrix3 */
  ZZ: 8 as const,

  /** A collection of getters for Matrix3 objects */
  Get: {
    /** Get the xx-component of a Matrix3 */
    xx(a: Matrix3) { return a[Matrix3.XX] },
    /** Get the xy-component of a Matrix3 */
    xy(a: Matrix3) { return a[Matrix3.XY] },
    /** Get the xz-component of a Matrix3 */
    xz(a: Matrix3) { return a[Matrix3.XZ] },
    /** Get the yx-component of a Matrix3 */
    yx(a: Matrix3) { return a[Matrix3.YX] },
    /** Get the yy-component of a Matrix3 */
    yy(a: Matrix3) { return a[Matrix3.YY] },
    /** Get the yz-component of a Matrix3 */
    yz(a: Matrix3) { return a[Matrix3.YZ] },
    /** Get the zx-component of a Matrix3 */
    zx(a: Matrix3) { return a[Matrix3.ZX] },
    /** Get the zy-component of a Matrix3 */
    zy(a: Matrix3) { return a[Matrix3.ZY] },
    /** Get the zz-component of a Matrix3 */
    zz(a: Matrix3) { return a[Matrix3.ZZ] },

    /** Get the 0th row of a Matrix3 as a Vector3 */
    r0(a: Matrix3) { 
      return [ 
        a[Matrix3.XX], 
        a[Matrix3.XY], 
        a[Matrix3.XZ] 
      ] satisfies Vector3 
    },
    /** Get the 1st row of a Matrix3 as a Vector3 */
    r1(a: Matrix3) { 
      return [ 
        a[Matrix3.YX], 
        a[Matrix3.YY], 
        a[Matrix3.YZ] 
      ] satisfies Vector3 
    },
    /** Get the 2nd row of a Matrix3 as a Vector3 */
    r2(a: Matrix3) { 
      return [ 
        a[Matrix3.ZX], 
        a[Matrix3.ZY], 
        a[Matrix3.ZZ] 
      ] satisfies Vector3 
    },
    /** Get the i-th row of a Matrix3 as a Vector3 */
    row(a: Matrix3, i: 0 | 1 | 2) { 
      switch(i) {
        case 0: return Matrix3.Get.r0(a)
        case 1: return Matrix3.Get.r1(a)
        case 2: return Matrix3.Get.r2(a)
      }
    },

    /** Get the 0th column of a Matrix3 as a Vector3 */
    c0(a: Matrix3) { 
      return [ 
        a[Matrix3.XX], 
        a[Matrix3.YX], 
        a[Matrix3.ZX] 
      ] satisfies Vector3 
    },
    /** Get the 1st column of a Matrix3 as a Vector3 */
    c1(a: Matrix3) { 
      return [ 
        a[Matrix3.XY], 
        a[Matrix3.YY], 
        a[Matrix3.ZY] 
      ] satisfies Vector3 
    },
    /** Get the 2nd column of a Matrix3 as a Vector3 */
    c2(a: Matrix3) { 
      return [ 
        a[Matrix3.XZ], 
        a[Matrix3.YZ], 
        a[Matrix3.ZZ] 
      ] satisfies Vector3 
    },
    /** Get the j-th column of a Matrix3 as a Vector3 */
    col(a: Matrix3, j: 0 | 1 | 2) {
      switch(j) {
        case 0: return Matrix3.Get.c0(a)
        case 1: return Matrix3.Get.c1(a)
        case 2: return Matrix3.Get.c2(a)
      }
    },
  },

  /** A collection of setters for Matrix3 objects */
  Set: {
    /** Set the xx-component of a Matrix3 */
    xx(a: Matrix3, xx: number) { return a[Matrix3.XX] = xx },
    /** Set the xy-component of a Matrix3 */
    xy(a: Matrix3, xy: number) { return a[Matrix3.XY] = xy },
    /** Set the xz-component of a Matrix3 */
    xz(a: Matrix3, xz: number) { return a[Matrix3.XZ] = xz },
    /** Set the yx-component of a Matrix3 */
    yx(a: Matrix3, yx: number) { return a[Matrix3.YX] = yx },
    /** Set the yy-component of a Matrix3 */
    yy(a: Matrix3, yy: number) { return a[Matrix3.YY] = yy },
    /** Set the yz-component of a Matrix3 */
    yz(a: Matrix3, yz: number) { return a[Matrix3.YZ] = yz },
    /** Set the zx-component of a Matrix3 */
    zx(a: Matrix3, zx: number) { return a[Matrix3.ZX] = zx },
    /** Set the zy-component of a Matrix3 */
    zy(a: Matrix3, zy: number) { return a[Matrix3.ZY] = zy },
    /** Set the zz-component of a Matrix3 */
    zz(a: Matrix3, zz: number) { return a[Matrix3.ZZ] = zz },

    /** Set the 0th row of a Matrix3 */
    r0(a: Matrix3, [xx, xy, xz]: Vector3) {
      a[Matrix3.XX] = xx
      a[Matrix3.XY] = xy
      a[Matrix3.XZ] = xz
      return [xx, xy, xz] satisfies Vector3
    },
    /** Set the 1st row of a Matrix3 */
    r1(a: Matrix3, [yx, yy, yz]: Vector3) {
      a[Matrix3.YX] = yx
      a[Matrix3.YY] = yy
      a[Matrix3.YZ] = yz
      return [yx, yy, yz] satisfies Vector3
    },
    /** Set the 2nd row of a Matrix3 */
    r2(a: Matrix3, [zx, zy, zz]: Vector3) {
      a[Matrix3.ZX] = zx
      a[Matrix3.ZY] = zy
      a[Matrix3.ZZ] = zz
      return [zx, zy, zz] satisfies Vector3
    },
    /** Set the i-th row of a Matrix3 */
    row(a: Matrix3, i: 0 | 1 | 2, ri: Vector3) {
      switch(i) {
        case 0: return Matrix3.Set.r0(a, ri)
        case 1: return Matrix3.Set.r1(a, ri)
        case 2: return Matrix3.Set.r2(a, ri)
      }
    },

    /** Set the 0th column of a Matrix3 */
    c0(a: Matrix3, [xx, yx, zx]: Vector3) {
      a[Matrix3.XX] = xx
      a[Matrix3.YX] = yx
      a[Matrix3.ZX] = zx
      return [xx, yx, zx] satisfies Vector3
    },
    /** Set the 1st column of a Matrix3 */
    c1(a: Matrix3, [xy, yy, zy]: Vector3) {
      a[Matrix3.XY] = xy
      a[Matrix3.YY] = yy
      a[Matrix3.ZY] = zy
      return [xy, yy, zy] satisfies Vector3
    },
    /** Set the 2nd column of a Matrix3 */
    c2(a: Matrix3, [xz, yz, zz]: Vector3) {
      a[Matrix3.XZ] = xz
      a[Matrix3.YZ] = yz
      a[Matrix3.ZZ] = zz
      return [xz, yz, zz] satisfies Vector3
    },
    /** Set the j-th column of a Matrix3 */
    col(a: Matrix3, j: 0 | 1 | 2, cj: Vector3) {
      switch(j) {
        case 0: return Matrix3.Set.c0(a, cj)
        case 1: return Matrix3.Set.c1(a, cj)
        case 2: return Matrix3.Set.c2(a, cj)
      }
    },
  },

  /** Construct an identity Matrix3 with an optional scale factor */
  id(a: number = 1) {
    return [
      a, 0, 0,
      0, a, 0,
      0, 0, a
    ] satisfies Matrix3
  }, 

  /**
   * Construct a Matrix3 from a variadic array of numbers.
   * 
   * Constructs a uniform Matrix3 when `a.length === 1`
   * ```js
   * Matrix3.new(1) // [1, 1, 1, 1, 1, 1, 1, 1, 1]
   * ```
   * 
   * Otherwise constructs a standard zero-padded row-major Matrix3
   * ```js
   * Matrix3.new(          ) // [0, 0, 0, 0, 0, 0, 0, 0, 0]
   * Matrix3.new(1, 2      ) // [1, 2, 0, 0, 0, 0, 0, 0, 0]
   * Matrix3.new(1, 2, 3, 4) // [1, 2, 3, 4, 0, 0, 0, 0, 0]
   * ```
   */
  new(...a: Array<number>) {
    if (a.length === 1) return [ 
      a[Matrix3.XX]!    , a[Matrix3.XX]!    , a[Matrix3.XX]!    , 
      a[Matrix3.XX]!    , a[Matrix3.XX]!    , a[Matrix3.XX]!    , 
      a[Matrix3.XX]!    , a[Matrix3.XX]!    , a[Matrix3.XX]!    
    ] satisfies Matrix3
    else                return [ 
      a[Matrix3.XX] ?? 0, a[Matrix3.XY] ?? 0, a[Matrix3.XZ] ?? 0, 
      a[Matrix3.YX] ?? 0, a[Matrix3.YY] ?? 0, a[Matrix3.YZ] ?? 0, 
      a[Matrix3.ZX] ?? 0, a[Matrix3.ZY] ?? 0, a[Matrix3.ZZ] ?? 0 
    ] satisfies Matrix3
  },

  /**
   * Constructs a Matrix3 from a number or an array of numbers.
   * 
   * Constructs a uniform Matrix3 when `a` is a number
   * ```js
   * Matrix3.from(1) // [1, 1, 1, 1, 1, 1, 1, 1, 1]
   * ```
   * 
   * Otherwise constructs a standard zero-padded Matrix3
   * ```js
   * Matrix3.from([          ]) // [0, 0, 0, 0, 0, 0, 0, 0, 0]
   * Matrix3.from([1         ]) // [1, 0, 0, 0, 0, 0, 0, 0, 0]
   * Matrix3.from([1, 2      ]) // [1, 2, 0, 0, 0, 0, 0, 0, 0]
   * Matrix3.from([1, 2, 3, 4]) // [1, 2, 3, 4, 0, 0, 0, 0, 0]
   * ```
   */
  from(a: number | Array<number>) {
    if (typeof a === "number") return [
      a, a, a,
      a, a, a,
      a, a, a
    ] satisfies Matrix3
    else                       return [
      a[Matrix3.XX] ?? 0, a[Matrix3.XY] ?? 0, a[Matrix3.XZ] ?? 0, 
      a[Matrix3.YX] ?? 0, a[Matrix3.YY] ?? 0, a[Matrix3.YZ] ?? 0, 
      a[Matrix3.ZX] ?? 0, a[Matrix3.ZY] ?? 0, a[Matrix3.ZZ] ?? 0 
    ] satisfies Matrix3
  },

  /**
   * Perform an element-wise operation on two Matrix3 objects.
   * Number-like arguments are promoted to uniform Matrix3 objects
   * before performing the operation. Constructs a new Matrix3 when an
   * output argument is not provided.
   */
  el(op: (a: number, b: number) => number, a: number | Matrix3, b: number | Matrix3, out: Matrix3 = Matrix3.new()) {
    const [ xxa, xya, xza, yxa, yya, yza, zxa, zya, zza ] = Matrix3.from(a)
    const [ xxb, xyb, xzb, yxb, yyb, yzb, zxb, zyb, zzb ] = Matrix3.from(b)
    Matrix3.Set.xx(out, op(xxa, xxb))
    Matrix3.Set.xy(out, op(xya, xyb))
    Matrix3.Set.xz(out, op(xza, xzb))
    Matrix3.Set.yx(out, op(yxa, yxb))
    Matrix3.Set.yy(out, op(yya, yyb))
    Matrix3.Set.yz(out, op(yza, yzb))
    Matrix3.Set.zx(out, op(zxa, zxb))
    Matrix3.Set.zy(out, op(zya, zyb))
    Matrix3.Set.zz(out, op(zza, zzb))
    return out
  },

  /**
   * Compute the sum of two Matrix3 objects. Number-like arguments are
   * promoted to uniform Matrix3 objects before performing the operation.
   * Constructs a new Matrix3 when an output argument is not provided.
   */
  add(a: number | Matrix3, b: number | Matrix3, out: Matrix3 = Matrix3.new()) {
    return Matrix3.el(add, a, b, out)
  },

  /**
   * Compute the difference of two Matrix3 objects. Number-like arguments
   * are promoted to uniform Matrix3 objects before performing the
   * operation. Constructs a new Matrix3 when an output argument is not
   * provided.
   */
  sub(a: number | Matrix3, b: number | Matrix3, out: Matrix3 = Matrix3.new()) {
    return Matrix3.el(sub, a, b, out)
  },

  /**
   * Compute the hadamard (element-wise) product of two Matrix3 objects.
   * Number-like arguments are promoted to uniform Matrix3 objects before
   * performing the operation. Constructs a new Matrix3 when an output
   * argument is not provided.
   */
  hmul(a: number | Matrix3, b: number | Matrix3, out: Matrix3 = Matrix3.new()) {
    return Matrix3.el(mul, a, b, out)
  },

  /**
   * Compute the hadamard (element-wise) quotient of two Matrix3 objects.
   * Number-like arguments are promoted to uniform Matrix3 objects before
   * performing the operation. Constructs a new Matrix3 when an output
   * argument is not provided.
   */
  hdiv(a: number | Matrix3, b: number | Matrix3, out: Matrix3 = Matrix3.new()) {
    return Matrix3.el(div, a, b, out)
  },

  /**
   * Compute the hadamard (element-wise) remainder of two Matrix3 objects.
   * Number-like arguments are promoted to uniform Matrix3 objects before
   * performing the operation. Constructs a new Matrix3 when an output
   * argument is not provided.
   */
  hmod(a: number | Matrix3, b: number | Matrix3, out: Matrix3 = Matrix3.new()) {
    return Matrix3.el(mod, a, b, out)
  },

  /**
   * Compute the standard product of two Matrix3 objects. Number-like arguments are
   * promoted to uniform Matrix3 objects before performing the operation.
   * Constructs a new Matrix3 when an output argument is not provided.
   */
  mul(a: number | Matrix3, b: number | Matrix3, out: Matrix3 = Matrix3.new()) {
    const A  = Matrix3.from(a)
    const B  = Matrix3.from(b)
    const r0 = Matrix3.Get.r0(A)
    const r1 = Matrix3.Get.r1(A)
    const r2 = Matrix3.Get.r2(A)
    const c0 = Matrix3.Get.c0(B)
    const c1 = Matrix3.Get.c1(B)
    const c2 = Matrix3.Get.c2(B)
    Matrix3.Set.xx(out, Vector3.dot(r0, c0))
    Matrix3.Set.xy(out, Vector3.dot(r0, c1))
    Matrix3.Set.xz(out, Vector3.dot(r0, c2))
    Matrix3.Set.yx(out, Vector3.dot(r1, c0))
    Matrix3.Set.yy(out, Vector3.dot(r1, c1))
    Matrix3.Set.yz(out, Vector3.dot(r1, c2))
    Matrix3.Set.zx(out, Vector3.dot(r2, c0))
    Matrix3.Set.zy(out, Vector3.dot(r2, c1))
    Matrix3.Set.zz(out, Vector3.dot(r2, c2))
    return out
  },

  /**
   * Convert a Matrix3 into its string representation.
   * ```js
   * Matrix3.toString([1, 2, 3, 4, 5, 6, 7, 8, 9]) // "mat3<1, 2, 3, 4, 5, 6, 7, 8, 9>"
   * ```
   */
  toString([xx, xy, xz, yx, yy, yz, zx, zy, zz]:  Matrix3) {
    return `mat3<${xx}, ${xy}, ${xz}, ${yx}, ${yy}, ${yz}, ${zx}, ${zy}, ${zz}>` as const
  }
}
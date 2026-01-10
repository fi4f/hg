import { Vector2 } from "./vector2.js";
import { add, sub, mul, div, mod } from "./el.js";

export type Matrix2 = [
  number, number,
  number, number,
]

export const Matrix2 = {
  /** Constant index for the xx-component of a Matrix2 */
  XX: 0 as const,
  /** Constant index for the xy-component of a Matrix2 */
  XY: 1 as const,
  /** Constant index for the yx-component of a Matrix2 */
  YX: 2 as const,
  /** Constant index for the yy-component of a Matrix2 */
  YY: 3 as const,

  /** A collection of getters for Matrix2 objects */
  Get: {
    /** Get the xx-component of a Matrix2 */
    xx(a: Matrix2) { return a[Matrix2.XX] },
    /** Get the xy-component of a Matrix2 */
    xy(a: Matrix2) { return a[Matrix2.XY] },
    /** Get the yx-component of a Matrix2 */
    yx(a: Matrix2) { return a[Matrix2.YX] },
    /** Get the yy-component of a Matrix2 */
    yy(a: Matrix2) { return a[Matrix2.YY] },

    /** Get the 0th row of a Matrix2 as a Vector2 */
    r0(a: Matrix2) { 
      return [ 
        a[Matrix2.XX], 
        a[Matrix2.XY] 
      ] satisfies Vector2 
    },
    /** Get the 1st row of a Matrix2 as a Vector2 */
    r1(a: Matrix2) { 
      return [ 
        a[Matrix2.YX], 
        a[Matrix2.YY] 
      ] satisfies Vector2 
    },
    /** Get the i-th row of a Matrix2 as a Vector2 */
    row(a: Matrix2, i: 0 | 1) { 
      switch(i) {
        case 0: return Matrix2.Get.r0(a)
        case 1: return Matrix2.Get.r1(a)
      }
    },

    /** Get the 0th column of a Matrix2 as a Vector2 */
    c0(a: Matrix2) { 
      return [ 
        a[Matrix2.XX], 
        a[Matrix2.YX] 
      ] satisfies Vector2 
    },
    /** Get the 1st column of a Matrix2 as a Vector2 */
    c1(a: Matrix2) { 
      return [ 
        a[Matrix2.XY], 
        a[Matrix2.YY] 
      ] satisfies Vector2 
    },
    /** Get the j-th column of a Matrix2 as a Vector2 */
    col(a: Matrix2, j: 0 | 1) {
      switch(j) {
        case 0: return Matrix2.Get.c0(a)
        case 1: return Matrix2.Get.c1(a)
      }
    },
  },

  /** A collection of setters for Matrix2 objects */
  Set: {
    /** Set the xx-component of a Matrix2 */
    xx(a: Matrix2, xx: number) { return a[Matrix2.XX] = xx },
    /** Set the xy-component of a Matrix2 */
    xy(a: Matrix2, xy: number) { return a[Matrix2.XY] = xy },
    /** Set the yx-component of a Matrix2 */
    yx(a: Matrix2, yx: number) { return a[Matrix2.YX] = yx },
    /** Set the yy-component of a Matrix2 */
    yy(a: Matrix2, yy: number) { return a[Matrix2.YY] = yy },

    /** Set the 0th row of a Matrix2 */
    r0(a: Matrix2, [xx, xy]: Vector2) {
      a[Matrix2.XX] = xx
      a[Matrix2.XY] = xy
      return [xx, xy] satisfies Vector2
    },
    /** Set the 1st row of a Matrix2 */
    r1(a: Matrix2, [yx, yy]: Vector2) {
      a[Matrix2.YX] = yx
      a[Matrix2.YY] = yy
      return [yx, yy] satisfies Vector2
    },
    /** Set the i-th row of a Matrix2 */
    row(a: Matrix2, i: 0 | 1, ri: Vector2) {
      switch(i) {
        case 0: return Matrix2.Set.r0(a, ri)
        case 1: return Matrix2.Set.r1(a, ri)
      }
    },

    /** Set the 0th column of a Matrix2 */
    c0(a: Matrix2, [xx, yx]: Vector2) {
      a[Matrix2.XX] = xx
      a[Matrix2.YX] = yx
      return [xx, yx] satisfies Vector2
    },
    /** Set the 1st column of a Matrix2 */
    c1(a: Matrix2, [xy, yy]: Vector2) {
      a[Matrix2.XY] = xy
      a[Matrix2.YY] = yy
      return [xy, yy] satisfies Vector2
    },
    /** Set the j-th column of a Matrix2 */
    col(a: Matrix2, j: 0 | 1, cj: Vector2) {
      switch(j) {
        case 0: return Matrix2.Set.c0(a, cj)
        case 1: return Matrix2.Set.c1(a, cj)
      }
    },
  },

  /** Construct an identity Matrix2 with an optional scale factor */
  id(a: number = 1) {
    return [
      a, 0,
      0, a
    ] satisfies Matrix2
  }, 

  /**
   * Construct a Matrix2 from a variadic array of numbers.
   * 
   * Constructs a uniform Matrix2 when `a.length === 1`
   * ```js
   * Matrix2.new(1) // [1, 1, 1, 1]
   * ```
   * 
   * Otherwise constructs a standard zero-padded row-major Matrix2
   * ```js
   * Matrix2.new(          ) // [0, 0, 0, 0]
   * Matrix2.new(1, 2      ) // [1, 2, 0, 0]
   * Matrix2.new(1, 2, 3, 4) // [1, 2, 3, 4]
   */
  new(...a: Array<number>) {
    if (a.length === 1) return [ 
      a[Matrix2.XX]!    , a[Matrix2.XX]!    , 
      a[Matrix2.XX]!    , a[Matrix2.XX]!    
    ] satisfies Matrix2
    else                return [ 
      a[Matrix2.XX] ?? 0, a[Matrix2.XY] ?? 0, 
      a[Matrix2.YX] ?? 0, a[Matrix2.YY] ?? 0 
    ] satisfies Matrix2
  },

  /**
   * Constructs a Matrix2 from a number or an array of numbers.
   * 
   * Constructs a uniform Matrix2 when `a` is a number
   * ```js
   * Matrix2.from(1) // [1, 1, 1, 1]
   * ```
   * 
   * Otherwise constructs a standard zero-padded Matrix2
   * ```js
   * Matrix2.from([          ]) // [0, 0, 0, 0]
   * Matrix2.from([1         ]) // [1, 0, 0, 0]
   * Matrix2.from([1, 2      ]) // [1, 2, 0, 0]
   * Matrix2.from([1, 2, 3, 4]) // [1, 2, 3, 4]
   * ```
   */
  from(a: number | Array<number>) {
    if (typeof a === "number") return [
      a, a,
      a, a
    ] satisfies Matrix2
    else                       return [
      a[Matrix2.XX] ?? 0, a[Matrix2.XY] ?? 0, 
      a[Matrix2.YX] ?? 0, a[Matrix2.YY] ?? 0 
    ] satisfies Matrix2
  },

  /**
   * Perform an element-wise operation on two Matrix2 objects.
   * Number-like arguments are promoted to uniform Matrix2 objects
   * before performing the operation. Constructs a new Matrix2 when an
   * output argument is not provided.
   */
  el(op: (a: number, b: number) => number, a: number | Matrix2, b: number | Matrix2, out: Matrix2 = Matrix2.new()) {
    const [ xxa, xya, yxa, yya ] = Matrix2.from(a)
    const [ xxb, xyb, yxb, yyb ] = Matrix2.from(b)
    Matrix2.Set.xx(out, op(xxa, xxb))
    Matrix2.Set.xy(out, op(xya, xyb))
    Matrix2.Set.yx(out, op(yxa, yxb))
    Matrix2.Set.yy(out, op(yya, yyb))
    return out
  },

  /**
   * Compute the sum of two Matrix2 objects. Number-like arguments are
   * promoted to uniform Matrix2 objects before performing the operation.
   * Constructs a new Matrix2 when an output argument is not provided.
   */
  add(a: number | Matrix2, b: number | Matrix2, out: Matrix2 = Matrix2.new()) {
    return Matrix2.el(add, a, b, out)
  },

  /**
   * Compute the difference of two Matrix2 objects. Number-like arguments
   * are promoted to uniform Matrix2 objects before performing the
   * operation. Constructs a new Matrix2 when an output argument is not
   * provided.
   */
  sub(a: number | Matrix2, b: number | Matrix2, out: Matrix2 = Matrix2.new()) {
    return Matrix2.el(sub, a, b, out)
  },

  /**
   * Compute the hadamard (element-wise) product of two Matrix2 objects.
   * Number-like arguments are promoted to uniform Matrix2 objects before
   * performing the operation. Constructs a new Matrix2 when an output
   * argument is not provided.
   */
  hmul(a: number | Matrix2, b: number | Matrix2, out: Matrix2 = Matrix2.new()) {
    return Matrix2.el(mul, a, b, out)
  },

  /**
   * Compute the hadamard (element-wise) quotient of two Matrix2 objects.
   * Number-like arguments are promoted to uniform Matrix2 objects before
   * performing the operation. Constructs a new Matrix2 when an output
   * argument is not provided.
   */
  hdiv(a: number | Matrix2, b: number | Matrix2, out: Matrix2 = Matrix2.new()) {
    return Matrix2.el(div, a, b, out)
  },

  /**
   * Compute the hadamard (element-wise) remainder of two Matrix2 objects.
   * Number-like arguments are promoted to uniform Matrix2 objects before
   * performing the operation. Constructs a new Matrix2 when an output
   * argument is not provided.
   */
  hmod(a: number | Matrix2, b: number | Matrix2, out: Matrix2 = Matrix2.new()) {
    return Matrix2.el(mod, a, b, out)
  },

  /**
   * Compute the standard product of two Matrix2 objects. Number-like arguments are
   * promoted to uniform Matrix2 objects before performing the operation.
   * Constructs a new Matrix2 when an output argument is not provided.
   */
  mul(a: number | Matrix2, b: number | Matrix2, out: Matrix2 = Matrix2.new()) {
    const A  = Matrix2.from(a)
    const B  = Matrix2.from(b)
    const r0 = Matrix2.Get.r0(A)
    const r1 = Matrix2.Get.r1(A)
    const c0 = Matrix2.Get.c0(B)
    const c1 = Matrix2.Get.c1(B)
    Matrix2.Set.xx(out, Vector2.dot(r0, c0))
    Matrix2.Set.xy(out, Vector2.dot(r0, c1))
    Matrix2.Set.yx(out, Vector2.dot(r1, c0))
    Matrix2.Set.yy(out, Vector2.dot(r1, c1))
    return out
  },

  /**
   * Convert a Matrix2 into its string representation.
   * ```js
   * Matrix2.toString([1, 2, 3, 4]) // "mat2<1, 2, 3, 4>"
   * ```
   */
  toString([xx, xy, yx, yy]:  Matrix2) {
    return `mat2<${xx}, ${xy}, ${yx}, ${yy}>` as const
  }
}
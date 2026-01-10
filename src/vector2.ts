import { add, sub, mul, div, mod } from "./el.js";

export type Vector2 = [number, number]

/** 
 * A collection of constants and functions for constructing and
 * interacting with Vector2 objects.
 */
export const Vector2 = {
  /** Constant index for the x-component of a Vector2 */
  X: 0 as const,
  /** Constant index for the y-component of a Vector2 */
  Y: 1 as const,

  /** A collection of getters for Vector2 objects */
  Get: {
    /** Get the x-component of a Vector2 */
    x(a: Vector2) { return a[Vector2.X] },
    /** Get the y-component of a Vector2 */
    y(a: Vector2) { return a[Vector2.Y] },
  },

  /** A collection of setters for Vector2 objects */
  Set: {
    /** Set the x-component of a Vector2 */
    x(a: Vector2, x: number) { return a[Vector2.X] = x },
    /** Set the y-component of a Vector2 */
    y(a: Vector2, y: number) { return a[Vector2.Y] = y },
  },

  /** Get or set (when `x` is defined) the x-component of a Vector2 */
  x(a: Vector2, x ?: number) {
    if (x === undefined) return Vector2.Get.x(a   )
    else                 return Vector2.Set.x(a, x)
  },

  /** Get or set (when `y` is defined) the y-component of a Vector2 */
  y(a: Vector2, y ?: number) {
    if (y === undefined) return Vector2.Get.y(a   )
    else                 return Vector2.Set.y(a, y)
  },

  /** 
   * Construct a Vector2 from a variadic array of numbers.
   * 
   * Constructs a uniform Vector2 when `a.length === 1`
   * ```js
   * Vector2.new(1) // [1, 1]
   * ```
   * Otherwise constructs a standard zero-padded Vector2
   * ```js
   * Vector2.new(    ) // [0, 0]
   * Vector2.new(1, 2) // [1, 2]
   * ```
   */
  new(...a: Array<number>) {
    if (a.length === 1) return [ 
      a[Vector2.X]!    , 
      a[Vector2.X]!     
    ] satisfies Vector2
    else                return [ 
      a[Vector2.X] ?? 0, 
      a[Vector2.Y] ?? 0 
    ] satisfies Vector2
  },

  /**
   * Constructs a Vector2 from a number or an array of numbers.
   * 
   * Constructs a uniform Vector2 when `a` is a number
   * ```js
   * Vector2.from(1) // [1, 1]
   * ```
   * Otherwise constructs a standard zero-padded Vector2
   * ```js
   * Vector2.from([    ]) // [0, 0]
   * Vector2.from([1   ]) // [1, 0]
   * Vector2.from([1, 2]) // [1, 2]
   * ```
   */
  from(a: number | Array<number>) {
    if (typeof a === "number") return [ 
      a                , 
      a                 
    ] satisfies Vector2
    else                       return [ 
      a[Vector2.X] ?? 0, 
      a[Vector2.Y] ?? 0 
    ] satisfies Vector2
  },

  /**
   * Perform an element-wise operation on two Vector2 objects.
   * Number-like arguments are promoted to uniform Vector2 objects
   * before performing the operation. Constructs a new Vector2 when an
   * output argument is not provided.
   */
  el(op: (a: number, b: number) => number, a: number | Vector2, b: number | Vector2, out: Vector2 = Vector2.new()) {
    const [ xa, ya ] = Vector2.from(a)
    const [ xb, yb ] = Vector2.from(b)
    Vector2.Set.x(out, op(xa, xb))
    Vector2.Set.y(out, op(ya, yb))
    return out
  },

  /** 
   * Compute the sum of two Vector2 objects. Number-like arguments are
   * promoted to uniform Vector2 objects before performing the operation.
   * Constructs a new Vector2 when an output argument is not provided.
   */
  add(a: number | Vector2, b: number | Vector2, out: Vector2 = Vector2.new()) {
    return Vector2.el(add, a, b, out)
  },

  /** 
   * Compute the difference of two Vector2 objects. Number-like arguments
   * are promoted to uniform Vector2 objects before performing the
   * operation. Constructs a new Vector2 when an output argument is not
   * provided.
   */
  sub(a: number | Vector2, b: number | Vector2, out: Vector2 = Vector2.new()) {
    return Vector2.el(sub, a, b, out)
  },

  /** 
   * Compute the hadamard (element-wise) product of two Vector2 objects.
   * Number-like arguments are promoted to uniform Vector2 objects before
   * performing the operation. Constructs a new Vector2 when an output
   * argument is not provided.
   */
  hmul(a: number | Vector2, b: number | Vector2, out: Vector2 = Vector2.new()) {
    return Vector2.el(mul, a, b, out)
  },

  /** 
   * Compute the hadamard (element-wise) quotient of two Vector2 objects.
   * Number-like arguments are promoted to uniform Vector2 objects before
   * performing the operation. Constructs a new Vector2 when an output
   * argument is not provided.
   */
  hdiv(a: number | Vector2, b: number | Vector2, out: Vector2 = Vector2.new()) {
    return Vector2.el(div, a, b, out)
  },

  /** 
   * Compute the hadamard (element-wise) remainder of two Vector2 objects.
   * Number-like arguments are promoted to uniform Vector2 objects before
   * performing the operation. Constructs a new Vector2 when an output
   * argument is not provided.
   */
  hmod(a: number | Vector2, b: number | Vector2, out: Vector2 = Vector2.new()) {
    return Vector2.el(mod, a, b, out)
  },

  /** 
   * Compute the dot product of two Vector2 objects, or simply the
   * dot product of `a` with itself when `b` is not defined. Number-like
   * arguments are promoted to uniform Vector2 objects before performing
   * the operation.
   */
  dot(a: number | Vector2, b: number | Vector2 = a) {
    const [xa, ya] = Vector2.from(a)
    const [xb, yb] = Vector2.from(b)
    return xa * xb + ya * yb
  },

  /**
   * Convert a Vector2 into its string representation. Number-like
   * arguments are promoted to uniform Vector2 objects before performing
   * the operation.
   * ```js
   * Vector2.toString([1, 2]) // "vec2<1, 2>"
   * ```
   */
  toString(a: number | Vector2) {
    const [x, y] = Vector2.from(a)
    return `vec2<${x}, ${y}>` as const
  }
}
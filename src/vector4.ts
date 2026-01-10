import { add, sub, mul, div, mod } from "./el.js";

export type Vector4 = [number, number, number, number]

/**
 * A collection of constants and functions for constructing and
 * interacting with Vector4 objects.
 */
export const Vector4 = {
  /** Constant index for the x-component of a Vector4 */
  X: 0 as const,
  /** Constant index for the y-component of a Vector4 */
  Y: 1 as const,
  /** Constant index for the z-component of a Vector4 */
  Z: 2 as const,
  /** Constant index for the w-component of a Vector4 */
  W: 3 as const,

  /** A collection of getters for Vector4 objects */
  Get: {
    /** Get the x-component of a Vector4 */
    x(a: Vector4) { return a[Vector4.X] },
    /** Get the y-component of a Vector4 */
    y(a: Vector4) { return a[Vector4.Y] },
    /** Get the z-component of a Vector4 */
    z(a: Vector4) { return a[Vector4.Z] },
    /** Get the w-component of a Vector4 */
    w(a: Vector4) { return a[Vector4.W] },
  },

  Set: {
    /** Set the x-component of a Vector4 */
    x(a: Vector4, x: number) { return a[Vector4.X] = x },
    /** Set the y-component of a Vector4 */
    y(a: Vector4, y: number) { return a[Vector4.Y] = y },
    /** Set the z-component of a Vector4 */
    z(a: Vector4, z: number) { return a[Vector4.Z] = z },
    /** Set the w-component of a Vector4 */
    w(a: Vector4, w: number) { return a[Vector4.W] = w },
  },

  /** Get or set (when `x` is defined) the x-component of a Vector4 */
  x(a: Vector4, x ?: number) {
    if (x === undefined) return Vector4.Get.x(a   )
    else                 return Vector4.Set.x(a, x)
  },

  /** Get or set (when `y` is defined) the y-component of a Vector4 */
  y(a: Vector4, y ?: number) {
    if (y === undefined) return Vector4.Get.y(a   )
    else                 return Vector4.Set.y(a, y)
  },

  /** Get or set (when `z` is defined) the z-component of a Vector4 */
  z(a: Vector4, z ?: number) {
    if (z === undefined) return Vector4.Get.z(a   )
    else                 return Vector4.Set.z(a, z)
  },

  /** Get or set (when `w` is defined) the w-component of a Vector4 */
  w(a: Vector4, w ?: number) {
    if (w === undefined) return Vector4.Get.w(a   )
    else                 return Vector4.Set.w(a, w)
  },

  /**
   * Construct a Vector4 from a variadic array of numbers.
   * 
   * Constructs a uniform Vector4 when `a.length === 1`
   * ```js
   * Vector4.new(1) // [1, 1, 1, 1]
   * ```
   * 
   * Otherwise constructs a standard zero-padded Vector4
   * ```js
   * Vector4.new(          ) // [0, 0, 0, 0]
   * Vector4.new(1, 2      ) // [1, 2, 0, 0]
   * Vector4.new(1, 2, 3   ) // [1, 2, 3, 0]
   * Vector4.new(1, 2, 3, 4) // [1, 2, 3, 4]
   * ```
   */
  new(...a: Array<number >) {
    if (a.length === 1) return [ 
      a[Vector4.X]!    , 
      a[Vector4.X]!    , 
      a[Vector4.X]!    , 
      a[Vector4.X]!     
    ] satisfies Vector4
    else                return [ 
      a[Vector4.X] ?? 0, 
      a[Vector4.Y] ?? 0, 
      a[Vector4.Z] ?? 0, 
      a[Vector4.W] ?? 0 
    ] satisfies Vector4
  },

  /**
   * Constructs a Vector4 from a number or an array of numbers.
   * 
   * Constructs a uniform Vector4 when `a` is a number
   * ```js
   * Vector4.from(1) // [1, 1, 1, 1]
   * ```
   * 
   * Otherwise constructs a standard zero-padded Vector4
   * ```js
   * Vector4.from([          ]) // [0, 0, 0, 0]
   * Vector4.from([1         ]) // [1, 0, 0, 0]
   * Vector4.from([1, 2      ]) // [1, 2, 0, 0]
   * Vector4.from([1, 2, 3   ]) // [1, 2, 3, 0]
   * Vector4.from([1, 2, 3, 4]) // [1, 2, 3, 4]
   * ```
   */
  from(a: number | Array<number>) {
    if (typeof a === "number") return [ 
      a                , 
      a                , 
      a                , 
      a                 
    ] satisfies Vector4
    else                       return [ 
      a[Vector4.X] ?? 0, 
      a[Vector4.Y] ?? 0, 
      a[Vector4.Z] ?? 0, 
      a[Vector4.W] ?? 0 
    ] satisfies Vector4
  },

  /**
   * Perform an element-wise operation on two Vector4 objects.
   * Number-like arguments are promoted to uniform Vector4 objects
   * before performing the operation. Constructs a new Vector4 when an
   * output argument is not provided.
   */
  el(op: (a: number, b: number) => number, a: number | Vector4, b: number | Vector4, out: Vector4 = Vector4.new()) {
    const [ xa, ya, za, wa ] = Vector4.from(a)
    const [ xb, yb, zb, wb ] = Vector4.from(b)
    Vector4.Set.x(out, op(xa, xb))
    Vector4.Set.y(out, op(ya, yb))
    Vector4.Set.z(out, op(za, zb))
    Vector4.Set.w(out, op(wa, wb))
    return out
  },

  /**
   * Compute the sum of two Vector4 objects. Number-like arguments are
   * promoted to uniform Vector4 objects before performing the operation.
   * Constructs a new Vector4 when an output argument is not provided.
   */
  add(a: number | Vector4, b: number | Vector4, out: Vector4 = Vector4.new()) {
    return Vector4.el(add, a, b, out)
  },

  /**
   * Compute the difference of two Vector4 objects. Number-like arguments
   * are promoted to uniform Vector4 objects before performing the
   * operation. Constructs a new Vector4 when an output argument is not
   * provided.
   */
  sub(a: number | Vector4, b: number | Vector4, out: Vector4 = Vector4.new()) {
    return Vector4.el(sub, a, b, out)
  },

  /**
   * Compute the hadamard (element-wise) product of two Vector4 objects.
   * Number-like arguments are promoted to uniform Vector4 objects before
   * performing the operation. Constructs a new Vector4 when an output
   * argument is not provided.
   */
  hmul(a: number | Vector4, b: number | Vector4, out: Vector4 = Vector4.new()) {
    return Vector4.el(mul, a, b, out)
  },

  /**
   * Compute the hadamard (element-wise) quotient of two Vector4 objects.
   * Number-like arguments are promoted to uniform Vector4 objects before
   * performing the operation. Constructs a new Vector4 when an output
   * argument is not provided.
   */
  hdiv(a: number | Vector4, b: number | Vector4, out: Vector4 = Vector4.new()) {
    return Vector4.el(div, a, b, out)
  },

  /**
   * Compute the hadamard (element-wise) remainder of two Vector4 objects.
   * Number-like arguments are promoted to uniform Vector4 objects before
   * performing the operation. Constructs a new Vector4 when an output
   * argument is not provided.
   */
  hmod(a: number | Vector4, b: number | Vector4, out: Vector4 = Vector4.new()) {
    return Vector4.el(mod, a, b, out)
  },

  /**
   * Compute the dot product of two Vector4 objects, or simply the
   * dot product of `a` with itself when `b` is not defined. Number-like
   * arguments are promoted to uniform Vector4 objects before performing
   * the operation.
   */
  dot(a: number | Vector4, b: number | Vector4 = a) {
    const [xa, ya, za, wa] = Vector4.from(a)
    const [xb, yb, zb, wb] = Vector4.from(b)
    return xa * xb + ya * yb + za * zb + wa * wb
  },

  /**
   * Convert a Vector4 into its string representation. Number-like
   * arguments are promoted to uniform Vector4 objects before performing
   * the operation.
   * ```js
   * Vector4.toString([1, 2, 3, 4]) // "vec4<1, 2, 3, 4>"
   * ```
   */
  toString(a: number | Vector4) {
    const [x, y, z, w] = Vector4.from(a)
    return `vec4<${x}, ${y}, ${z}, ${w}>` as const
  }
}
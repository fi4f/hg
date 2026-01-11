import { add, sub, mul, div, mod } from "./el.js";

export type Vector3 = [number, number, number]

/**
 * A collection of constants and functions for constructing and
 * interacting with Vector3 objects.
 */
export const Vector3 = {
  /** Constant index for the x-component of a Vector3 */
  X: 0 as const,
  /** Constant index for the y-component of a Vector3 */
  Y: 1 as const,
  /** Constant index for the z-component of a Vector3 */
  Z: 2 as const,

  /** A collection of getters for Vector3 objects */
  Get: {
    /** Get the x-component of a Vector3 */
    x(a: Vector3) { return a[Vector3.X] },
    /** Get the y-component of a Vector3 */
    y(a: Vector3) { return a[Vector3.Y] },
    /** Get the z-component of a Vector3 */
    z(a: Vector3) { return a[Vector3.Z] },
  },

  /** A collection of setters for Vector3 objects */
  Set: {
    /** Set the x-component of a Vector3 */
    x(a: Vector3, x: number) { return a[Vector3.X] = x },
    /** Set the y-component of a Vector3 */
    y(a: Vector3, y: number) { return a[Vector3.Y] = y },
    /** Set the z-component of a Vector3 */
    z(a: Vector3, z: number) { return a[Vector3.Z] = z },
  },

  /** Get or set (when `x` is defined) the x-component of a Vector3 */
  x(a: Vector3, x ?: number) {
    if (x === undefined) return Vector3.Get.x(a   )
    else                 return Vector3.Set.x(a, x)
  },

  /** Get or set (when `y` is defined) the y-component of a Vector3 */
  y(a: Vector3, y ?: number) {
    if (y === undefined) return Vector3.Get.y(a   )
    else                 return Vector3.Set.y(a, y)
  },

  /** Get or set (when `z` is defined) the z-component of a Vector3 */
  z(a: Vector3, z ?: number) {
    if (z === undefined) return Vector3.Get.z(a   )
    else                 return Vector3.Set.z(a, z)
  },

  /**
   * Construct a Vector3 from a variadic array of numbers.
   * 
   * Constructs a uniform Vector3 when `a.length === 1`
   * ```js
   * Vector3.new(1) // [1, 1, 1]
   * ```
   * 
   * Otherwise constructs a standard zero-padded Vector3
   * ```js
   * Vector3.new(       ) // [0, 0, 0]
   * Vector3.new(1, 2   ) // [1, 2, 0]
   * Vector3.new(1, 2, 3) // [1, 2, 3]
   * ```
   */
  new(...a: Array<number>) {
    if (a.length === 1) return [ 
      a[Vector3.X]!    , 
      a[Vector3.X]!    , 
      a[Vector3.X]!     
    ] satisfies Vector3
    else                return [ 
      a[Vector3.X] ?? 0, 
      a[Vector3.Y] ?? 0, 
      a[Vector3.Z] ?? 0 
    ] satisfies Vector3
  },

  /**
   * Constructs a Vector3 from a number or an array of numbers.
   * 
   * Constructs a uniform Vector3 when `a` is a number
   * ```js
   * Vector3.from(1) // [1, 1, 1]
   * ```
   * 
   * Otherwise constructs a standard zero-padded Vector3
   * ```js
   * Vector3.from([       ]) // [0, 0, 0]
   * Vector3.from([1      ]) // [1, 0, 0]
   * Vector3.from([1, 2   ]) // [1, 2, 0]
   * Vector3.from([1, 2, 3]) // [1, 2, 3]
   * ```
   */
  from(a: number | Array<number>) {
    if (typeof a === "number") return [ 
      a                , 
      a                , 
      a                 
    ] satisfies Vector3
    else                       return [ 
      a[Vector3.X] ?? 0, 
      a[Vector3.Y] ?? 0, 
      a[Vector3.Z] ?? 0 
    ] satisfies Vector3
  },

  /**
   * Perform an element-wise operation on two Vector3 objects.
   * Number-like arguments are promoted to uniform Vector3 objects
   * before performing the operation. Constructs a new Vector3 when an
   * output argument is not provided.
   */
  el(op: (a: number, b: number) => number, a: number | Vector3, b: number | Vector3, out: Vector3 = Vector3.new()) {
    const [ xa, ya, za ] = Vector3.from(a)
    const [ xb, yb, zb ] = Vector3.from(b)
    Vector3.Set.x(out, op(xa, xb))
    Vector3.Set.y(out, op(ya, yb))
    Vector3.Set.z(out, op(za, zb))
    return out
  },

  /**
   * Compute the sum of two Vector3 objects. Number-like arguments are
   * promoted to uniform Vector3 objects before performing the operation.
   * Constructs a new Vector3 when an output argument is not provided.
   */
  add(a: number | Vector3, b: number | Vector3, out: Vector3 = Vector3.new()) {
    return Vector3.el(add, a, b, out)
  },

  /**
   * Compute the difference of two Vector3 objects. Number-like arguments
   * are promoted to uniform Vector3 objects before performing the
   * operation. Constructs a new Vector3 when an output argument is not
   * provided.
   */
  sub(a: number | Vector3, b: number | Vector3, out: Vector3 = Vector3.new()) {
    return Vector3.el(sub, a, b, out)
  },

  /**
   * Compute the hadamard (element-wise) product of two Vector3 objects.
   * Number-like arguments are promoted to uniform Vector3 objects before
   * performing the operation. Constructs a new Vector3 when an output
   * argument is not provided.
   */
  hmul(a: number | Vector3, b: number | Vector3, out: Vector3 = Vector3.new()) {
    return Vector3.el(mul, a, b, out)
  },

  /**
   * Compute the hadamard (element-wise) quotient of two Vector3 objects.
   * Number-like arguments are promoted to uniform Vector3 objects before
   * performing the operation. Constructs a new Vector3 when an output
   * argument is not provided.
   */
  hdiv(a: number | Vector3, b: number | Vector3, out: Vector3 = Vector3.new()) {
    return Vector3.el(div, a, b, out)
  },

  /**
   * Compute the hadamard (element-wise) remainder of two Vector3 objects.
   * Number-like arguments are promoted to uniform Vector3 objects before
   * performing the operation. Constructs a new Vector3 when an output
   * argument is not provided.
   */
  hmod(a: number | Vector3, b: number | Vector3, out: Vector3 = Vector3.new()) {
    return Vector3.el(mod, a, b, out)
  },

  /**
   * Compute the dot product of two Vector3 objects, or simply the
   * dot product of `a` with itself when `b` is not defined. Number-like
   * arguments are promoted to uniform Vector3 objects before performing
   * the operation.
   */
  dot(a: number | Vector3, b: number | Vector3 = a) {
    const [xa, ya, za] = Vector3.from(a)
    const [xb, yb, zb] = Vector3.from(b)
    return xa * xb + ya * yb + za * zb
  },

  /**
   * Convert a Vector3 into its string representation.
   * ```js
   * Vector3.toString([1, 2, 3]) // "vec3<1, 2, 3>"
   * ```
   */
  toString([x, y, z]:  Vector3) {
    return `vec3<${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)}>` as const
  }
}
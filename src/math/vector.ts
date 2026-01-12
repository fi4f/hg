export const Vector = {
  X: 0 as const,
  Y: 1 as const,
  Z: 2 as const,
  W: 3 as const,

  Get: {
    x(a: number | Array<number>) { return typeof a === "number" ? a : a[Vector.X] ?? 0 },
    y(a: number | Array<number>) { return typeof a === "number" ? a : a[Vector.Y] ?? 0 },
    z(a: number | Array<number>) { return typeof a === "number" ? a : a[Vector.Z] ?? 0 },
    w(a: number | Array<number>) { return typeof a === "number" ? a : a[Vector.W] ?? 0 },
    n(a: number | Array<number>) { return typeof a === "number" ? 1 : a.length }
  },

  Set: {
    x(a: number | Array<number>, x: number) { return typeof a === "number" ? x : a[Vector.X] = x },
    y(a: number | Array<number>, y: number) { return typeof a === "number" ? y : a[Vector.Y] = y },
    z(a: number | Array<number>, z: number) { return typeof a === "number" ? z : a[Vector.Z] = z },
    w(a: number | Array<number>, w: number) { return typeof a === "number" ? w : a[Vector.W] = w },
  },

  x(a: number | Array<number>, x ?: number) {
    if (x === undefined) return Vector.Get.x(a   )
    else                 return Vector.Set.x(a, x)
  },

  y(a: number | Array<number>, y ?: number) {
    if (y === undefined) return Vector.Get.y(a   )
    else                 return Vector.Set.y(a, y)
  },

  z(a: number | Array<number>, z ?: number) {
    if (z === undefined) return Vector.Get.z(a   )
    else                 return Vector.Set.z(a, z)
  },

  w(a: number | Array<number>, w ?: number) {
    if (w === undefined) return Vector.Get.w(a   )
    else                 return Vector.Set.w(a, w)
  },

  n(a: number | Array<number>) {
    return Vector.Get.n(a)
  }
}
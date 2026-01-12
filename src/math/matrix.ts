import { Vector } from "./vector.js"

export const Matrix = {
  Get: {
    xx(a: number | Array<Array<number>>) { return typeof a === "number" ? a : a[Vector.X]?.[Vector.X] ?? 0 },
    xy(a: number | Array<Array<number>>) { return typeof a === "number" ? a : a[Vector.X]?.[Vector.Y] ?? 0 },
    xz(a: number | Array<Array<number>>) { return typeof a === "number" ? a : a[Vector.X]?.[Vector.Z] ?? 0 },
    xw(a: number | Array<Array<number>>) { return typeof a === "number" ? a : a[Vector.X]?.[Vector.W] ?? 0 },

    yx(a: number | Array<Array<number>>) { return typeof a === "number" ? a : a[Vector.Y]?.[Vector.X] ?? 0 },
    yy(a: number | Array<Array<number>>) { return typeof a === "number" ? a : a[Vector.Y]?.[Vector.Y] ?? 0 },
    yz(a: number | Array<Array<number>>) { return typeof a === "number" ? a : a[Vector.Y]?.[Vector.Z] ?? 0 },
    yw(a: number | Array<Array<number>>) { return typeof a === "number" ? a : a[Vector.Y]?.[Vector.W] ?? 0 },

    zx(a: number | Array<Array<number>>) { return typeof a === "number" ? a : a[Vector.Z]?.[Vector.X] ?? 0 },
    zy(a: number | Array<Array<number>>) { return typeof a === "number" ? a : a[Vector.Z]?.[Vector.Y] ?? 0 },
    zz(a: number | Array<Array<number>>) { return typeof a === "number" ? a : a[Vector.Z]?.[Vector.Z] ?? 0 },
    zw(a: number | Array<Array<number>>) { return typeof a === "number" ? a : a[Vector.Z]?.[Vector.W] ?? 0 },

    wx(a: number | Array<Array<number>>) { return typeof a === "number" ? a : a[Vector.W]?.[Vector.X] ?? 0 },
    wy(a: number | Array<Array<number>>) { return typeof a === "number" ? a : a[Vector.W]?.[Vector.Y] ?? 0 },
    wz(a: number | Array<Array<number>>) { return typeof a === "number" ? a : a[Vector.W]?.[Vector.Z] ?? 0 },
    ww(a: number | Array<Array<number>>) { return typeof a === "number" ? a : a[Vector.W]?.[Vector.W] ?? 0 },

    /** Get the number of rows of a Matrix */
    m(a: number | Array<Array<number>>) { return typeof a === "number" ? 1 : a    .length      },

    /** Get the number of cols of a Matrix */
    n(a: number | Array<Array<number>>) { return typeof a === "number" ? 1 : a[0]?.length ?? 0 },
  },

  Set: {
    xx(a: number | Array<Array<number>>, xx: number) { return typeof a === "number" ? xx : a[Vector.X][Vector.X] = xx },
  }
}
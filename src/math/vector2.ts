import { Vector } from "./vector.js"


export type Vector2 = [number, number]

export const Vector2 = {
  new(...a: Array<number>) {
    if (a.length === 1) return [
      Vector.Get.x(a),
      Vector.Get.x(a)
    ] satisfies Vector2

    else                return [
      Vector.Get.x(a),
      Vector.Get.y(a)
    ] satisfies Vector2
  },

  add(a: number | Array<number>, b: number | Array<number>) {
    return [
      Vector.Get.x(a) + Vector.Get.x(b),
      Vector.Get.y(a) + Vector.Get.y(b)
    ] satisfies Vector2
  },

  sub(a: number | Array<number>, b: number | Array<number>) {
    return [
      Vector.Get.x(a) - Vector.Get.x(b),
      Vector.Get.y(a) - Vector.Get.y(b)
    ] satisfies Vector2
  },

  mul(a: number | Array<number>, b: number | Array<number>) {
    return [
      Vector.Get.x(a) * Vector.Get.x(b),
      Vector.Get.y(a) * Vector.Get.y(b)
    ] satisfies Vector2
  },

  div(a: number | Array<number>, b: number | Array<number>) {
    return [
      Vector.Get.x(a) / Vector.Get.x(b),
      Vector.Get.y(a) / Vector.Get.y(b)
    ] satisfies Vector2
  },

  mod(a: number | Array<number>, b: number | Array<number>) {
    return [
      Vector.Get.x(a) % Vector.Get.x(b),
      Vector.Get.y(a) % Vector.Get.y(b)
    ] satisfies Vector2
  },

  dot(a: number | Array<number>, b: number | Array<number> = a) {
    return (
      Vector.Get.x(a) * Vector.Get.x(b) +
      Vector.Get.y(a) * Vector.Get.y(b)
    )
  },

  toString(a: number | Array<number>) {
    const x = Vector.Get.x(a)
    const y = Vector.Get.y(a)
    return `vec2<${x}, ${y}>` as const
  }
}
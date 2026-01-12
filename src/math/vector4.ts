import type { Plain } from "../hg.js"
import { Vector } from "./vector.js"

export type Vector4 = Plain<[number, number, number, number]>

export const Vector4 = {
  new(...a: Array<number>) {
    if (a.length === 1) return [
      Vector.Get.x(a),
      Vector.Get.x(a),
      Vector.Get.x(a),
      Vector.Get.x(a)
    ] satisfies Vector4

    else                return [
      Vector.Get.x(a),
      Vector.Get.y(a),
      Vector.Get.z(a),
      Vector.Get.w(a)
    ] satisfies Vector4
  },

  add(a: number | Array<number>, b: number | Array<number>) {
    return [
      Vector.Get.x(a) + Vector.Get.x(b),
      Vector.Get.y(a) + Vector.Get.y(b),
      Vector.Get.z(a) + Vector.Get.z(b),
      Vector.Get.w(a) + Vector.Get.w(b)
    ] satisfies Vector4
  },

  sub(a: number | Array<number>, b: number | Array<number>) {
    return [
      Vector.Get.x(a) - Vector.Get.x(b),
      Vector.Get.y(a) - Vector.Get.y(b),
      Vector.Get.z(a) - Vector.Get.z(b),
      Vector.Get.w(a) - Vector.Get.w(b)
    ] satisfies Vector4
  },

  mul(a: number | Array<number>, b: number | Array<number>) {
    return [
      Vector.Get.x(a) * Vector.Get.x(b),
      Vector.Get.y(a) * Vector.Get.y(b),
      Vector.Get.z(a) * Vector.Get.z(b),
      Vector.Get.w(a) * Vector.Get.w(b)
    ] satisfies Vector4
  },

  div(a: number | Array<number>, b: number | Array<number>) {
    return [
      Vector.Get.x(a) / Vector.Get.x(b),
      Vector.Get.y(a) / Vector.Get.y(b),
      Vector.Get.z(a) / Vector.Get.z(b),
      Vector.Get.w(a) / Vector.Get.w(b)
    ] satisfies Vector4
  },

  mod(a: number | Array<number>, b: number | Array<number>) {
    return [
      Vector.Get.x(a) % Vector.Get.x(b),
      Vector.Get.y(a) % Vector.Get.y(b),
      Vector.Get.z(a) % Vector.Get.z(b),
      Vector.Get.w(a) % Vector.Get.w(b)
    ] satisfies Vector4
  },

  dot(a: number | Array<number>, b: number | Array<number> = a) {
    return (
      Vector.Get.x(a) * Vector.Get.x(b) +
      Vector.Get.y(a) * Vector.Get.y(b) +
      Vector.Get.z(a) * Vector.Get.z(b) +
      Vector.Get.w(a) * Vector.Get.w(b)
    )
  },

  hom(a: number | Array<number>) {
    return [
      Vector.Get.x(a),
      Vector.Get.y(a),
      Vector.Get.z(a),
      1
    ] satisfies Vector4
  },

  toString(a: number | Array<number>) {
    const x = Vector.Get.x(a)
    const y = Vector.Get.y(a)
    const z = Vector.Get.z(a)
    const w = Vector.Get.w(a)
    return `vec4<${x}, ${y}, ${z}, ${w}>` as const
  }
}
import type { Plain } from "../hg.js"
import { Vector } from "./vector.js"

export type Vector3 = [number, number, number]

export const Vector3 = {
  new(...a: Array<number>) {
    if (a.length === 1) return [
      Vector.Get.x(a),
      Vector.Get.x(a),
      Vector.Get.x(a)
    ] satisfies Vector3

    else                return [
      Vector.Get.x(a),
      Vector.Get.y(a),
      Vector.Get.z(a)
    ] satisfies Vector3
  },

  add(a: number | Array<number>, b: number | Array<number>) {
    return [
      Vector.Get.x(a) + Vector.Get.x(b),
      Vector.Get.y(a) + Vector.Get.y(b),
      Vector.Get.z(a) + Vector.Get.z(b)
    ] satisfies Vector3
  },

  sub(a: number | Array<number>, b: number | Array<number>) {
    return [
      Vector.Get.x(a) - Vector.Get.x(b),
      Vector.Get.y(a) - Vector.Get.y(b),
      Vector.Get.z(a) - Vector.Get.z(b)
    ] satisfies Vector3
  },

  mul(a: number | Array<number>, b: number | Array<number>) {
    return [
      Vector.Get.x(a) * Vector.Get.x(b),
      Vector.Get.y(a) * Vector.Get.y(b),
      Vector.Get.z(a) * Vector.Get.z(b)
    ] satisfies Vector3
  },

  div(a: number | Array<number>, b: number | Array<number>) {
    return [
      Vector.Get.x(a) / Vector.Get.x(b),
      Vector.Get.y(a) / Vector.Get.y(b),
      Vector.Get.z(a) / Vector.Get.z(b)
    ] satisfies Vector3
  },

  mod(a: number | Array<number>, b: number | Array<number>) {
    return [
      Vector.Get.x(a) % Vector.Get.x(b),
      Vector.Get.y(a) % Vector.Get.y(b),
      Vector.Get.z(a) % Vector.Get.z(b)
    ] satisfies Vector3
  },

  dot(a: number | Array<number>, b: number | Array<number> = a) {
    return (
      Vector.Get.x(a) * Vector.Get.x(b) +
      Vector.Get.y(a) * Vector.Get.y(b) +
      Vector.Get.z(a) * Vector.Get.z(b)
    )
  },

  hom(a: number | Array<number>) {
    return [
      Vector.Get.x(a),
      Vector.Get.y(a),
      1
    ] satisfies Vector3
  },

  toString(a: number | Array<number>) {
    const x = Vector.Get.x(a)
    const y = Vector.Get.y(a)
    const z = Vector.Get.z(a)
    return `vec3<${x}, ${y}, ${z}>` as const
  }
}
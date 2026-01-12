import { Version } from "./version.js";

export const VERSION = Version.new({
  moniker: "hg",
  major  : 0,
  minor  : 0,
  patch  : 1,
})

// forward core exports
export * from "./data/plain.js"
export * from "./stage.js"
export * from "./scene.js"
export * from "./event.js"
export * from "./asset.js"
export * from "./input.js"
export * from "./frames.js"
export * from "./sprite.js"
export * from "./id.js"

// forward math exports
export * from "./vector2.js"
export * from "./vector3.js"
export * from "./vector4.js"
export * from "./matrix2.js"
export * from "./matrix3.js"
export * from "./matrix4.js"

// forward util exports
export * from "./version.js"
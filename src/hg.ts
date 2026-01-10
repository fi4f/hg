import { Version } from "./util/version.js";

export const VERSION = Version.new({
  moniker: "hg",
  major  : 0,
  minor  : 0,
  patch  : 1,
})

// forward core exports
export * from "./core/stage.js"
export * from "./core/scene.js"
export * from "./core/event.js"
export * from "./core/asset.js"
export * from "./core/cache.js"
export * from "./core/index.js"

// forward math exports
export * from "./math/vector2.js"
export * from "./math/vector3.js"
export * from "./math/vector4.js"
export * from "./math/matrix2.js"
export * from "./math/matrix3.js"
export * from "./math/matrix4.js"

// forward util exports
export * from "./util/version.js"
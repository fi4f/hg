import { Version } from "./version.js";

export const VERSION = Version.new({
  moniker: "hg",
  major  : 0,
  minor  : 0,
  patch  : 1,
})

console.log(Version.toString(VERSION))



export * from "./version.js"

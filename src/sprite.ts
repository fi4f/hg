import type { Frame } from "./frames.js"
import type { Scene } from "./scene.js"

export type Sprite = {
  frames: Array<Frame>

  atlas: HTMLImageElement
  state: "playing" | "stopped" | "looping"
  frame: number
  speed: number
}



export const Sprite = {
  /** Check if a sprite is playing. Returns `true` if the sprite is *not* stopped. */
  isPlaying(sprite: Sprite) {
    return sprite.state !== "stopped"
  },

  /** Check if a sprite is stopped. Returns `true` if the sprite is stopped. */
  isStopped(sprite: Sprite) {
    return sprite.state === "stopped"
  },

  /** Check if a sprite is looping. Returns `true` if the sprite is looping. */
  isLooping(sprite: Sprite) {
    return sprite.state === "looping"
  },
  
  stop(sprite: Sprite, o ?: { frame ?: number, speed ?: number }) {

  },

  play(sprite: Sprite, o ?: { frame ?: number, speed ?: number }) {

  },


  loop(sprite: Sprite, o ?: { frame ?: number, speed ?: number }) {

  },

  draw(context: Scene.RenderContext, sprite: Sprite) {}
  
}





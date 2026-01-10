import { Frame, Frames } from "./frames.js"
import type { Scene  } from "./scene.js"

export type Sprite = {
  frames: Array<Frame>
  state: "playing" | "stopped" | "looping"
  frame: number
  speed: number

  x: number
  y: number
  w: number
  h: number
}

export const Sprite = {
  new(frames: Array<Frame>, w ?: number, h ?: number) {
    w ??= frames[0]?.sw ?? 0
    h ??= frames[0]?.sh ?? 0
    return {
      frames,
      state: "stopped",
      frame: 0,
      speed: 1,
      x: 0, 
      y: 0,
      w, h,
    } satisfies Sprite
  },

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
    if (o?.frame !== undefined) 
      sprite.frame = wrap(o.frame, sprite.frames.length)

    if (o?.speed !== undefined) 
      sprite.speed = o.speed

    sprite.state = "stopped"
  },

  play(sprite: Sprite, o ?: { frame ?: number, speed ?: number }) {
    if (o?.frame !== undefined) 
      sprite.frame = wrap(o.frame, sprite.frames.length)

    if (o?.speed !== undefined) 
      sprite.speed = o.speed

    sprite.state = "playing"
  },

  loop(sprite: Sprite, o ?: { frame ?: number, speed ?: number }) {
    if (o?.frame !== undefined) 
      sprite.frame = wrap(o.frame, sprite.frames.length)

    if (o?.speed !== undefined) 
      sprite.speed = o.speed

    sprite.state = "looping"
  },

  draw(context: Scene.RenderContext, sprite: Sprite) {
    if (sprite.state !== "stopped")
      sprite.frame += sprite.speed * context.dt

    if (sprite.state === "playing") {
      sprite.frame = clamp(sprite.frame, sprite.frames.length)
      if (
        sprite.frame <=                    0 || 
        sprite.frame >= sprite.frames.length
      ) sprite.state = "stopped"
    }

    if (sprite.state === "looping")
      sprite.frame =  wrap(sprite.frame, sprite.frames.length)

    Frames.draw(context, sprite.frames, Math.floor(sprite.frame),
      sprite.x, sprite.y, 
      sprite.w, sprite.h
    )
  }
}

function  wrap(n: number, m: number) {
  return (n % m + m) % m
}

function clamp(n: number, m: number) {
  return Math.max(0, Math.min(n, m))
}
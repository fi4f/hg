import type { Scene } from "./core/scene.js"


const PLAYING =  1 // play once
const STOPPED =  0
const LOOPING = -1


export type Sprite = {
  frames: Array<Sprite.Frame>
  atlas : HTMLImageElement
  state : number,
  speed : number,
  frame : number,
  x: number, y: number
  w: number, h: number
}


export namespace Sprite {
  export type Frame = {
    sx: number, sy: number,
    sw: number, sh: number,
  }
}

function wrap(n: number, m: number) {
  return (n % m + m) % m
}

export const Sprite = {
  draw(context: Scene.RenderContext, sprite: Sprite) {
    // if sprite is not stopped
    if (sprite.state !== 0) {
      // advance sprite frame
      sprite.frame += sprite.speed * context.dt

      // if stepping forward
      if (sprite.speed >= 0) {
        // positive integer quotient (number of times frame has cross the frame boundary)
        const loops =  Math.floor(sprite.frame / sprite.frames.length)
        
        // if sprite state is > 0 decrement but don't go below 0, else vanilla decrement
        if (sprite.state > 0) 
          sprite.state = Math.max(sprite.state - loops, 0)
        else
          sprite.state =         (sprite.state - loops   )

        // if sprite state is 0 then set frame to end, else wrap frame
        if (sprite.state === 0)
          sprite.frame = sprite.frames.length - 1
        else
          sprite.frame = wrap(sprite.frame, sprite.frames.length)

      // if stepping backward
      } else                 {
        // negative integer quotient (number of times frame has cross the frame boundary)
        const loops = Math.floor(sprite.frame / sprite.frames.length) - 1

        // if sprite state is < 0 decrement but don't go above 0, else vanilla decrement
        if (sprite.state > 0)
          sprite.state = Math.min(sprite.state + loops, 0)
        else
          sprite.state =         (sprite.state + loops   )

        // if sprite state is 0 then set frame to start, else wrap frame
        if (sprite.state === 0)
          sprite.frame = 0
        else 
          sprite.frame = wrap(sprite.frame, sprite.frames.length)
      }
    }

    // draw the sprite frame
    const frame = sprite.frames[Math.floor(sprite.frame)]!
    context.g.drawImage(
      sprite.atlas,
      frame.sx, frame.sy, frame.sw, frame.sh,
      sprite.x, sprite.y, sprite.w, sprite.h
    )
  }
}
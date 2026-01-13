import type { Id } from "./id.js"

export type  Scene = {
  doFrame ?: boolean
  onFrame ?: (frame: Scene.Frame) => void

  doInput ?: boolean
  onKeyUp     ?: (key   : string) => void
  onKeyDown   ?: (key   : string) => void
  onMouseUp   ?: (button: number) => void
  onMouseDown ?: (button: number) => void
}

export namespace Scene {
  export type Frame = {
    t : number,
    dt: number,
    w : number,
    h : number,

    g: Id<OffscreenCanvasRenderingContext2D>
  }
}

export const Scene = {

}




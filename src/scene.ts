import type { Input } from "./input.js"
import type { Stage } from "./stage.js"
import type { Vector2 } from "./vector2.js"

export type Scene = {
  doUpdate ?: boolean
  doRender ?: boolean

  onAttach ?: (stage: Stage) => void
  onDetach ?: (stage: Stage) => void
  onUpdate ?: (context: Scene.UpdateContext) => void
  onRender ?: (context: Scene.RenderContext) => void

  onKeyUp     ?: (key   : string) => void
  onKeyDown   ?: (key   : string) => void
  onMouseUp   ?: (button: number) => void
  onMouseDown ?: (button: number) => void
  onMouseMove ?: (where : Vector2) => void
  onWheel     ?: (wheel : Vector2) => void
}

export namespace Scene {
  export type UpdateContext = {
    stage: Stage
    input: Input
    w : number
    h : number
    t : number
    dt: number
  }

  export type RenderContext = {
    stage: Stage
    input: Input
    w : number
    h : number
    t : number
    dt: number
    g : OffscreenCanvasRenderingContext2D
  }

  export type DoesUpdate = {
    onUpdate(context: UpdateContext): void
  }

  export type Renderable = {
    onRender(context: RenderContext): void
  }
}

export const Scene = {
  doesUpdate(a: Scene | undefined): a is Scene.DoesUpdate {
    return !!(a && (a.doUpdate ?? true) && a.onUpdate)
  },

  doesRender(a: Scene | undefined): a is Scene.Renderable {
    return !!(a && (a.doRender ?? true) && a.onRender)
  }
}
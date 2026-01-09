import type { Maybe } from "./types.js"
import type { Stage } from "./stage.js"

export type Scene = {
  doUpdate ?: boolean
  doRender ?: boolean

  onAttach ?: (stage: Stage) => void
  onDetach ?: (stage: Stage) => void
  onUpdate ?: (context: Scene.UpdateContext) => void
  onRender ?: (context: Scene.RenderContext) => void
}

export namespace Scene {
  export type UpdateContext = {
    stage: Stage
    t : number
    dt: number
  }

  export type RenderContext = {
    stage: Stage
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
  doesUpdate(a: Maybe<Scene>): a is Scene.DoesUpdate {
    return !!(a && (a.doUpdate ?? true) && a.onUpdate)
  },

  doesRender(a: Maybe<Scene>): a is Scene.Renderable {
    return !!(a && (a.doRender ?? true) && a.onRender)
  }
}
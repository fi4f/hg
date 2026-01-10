import { Stage } from "./stage.js"
import type { Vector2 } from "./vector2.js"



export type Input = {
  stage: Stage
}

export const Input = {
  new(stage: Stage) {
    const input = {
      stage
    } satisfies Input

    window.addEventListener("keydown"  , ke => Stage.dispatch(stage, "input:keydown"  , ke))
    window.addEventListener("keyup"    , ke => Stage.dispatch(stage, "input:keyup"    , ke))
    window.addEventListener("mousedown", me => Stage.dispatch(stage, "input:mousedown", me))
    window.addEventListener("mouseup"  , me => Stage.dispatch(stage, "input:mouseup"  , me))
    window.addEventListener("mousemove", me => Stage.dispatch(stage, "input:mousemove", me))
    window.addEventListener("wheel"    , we => Stage.dispatch(stage, "input:wheel"    , we))



    return input
  }
}


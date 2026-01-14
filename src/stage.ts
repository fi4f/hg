import { Id } from "./id.js"
import { Event } from "./event.js"
import type { Vector2 } from "./vector2.js"

export type Stage = {
  configureInnerWidth    : "auto" | number,
  configureInnerHeight   : "auto" | number,
  configureScaleIncrement: "auto" | number,
  configureImageSmoothing: false  | ImageSmoothingQuality,


  outerCanvas : Id<HTMLCanvasElement>
  innerCanvas : Id<OffscreenCanvas  >
  outerContext: Id<         CanvasRenderingContext2D>
  innerContext: Id<OffscreenCanvasRenderingContext2D>
  innerScale  : number
}

export namespace Stage {
  
}

export const Stage = {

  new() {

  },


  use(stage: Stage) {

  },

  getOuterSize (stage: Stage) {
    return [
      Id.resolve(stage.outerCanvas).width,
      Id.resolve(stage.outerCanvas).height
    ] satisfies Vector2
  },

  getInnerSize (stage: Stage) {
    return [
      Id.resolve(stage.innerCanvas).width,
      Id.resolve(stage.innerCanvas).height
    ] satisfies Vector2
  },

  getInnerScale(stage: Stage) {
    return stage.innerScale
  },

  toInner(stage: Stage, [x, y]: Vector2) {
    const [ow, oh] = Stage.getOuterSize (stage)
    const [iw, ih] = Stage.getInnerSize (stage)
    const scale    = Stage.getInnerScale(stage)

    return [
      (x - ow / 2) / scale + iw / 2,
      (y - oh / 2) / scale + ih / 2,
    ] satisfies Vector2
  },

  toOuter(stage: Stage, [x, y]: Vector2) {
    const [ow, oh] = Stage.getOuterSize (stage)
    const [iw, ih] = Stage.getInnerSize (stage)
    const scale    = Stage.getInnerScale(stage)

    return [
      (x - iw / 2) * scale + ow / 2,
      (y - ih / 2) * scale + oh / 2,
    ] satisfies Vector2
  },
}

function resize(stage: Stage) {
  const outerCanvas = Id.resolve(stage.outerCanvas)
  const innerCanvas = Id.resolve(stage.innerCanvas)
  Event.emit<Vector2>("stage:resize", [
    outerCanvas.getBoundingClientRect().width,
    outerCanvas.getBoundingClientRect().height
  ])
}

function computeInnerWidth(
  outerCanvas: HTMLCanvasElement,
  innerWidth : "auto" | number
) {
  if (innerWidth === "auto") return outerCanvas.width
  else                       return        innerWidth
}

function computeInnerHeight(
  outerCanvas: HTMLCanvasElement,
  innerHeight: "auto" | number
) {
  if (innerHeight === "auto") return outerCanvas.height
  else                        return        innerHeight
}

function computeInnerScale(
  outerCanvas: HTMLCanvasElement, 
  innerCanvas: OffscreenCanvas  ,
  scaleIncrement: "auto" | number
) {
  let scale = Math.min(
    outerCanvas.width  / innerCanvas.width ,
    outerCanvas.height / innerCanvas.height
  )

  if (scaleIncrement !== "auto")
    scale = Math.floor(scale / scaleIncrement) * scaleIncrement

  return scale
}

function configureSmoothing(
  outerContext:          CanvasRenderingContext2D,
  innerContext: OffscreenCanvasRenderingContext2D,
  imageSmoothing: false | ImageSmoothingQuality
){
  outerContext.imageSmoothingEnabled = !!imageSmoothing
  innerContext.imageSmoothingEnabled = !!imageSmoothing
  if (imageSmoothing) {
    outerContext.imageSmoothingQuality = imageSmoothing
    innerContext.imageSmoothingQuality = imageSmoothing
  }
}

function resizeOuterCanvas(stage: Stage, [w, h]: Vector2) {
  const outerCanvas = Id.resolve(stage.outerCanvas)
  outerCanvas.width  = w
  outerCanvas.height = h
}

function resizeInnerCanvas(stage: Stage, [w, h]: Vector2) {
  stage.innerCanvas = Id.acquire(new OffscreenCanvas(w, h))
}

function setImageSmoothing(context: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, imageSmoothing: false | ImageSmoothingQuality) {
  context.imageSmoothingEnabled = !!imageSmoothing
  if (imageSmoothing) 
    context.imageSmoothingQuality = imageSmoothing
}

function onResize(stage: Stage, [w, h]: Vector2) {
  const outerCanvas = Id.resolve(stage.outerCanvas)
  outerCanvas.width  = w
  outerCanvas.height = h

  const innerCanvas = new OffscreenCanvas(
    computeInnerWidth (outerCanvas, stage.configureScaleIncrement),
    computeInnerHeight(outerCanvas, stage.configureScaleIncrement)
  )

  const outerContext = outerCanvas.getContext("2d")!
  const innerContext = innerCanvas.getContext("2d")!
  configureSmoothing(outerContext, innerContext, stage.configureImageSmoothing)
  
  const innerScale = computeInnerScale(
    outerCanvas,
    innerCanvas,
    stage.configureScaleIncrement
  )

  stage.innerCanvas  = Id.acquire(innerCanvas)
  stage.outerContext = Id.acquire(outerContext)
  stage.innerContext = Id.acquire(innerContext)
  stage.innerScale   = innerScale
}
  


}

function animate(stage: Stage, t0: number, t1: number, t2: number) {
  const  t = (t2 - t0) / 1000
  const dt = (t2 - t1) / 1000

  requestAnimationFrame(t3 => animate(stage, t0, t2, t3))
}
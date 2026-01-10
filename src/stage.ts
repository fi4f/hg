import { Canvas  } from "./canvas.js"
import { Event   } from "./event.js"
import { Scene   } from "./scene.js"
import { Vector2 } from "./vector2.js"

export type Stage = {
  // configure
  readonly configureDebug            : "print" | "paint" | boolean
  readonly configureW                : number
  readonly configureH                : number
  readonly configureLogicalBackground: string
  readonly configureVirtualBackground: string
  readonly configureScaleIncrement   : number                | undefined
  readonly configureImageSmoothing   : ImageSmoothingQuality | undefined

  // canvas
  logicalCanvasElement: HTMLCanvasElement
  virtualCanvasElement: OffscreenCanvas
  logicalCanvasContext: CanvasRenderingContext2D
  virtualCanvasContext: OffscreenCanvasRenderingContext2D
  virtualScale: number

  // modules
  event: Event.Tree
  debug: Map<string, string | undefined>
  scene:              Scene | undefined

  // metrics
  measuredFramesPerSecond : number

  measuredAverageFrame : number
  measuredMinimumFrame : number
  measuredMaximumFrame : number

  measuredAverageUpdate: number
  measuredMinimumUpdate: number
  measuredMaximumUpdate: number

  measuredAverageRender: number
  measuredMinimumRender: number
  measuredMaximumRender: number
}

export namespace Stage {
  export type Options = {
    canvas ?: HTMLCanvasElement
    debug  ?: "print" | "paint" | boolean
    w      ?: number
    h      ?: number
    lbg    ?: string
    vbg    ?: string
    si     ?: number
    is     ?: ImageSmoothingQuality
  }
}

/**
 * A collection of constants and functions for constructing and
 * interacting with Stage objects.
 */
export const Stage = {
  new(o ?: Stage.Options) {
    const configureDebug             = o?.debug ?? false
    const configureW                 = o?.w     ?? 0
    const configureH                 = o?.h     ?? 0
    const configureLogicalBackground = o?.lbg   ?? "#000"
    const configureVirtualBackground = o?.vbg   ?? "#fff"
    const configureScaleIncrement    = o?.si
    const configureImageSmoothing    = o?.is

    const logicalCanvasElement = o?.canvas ?? Canvas.Default()
    const virtualCanvasElement = new OffscreenCanvas(
      configureW || logicalCanvasElement.width,
      configureH || logicalCanvasElement.height
    )
    const logicalCanvasContext = logicalCanvasElement.getContext("2d")!
    const virtualCanvasContext = virtualCanvasElement.getContext("2d")!

    // configure image smoothing
    logicalCanvasContext.imageSmoothingEnabled = !!configureImageSmoothing
    virtualCanvasContext.imageSmoothingEnabled = !!configureImageSmoothing
    if (configureImageSmoothing) {
      logicalCanvasContext.imageSmoothingQuality = configureImageSmoothing
      virtualCanvasContext.imageSmoothingQuality = configureImageSmoothing
    }

    // configure virtual scale
    let virtualScale = Math.min(
      logicalCanvasElement.width  / virtualCanvasElement.width,
      logicalCanvasElement.height / virtualCanvasElement.height
    )
    if (configureScaleIncrement)
      virtualScale = Math.floor(virtualScale / configureScaleIncrement) * configureScaleIncrement

    const stage = {
      // configuration
      configureDebug,
      configureW,
      configureH,
      configureLogicalBackground,
      configureVirtualBackground,
      configureScaleIncrement,
      configureImageSmoothing,

      // canvas
      logicalCanvasElement,
      virtualCanvasElement,
      logicalCanvasContext,
      virtualCanvasContext,
      virtualScale,

      // data
      event: Event.Tree.new(),
      debug: new Map(),
      scene: undefined,

      // metrics
      measuredFramesPerSecond : 0,

      measuredAverageFrame : 0,
      measuredMinimumFrame : 0,
      measuredMaximumFrame : 0,

      measuredAverageUpdate: 0,
      measuredMinimumUpdate: 0,
      measuredMaximumUpdate: 0,

      measuredAverageRender: 0,
      measuredMinimumRender: 0,
      measuredMaximumRender: 0,
    } satisfies Stage

    Stage.setDebugInfo(stage, "stage:frameInfo" , undefined)
    Stage.setDebugInfo(stage, "stage:updateInfo", undefined)
    Stage.setDebugInfo(stage, "stage:renderInfo", undefined)
    Stage.setDebugInfo(stage, "stage:canvasInfo", undefined)

    new ResizeObserver(() => resize(stage)).observe(logicalCanvasElement)
    Stage.listen<Vector2          >(stage, "stage:resize", resize => onResize(stage, resize))
    Stage.listen<Scene | undefined>(stage, "stage:change", change => onChange(stage, change))

    requestAnimationFrame(
      firstFrame => requestAnimationFrame(
        lastFrame => requestAnimationFrame(
          thisFrame => animate(stage, firstFrame, lastFrame, thisFrame)
        )
      )
    )

    return stage
  },

  getLogicalSize(stage: Stage) {
    return Vector2.new(
      stage.logicalCanvasElement.width,
      stage.logicalCanvasElement.height
    )
  },

  getVirtualSize(stage: Stage) {
    return Vector2.new(
      stage.virtualCanvasElement.width,
      stage.virtualCanvasElement.height
    )
  },

  getVirtualScale(stage: Stage) {
    return stage.virtualScale
  },

  use(stage: Stage, scene: Scene | undefined) {
    Stage.dispatch(stage, "stage:change", scene)
  },

  listen<T>(stage: Stage, type  : string, listener  : Event.Listener<T>, o ?: { path ?: string, defer ?: boolean }) {
    Event.listen(stage.event, type, listener, o)
  },

  deafen<T>(stage: Stage, type ?: string, listener ?: Event.Listener<T>, o ?: { path ?: string, defer ?: boolean }) {
    Event.deafen(stage.event, type, listener, o)
  },

  dispatch<T>(stage: Stage, type: string, event: T, o ?: { path ?: string, defer ?: boolean }) {
    Event.dispatch(stage.event, type, event, o)
  },

  poll(stage: Stage) {
    Event.poll(stage.event)
  },

  getDebugInfo(stage: Stage, id: string) {
    return stage.debug.get(id)
  },

  setDebugInfo(stage: Stage, id: string, info: string | undefined) {
    stage.debug.set(id, info)
  }
}

function resize(stage: Stage) {
  const w = stage.logicalCanvasElement.getBoundingClientRect().width
  const h = stage.logicalCanvasElement.getBoundingClientRect().height
  Stage.dispatch(stage, "stage:resize", [w, h])
}

function onResize(stage: Stage, [w, h]: Vector2) {
  // compute new canvas sizes
  stage.logicalCanvasElement.width  = w
  stage.logicalCanvasElement.height = h
  stage.virtualCanvasElement = new OffscreenCanvas(
    stage.configureW || stage.logicalCanvasElement.width,
    stage.configureH || stage.logicalCanvasElement.height
  )

  // new canvas contexts
  stage.logicalCanvasContext = stage.logicalCanvasElement.getContext("2d")!
  stage.virtualCanvasContext = stage.virtualCanvasElement.getContext("2d")!

  // configure image smoothing
  stage.logicalCanvasContext.imageSmoothingEnabled = !!stage.configureImageSmoothing
  stage.virtualCanvasContext.imageSmoothingEnabled = !!stage.configureImageSmoothing
  if (stage.configureImageSmoothing) {
    stage.logicalCanvasContext.imageSmoothingQuality = stage.configureImageSmoothing
    stage.virtualCanvasContext.imageSmoothingQuality = stage.configureImageSmoothing
  }

  // configure virtual scale
  stage.virtualScale = Math.min(
    stage.logicalCanvasElement.width  / stage.virtualCanvasElement.width,
    stage.logicalCanvasElement.height / stage.virtualCanvasElement.height
  )
  if (stage.configureScaleIncrement)
    stage.virtualScale = Math.floor(stage.virtualScale / stage.configureScaleIncrement) * stage.configureScaleIncrement

  Stage.setDebugInfo(stage, "stage:canvasInfo", getCanvasInfo(stage))
}

function onChange(stage: Stage, scene: Scene | undefined) {
  if (stage.scene && stage.scene.onDetach)
    stage.scene.onDetach(stage)
  stage.scene = scene
  if (stage.scene && stage.scene.onAttach)
    stage.scene.onAttach(stage)
}

function update(stage: Stage, t: number, dt: number) {
  Stage.poll(stage)
  if (Scene.doesUpdate(stage.scene))
    stage.scene.onUpdate({ stage, t, dt })
}

function render(stage: Stage, t: number, dt: number) {
  const f = stage.logicalCanvasContext
  const g = stage.virtualCanvasContext

  f.resetTransform()
  g.resetTransform()

  f.fillStyle = stage.configureLogicalBackground
  const [lw, lh] = Stage.getLogicalSize(stage)
  f.fillRect(0, 0, lw, lh)

  g.fillStyle = stage.configureVirtualBackground
  const [vw, vh] = Stage.getVirtualSize(stage)
  g.fillRect(0, 0, vw, vh)

  const vs = Stage.getVirtualScale(stage)
  f.translate(
    lw / 2 - vw * vs / 2,
    lh / 2 - vh * vs / 2
  )
  f.scale(vs, vs)
  
  if (Scene.doesRender(stage.scene))
    stage.scene.onRender({ stage, t, dt, g })

  f.drawImage(stage.virtualCanvasElement, 0, 0)

  if (stage.configureDebug && stage.configureDebug !== "print")
    paintDebugInfo(stage)
}

type Metrics = {
  framesPerSecondAccumulator: number

  averageFrameAccumulator : number
  minimumFrameAccumulator : number
  maximumFrameAccumulator : number

  averageUpdateAccumulator: number
  minimumUpdateAccumulator: number
  maximumUpdateAccumulator: number

  averageRenderAccumulator: number
  minimumRenderAccumulator: number
  maximumRenderAccumulator: number

  oneSecondAccumulator: number
}

const Metrics = {
  new() {
    return {
      framesPerSecondAccumulator: 0,

      averageFrameAccumulator   : 0,
      minimumFrameAccumulator   : Infinity,
      maximumFrameAccumulator   : 0,

      averageUpdateAccumulator  : 0,
      minimumUpdateAccumulator  : Infinity,
      maximumUpdateAccumulator  : 0,

      averageRenderAccumulator  : 0,
      minimumRenderAccumulator  : Infinity,
      maximumRenderAccumulator  : 0,

      oneSecondAccumulator      : 0,
    } satisfies Metrics
  }
}

function animate(stage: Stage, t0: number, t1: number, t2: number, m ?: Metrics) {
  m ??= Metrics.new()

  const t  = (t2 - t0) / 1000
  const dt = (t2 - t1) / 1000

  const a = performance.now()
  update(stage, t, dt)
  const b = performance.now()
  render(stage, t, dt)
  const c = performance.now()

  const deltaFrame  = c - a
  const deltaUpdate = b - a
  const deltaRender = c - b

  m.framesPerSecondAccumulator += 1

  m.averageFrameAccumulator   += deltaFrame
  m.minimumFrameAccumulator    = Math.min(deltaFrame , m.minimumFrameAccumulator )
  m.maximumFrameAccumulator    = Math.max(deltaFrame , m.maximumFrameAccumulator )

  m.averageUpdateAccumulator  += deltaUpdate
  m.minimumUpdateAccumulator   = Math.min(deltaUpdate, m.minimumUpdateAccumulator)
  m.maximumUpdateAccumulator   = Math.max(deltaUpdate, m.maximumUpdateAccumulator)

  m.averageRenderAccumulator  += deltaRender
  m.minimumRenderAccumulator   = Math.min(deltaRender, m.minimumRenderAccumulator)
  m.maximumRenderAccumulator   = Math.max(deltaRender, m.maximumRenderAccumulator)

  m.oneSecondAccumulator += dt

  if (m.oneSecondAccumulator >= 1) {
    stage.measuredFramesPerSecond  = m.framesPerSecondAccumulator

    stage.measuredAverageFrame  = m.averageFrameAccumulator / m.framesPerSecondAccumulator
    stage.measuredMinimumFrame  = m.minimumFrameAccumulator
    stage.measuredMaximumFrame  = m.maximumFrameAccumulator

    stage.measuredAverageUpdate = m.averageUpdateAccumulator / m.framesPerSecondAccumulator
    stage.measuredMinimumUpdate = m.minimumUpdateAccumulator
    stage.measuredMaximumUpdate = m.maximumUpdateAccumulator

    stage.measuredAverageRender = m.averageRenderAccumulator / m.framesPerSecondAccumulator
    stage.measuredMinimumRender = m.minimumRenderAccumulator
    stage.measuredMaximumRender = m.maximumRenderAccumulator

    // reset accumulators
    m.framesPerSecondAccumulator  = 0

    m.averageFrameAccumulator   = 0
    m.minimumFrameAccumulator   = Infinity
    m.maximumFrameAccumulator   = 0

    m.averageUpdateAccumulator  = 0
    m.minimumUpdateAccumulator  = Infinity
    m.maximumUpdateAccumulator  = 0

    m.averageRenderAccumulator  = 0
    m.minimumRenderAccumulator  = Infinity
    m.maximumRenderAccumulator  = 0

    m.oneSecondAccumulator      = 0

    Stage.setDebugInfo(stage, "stage:frameInfo" , getFrameInfo (stage))
    Stage.setDebugInfo(stage, "stage:updateInfo", getUpdateInfo(stage))
    Stage.setDebugInfo(stage, "stage:renderInfo", getRenderInfo(stage))
    if (stage.configureDebug && stage.configureDebug !== "paint")
      printDebugInfo(stage)
  }

  requestAnimationFrame(t3 => animate(stage, t0, t2, t3, m))
}

function getFrameInfo(stage: Stage) {
  return `FRAME ${stage.measuredFramesPerSecond.toFixed(0)} hz @ ${stage.measuredAverageFrame.toFixed(2)} [${stage.measuredMinimumFrame.toFixed(2)} - ${stage.measuredMaximumFrame.toFixed(2)}] ms`
}

function getUpdateInfo(stage: Stage) {
  return `UPDATE ${stage.measuredAverageFrame.toFixed(2)} [${stage.measuredMinimumFrame.toFixed(2)} - ${stage.measuredMaximumFrame.toFixed(2)}] ms`
}

function getRenderInfo(stage: Stage) {
  return `RENDER ${stage.measuredAverageFrame.toFixed(2)} [${stage.measuredMinimumFrame.toFixed(2)} - ${stage.measuredMaximumFrame.toFixed(2)}] ms`
}

function getCanvasInfo(stage: Stage) {
  const [lw, lh] = Stage.getLogicalSize (stage)
  const [vw, vh] = Stage.getVirtualSize (stage)
  const vs       = Stage.getVirtualScale(stage)
  return `CANVAS ${lw}x${lh} ${vw}x${vh} ${(100 * vs).toFixed(2)}%`
}

function printDebugInfo(stage: Stage) {
  let infos = "*** DEBUG ***\n"
  for (const [id, info] of stage.debug) {
    if (!info) continue
    infos += `${info}\n`
  }
  console.log(infos)
}

const configureDebugInfoBackground = "#000a"
const configureDebugInfoForeground = "#ffff"
const configureDebugInfoPaddingL   = 10 as const
const configureDebugInfoPaddingR   = 10 as const
const configureDebugInfoPaddingT   = 10 as const
const configureDebugInfoPaddingB   = 10 as const
const configureDebugInfoSpacing    =  0 as const
const configureDebugInfoFont       = "16px monospace" as const

function paintDebugInfo(stage: Stage) {
  const g = stage.logicalCanvasContext

  g.resetTransform()
  g.font = configureDebugInfoFont

  let w = 0;
  let h = 0;   
  for (const [id, info] of stage.debug) {
    if (!info) continue

    const tm = g.measureText(info)
    w  = Math.max(w, tm.width)
    h += (
      tm.fontBoundingBoxAscent  + 
      tm.fontBoundingBoxDescent +
      configureDebugInfoSpacing
    )
  }

  if (h > 0) {
    w += configureDebugInfoPaddingL + configureDebugInfoPaddingR
    h += configureDebugInfoPaddingT + configureDebugInfoPaddingB
    h -= configureDebugInfoSpacing
  }

  // draw background
  g.fillStyle = configureDebugInfoBackground
  g.fillRect(0, 0, w, h)

  // draw foreground
  g.fillStyle = configureDebugInfoForeground
  let x = configureDebugInfoPaddingL
  let y = configureDebugInfoPaddingT
  for (const [id, info] of stage.debug) {
    if (!info) continue

    const tm = g.measureText(info)
    g.fillText(info, x, y + tm.fontBoundingBoxAscent)
    y += (
      tm.fontBoundingBoxAscent  +
      tm.fontBoundingBoxDescent +
      configureDebugInfoSpacing
    )
  }
}

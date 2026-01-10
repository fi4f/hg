import { Event } from "./core/event.js"
import { Scene } from "./core/scene.js"
import type { Maybe } from "../types.js"
import { Vector2 } from "../math/vector2.js"

const  FRAME_INFO = "stage:frame-info"  as const
const UPDATE_INFO = "stage:update-info" as const
const RENDER_INFO = "stage:render-info" as const
const CANVAS_INFO = "stage:canvas-info" as const

// events
const RESIZE = "stage:resize" as const
const CHANGE = "stage:change" as const

export type Stage = {
  // configure
  readonly configureDebug             : "print" | "paint" | boolean
  readonly configureW                 : number
  readonly configureH                 : number
  readonly configureUpdatesPerSecond  : number
  readonly configureRendersPerSecond  : number
  readonly configureLogicalBackground : string
  readonly configureVirtualBackground : string
  readonly configureScaleIncrement   ?: number                | undefined
  readonly configureImageSmoothing   ?: ImageSmoothingQuality | undefined

  // canvas
  logicalCanvasElement: HTMLCanvasElement
  virtualCanvasElement: OffscreenCanvas
  logicalCanvasContext: CanvasRenderingContext2D
  virtualCanvasContext: OffscreenCanvasRenderingContext2D
  virtualScale: number

  // data
  eventTree: Event.Tree
  debugInfo: Map<string, string | undefined>

  // scene
  scene ?: Scene | undefined

  // metrics
  lastUpdate      : number
  lastRender      : number
  millisPerUpdate : number
  millisPerRender : number
  framesPerSecond : number
  updatesPerSecond: number
  rendersPerSecond: number

  averageMillisPerUpdate: number
  minimumMillisPerUpdate: number
  maximumMillisPerUpdate: number

  averageMillisPerRender: number
  minimumMillisPerRender: number
  maximumMillisPerRender: number
  
  oneSecondAccumulator: number
  updateAccumulator   : number
  renderAccumulator   : number

  framesPerSecondAccumulator : number
  updatesPerSecondAccumulator: number
  rendersPerSecondAccumulator: number

  averageMillisPerUpdateAccumulator: number
  minimumMillisPerUpdateAccumulator: number
  maximumMillisPerUpdateAccumulator: number

  averageMillisPerRenderAccumulator: number
  minimumMillisPerRenderAccumulator: number
  maximumMillisPerRenderAccumulator: number
}

export const Stage = {
  RESIZE, CHANGE,
  new(c: HTMLCanvasElement, o ?: {
    debug ?: "print" | "paint" | boolean
    w     ?: number
    h     ?: number
    ups   ?: number
    rps   ?: number
    lbg   ?: string
    vbg   ?: string
    si    ?: number
    is    ?: ImageSmoothingQuality
  }) {
    const configureDebug             = o?.debug ?? false
    const configureW                 = o?.w     ?? 0
    const configureH                 = o?.h     ?? 0
    const configureUpdatesPerSecond  = o?.ups   ?? 0
    const configureRendersPerSecond  = o?.rps   ?? 0
    const configureLogicalBackground = o?.lbg   ?? "#000"
    const configureVirtualBackground = o?.vbg   ?? "#fff"
    const configureScaleIncrement    = o?.si
    const configureImageSmoothing    = o?.is

    const logicalCanvasElement = c
    const virtualCanvasElement = new OffscreenCanvas(
      configureW || logicalCanvasElement.width,
      configureH || logicalCanvasElement.height
    )

    const logicalCanvasContext = logicalCanvasElement.getContext("2d")!
    const virtualCanvasContext = virtualCanvasElement.getContext("2d")!

    logicalCanvasContext.imageSmoothingEnabled = !!configureImageSmoothing
    virtualCanvasContext.imageSmoothingEnabled = !!configureImageSmoothing
    if (configureImageSmoothing) {
      logicalCanvasContext.imageSmoothingQuality = configureImageSmoothing
      virtualCanvasContext.imageSmoothingQuality = configureImageSmoothing
    }

    let virtualScale = Math.min(
      logicalCanvasElement.width  / virtualCanvasElement.width,
      logicalCanvasElement.height / virtualCanvasElement.height
    )
    if (configureScaleIncrement)
      virtualScale = Math.floor(virtualScale / configureScaleIncrement) * configureScaleIncrement

    const millisPerUpdate = configureUpdatesPerSecond ? 1000 / configureUpdatesPerSecond : 0
    const millisPerRender = configureRendersPerSecond ? 1000 / configureRendersPerSecond : 0

    const stage = {
      configureDebug,
      configureW,
      configureH,
      configureUpdatesPerSecond,
      configureRendersPerSecond,
      configureLogicalBackground,
      configureVirtualBackground,
      configureScaleIncrement,
      configureImageSmoothing,

      logicalCanvasElement,
      virtualCanvasElement,
      logicalCanvasContext,
      virtualCanvasContext,
      virtualScale,

      eventTree: Event.Tree.new(),
      debugInfo: new Map(),
      
      lastUpdate: 0,
      lastRender: 0,
      millisPerUpdate,
      millisPerRender,
      framesPerSecond : 0,
      updatesPerSecond: 0,
      rendersPerSecond: 0,

      averageMillisPerUpdate: 0,
      minimumMillisPerUpdate: 0,
      maximumMillisPerUpdate: 0,

      averageMillisPerRender: 0,
      minimumMillisPerRender: 0,
      maximumMillisPerRender: 0,

      oneSecondAccumulator: 0,
      updateAccumulator: 0,
      renderAccumulator: 0,

      framesPerSecondAccumulator : 0,
      updatesPerSecondAccumulator: 0,
      rendersPerSecondAccumulator: 0,

      averageMillisPerUpdateAccumulator: 0,
      minimumMillisPerUpdateAccumulator: Infinity,
      maximumMillisPerUpdateAccumulator: 0,

      averageMillisPerRenderAccumulator: 0,
      minimumMillisPerRenderAccumulator: Infinity,
      maximumMillisPerRenderAccumulator: 0,
    } satisfies Stage

    // ensure these debug infos appear near the top of each debug view
    Stage.setDebugInfo(stage, FRAME_INFO , undefined)
    Stage.setDebugInfo(stage, UPDATE_INFO, undefined)
    Stage.setDebugInfo(stage, RENDER_INFO, undefined)
    Stage.setDebugInfo(stage, CANVAS_INFO, undefined)

    new ResizeObserver(() => resize(stage)).observe(c)
    Stage.listen<     Vector2>(stage, RESIZE, wh => onResize(stage, wh))
    Stage.listen<Maybe<Scene>>(stage, CHANGE, sc => onChange(stage, sc))

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

  change(stage: Stage, scene: Maybe<Scene>) {
    Stage.dispatch(stage, CHANGE, scene)
  },

  listen<T>(stage: Stage, type  : string, listener  : Event.Listener<T>, o ?: { path ?: string, defer ?: boolean }) {
    Event.listen(stage.eventTree, type, listener, o)
  },

  deafen<T>(stage: Stage, type ?: string, listener ?: Event.Listener<T>, o ?: { path ?: string, defer ?: boolean }) {
    Event.deafen(stage.eventTree, type, listener, o)
  },

  dispatch<T>(stage: Stage, type: string, event: T, o ?: { path ?: string, defer ?: boolean }) {
    Event.dispatch(stage.eventTree, type, event, o)
  },

  poll(stage: Stage) {
    Event.poll(stage.eventTree)
  },

  getDebugInfo(stage: Stage, id: string) {
    return stage.debugInfo.get(id)
  },

  setDebugInfo(stage: Stage, id: string, info: string | undefined) {
    stage.debugInfo.set(id, info)
  }
}

function resize(stage: Stage) {
  const w = stage.logicalCanvasElement.getBoundingClientRect().width
  const h = stage.logicalCanvasElement.getBoundingClientRect().height
  Stage.dispatch(stage, RESIZE, [w, h])
}

function onResize(stage: Stage, [w, h]: Vector2) {
  stage.logicalCanvasElement.width  = w
  stage.logicalCanvasElement.height = h
  stage.virtualCanvasElement = new OffscreenCanvas(
    stage.configureW || stage.logicalCanvasElement.width,
    stage.configureH || stage.logicalCanvasElement.height
  )

  stage.logicalCanvasContext = stage.logicalCanvasElement.getContext("2d")!
  stage.virtualCanvasContext = stage.virtualCanvasElement.getContext("2d")!

  stage.logicalCanvasContext.imageSmoothingEnabled = !!stage.configureImageSmoothing
  stage.virtualCanvasContext.imageSmoothingEnabled = !!stage.configureImageSmoothing
  if (stage.configureImageSmoothing) {
    stage.logicalCanvasContext.imageSmoothingQuality = stage.configureImageSmoothing
    stage.virtualCanvasContext.imageSmoothingQuality = stage.configureImageSmoothing
  }

  stage.virtualScale = Math.min(
    stage.logicalCanvasElement.width  / stage.virtualCanvasElement.width,
    stage.logicalCanvasElement.height / stage.virtualCanvasElement.height
  )
  if (stage.configureScaleIncrement)
    stage.virtualScale = Math.floor(stage.virtualScale / stage.configureScaleIncrement) * stage.configureScaleIncrement

  Stage.setDebugInfo(stage, CANVAS_INFO, getCanvasInfo(stage))
}

function onChange(stage: Stage, scene: Maybe<Scene>) {
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
    paintDebugInfos(stage)
}

function animate(stage: Stage, firstFrame: number, lastFrame: number, thisFrame: number) {
  const delta = thisFrame - lastFrame

  stage.oneSecondAccumulator += delta
  stage.updateAccumulator    += delta
  stage.renderAccumulator    += delta

  stage.framesPerSecondAccumulator += 1

  if (stage.updateAccumulator >= stage.millisPerUpdate) {
    const t  = (thisFrame -       firstFrame) / 1000
    const dt = (thisFrame - stage.lastUpdate) / 1000

    const a = performance.now()
    update(stage, t, dt)
    const b = performance.now()

    const millisThisUpdate = b - a

    stage.lastUpdate = thisFrame
    stage.updatesPerSecondAccumulator += 1
    stage.updateAccumulator -= stage.millisPerUpdate

    stage.averageMillisPerUpdateAccumulator += millisThisUpdate
    stage.minimumMillisPerUpdateAccumulator  = Math.min(millisThisUpdate, stage.minimumMillisPerUpdateAccumulator)
    stage.maximumMillisPerUpdateAccumulator  = Math.max(millisThisUpdate, stage.maximumMillisPerUpdateAccumulator)
  }

  if (stage.renderAccumulator >= stage.millisPerRender) {
    const t  = (thisFrame -       firstFrame) / 1000
    const dt = (thisFrame - stage.lastRender) / 1000

    const a = performance.now()
    render(stage, t, dt)
    const b = performance.now()

    const millisThisRender = b - a

    stage.lastRender = thisFrame
    stage.rendersPerSecondAccumulator += 1
    stage.renderAccumulator -= stage.millisPerRender

    stage.averageMillisPerRenderAccumulator += millisThisRender
    stage.minimumMillisPerRenderAccumulator  = Math.min(millisThisRender, stage.minimumMillisPerRenderAccumulator)
    stage.maximumMillisPerRenderAccumulator  = Math.max(millisThisRender, stage.maximumMillisPerRenderAccumulator)
  }

  if (stage.oneSecondAccumulator >= 1000) {
    // update metrics
    stage.framesPerSecond  = stage.framesPerSecondAccumulator
    stage.updatesPerSecond = stage.updatesPerSecondAccumulator
    stage.rendersPerSecond = stage.rendersPerSecondAccumulator

    stage.averageMillisPerUpdate = stage.averageMillisPerUpdateAccumulator / stage.updatesPerSecondAccumulator
    stage.minimumMillisPerUpdate = stage.minimumMillisPerUpdateAccumulator
    stage.maximumMillisPerUpdate = stage.maximumMillisPerUpdateAccumulator

    stage.averageMillisPerRender = stage.averageMillisPerRenderAccumulator / stage.rendersPerSecondAccumulator
    stage.minimumMillisPerRender = stage.minimumMillisPerRenderAccumulator
    stage.maximumMillisPerRender = stage.maximumMillisPerRenderAccumulator

    // reset accumulators
    stage.framesPerSecondAccumulator  = 0
    stage.updatesPerSecondAccumulator = 0
    stage.rendersPerSecondAccumulator = 0

    stage.averageMillisPerUpdateAccumulator = 0
    stage.minimumMillisPerUpdateAccumulator = Infinity
    stage.maximumMillisPerUpdateAccumulator = 0

    stage.averageMillisPerRenderAccumulator = 0
    stage.minimumMillisPerRenderAccumulator = Infinity
    stage.maximumMillisPerRenderAccumulator = 0

    stage.oneSecondAccumulator -= 1000

    Stage.setDebugInfo(stage, FRAME_INFO , getFrameInfo (stage))
    Stage.setDebugInfo(stage, UPDATE_INFO, getUpdateInfo(stage))
    Stage.setDebugInfo(stage, RENDER_INFO, getRenderInfo(stage))

    if (stage.configureDebug && stage.configureDebug !== "paint")
      printDebugInfos(stage)
  }

  requestAnimationFrame(nextFrame => animate(stage, firstFrame, thisFrame, nextFrame))
}

function getFrameInfo(stage: Stage) {
  return `FRAME  ${stage.framesPerSecond.toFixed(0)} hz`
}

function getUpdateInfo(stage: Stage) {
  return `UPDATE ${stage.updatesPerSecond.toFixed(0)} hz @ ${stage.averageMillisPerUpdate.toFixed(2)} [${stage.minimumMillisPerUpdate.toFixed(2)} - ${stage.maximumMillisPerUpdate.toFixed(2)}] of ${stage.millisPerUpdate.toFixed(2)} ms`
}

function getRenderInfo(stage: Stage) {
  return `RENDER ${stage.rendersPerSecond.toFixed(0)} hz @ ${stage.averageMillisPerRender.toFixed(2)} [${stage.minimumMillisPerRender.toFixed(2)} - ${stage.maximumMillisPerRender.toFixed(2)}] of ${stage.millisPerRender.toFixed(2)} ms`
}

function getCanvasInfo(stage: Stage) {
  const [lw, lh] = Stage.getLogicalSize (stage)
  const [vw, vh] = Stage.getVirtualSize (stage)
  const vs       = Stage.getVirtualScale(stage)
  return `CANVAS ${lw}x${lh} ${vw}x${vh} ${(100 * vs).toFixed(2)}%`
}

function printDebugInfos(stage: Stage) {
  let infos = "*** DEBUG ***\n"
  for (const [id, info] of stage.debugInfo) {
    if (!info) continue
    infos += `${info}\n`
  }
  console.log(infos)
}

function paintDebugInfos(stage: Stage) {
  const g = stage.logicalCanvasContext

  const configureDebugBackground = "#000a"
  const configureDebugForeground = "#ffff"
  const configurePaddingX = 10 as const
  const configurePaddingY = 10 as const
  const configureSpacingY = 0  as const
  const configureFont     = "16px monospace" as const

  g.resetTransform()
  g.font = configureFont

  let w = 0;
  let h = 0;   
  for (const [id, info] of stage.debugInfo) {
    if (!info) continue

    const tm = g.measureText(info)
    w  = Math.max(w, tm.width)
    h += (
      tm.fontBoundingBoxAscent  + 
      tm.fontBoundingBoxDescent +
      configureSpacingY
    )
  }

  if (h > 0) {
    w += configurePaddingX * 2
    h += configurePaddingY * 2
    h -= configureSpacingY
  }

  // draw background
  g.fillStyle = configureDebugBackground
  g.fillRect(0, 0, w, h)

  // draw foreground
  g.fillStyle = configureDebugForeground
  let x = configurePaddingX
  let y = configurePaddingY
  for (const [id, info] of stage.debugInfo) {
    if (!info) continue

    const tm = g.measureText(info)
    g.fillText(info, x, y + tm.fontBoundingBoxAscent)
    y += (
      configureSpacingY + 
      tm.fontBoundingBoxAscent +
      tm.fontBoundingBoxDescent
    )
  }
}

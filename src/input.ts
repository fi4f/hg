import { Stage   } from "./stage.js"
import { Vector2 } from "./vector2.js"

export type Input = {
  stage: Stage

  keys   : Map<string, boolean>
  buttons: Map<number, boolean>

  mouse: Vector2
  wheel: Vector2
}

export const Input = {
  new(stage: Stage) {
    const input = {
      stage,
      keys   : new Map(),
      buttons: new Map(),
      mouse  : [ 0, 0 ] satisfies Vector2,
      wheel  : [ 0, 0 ] satisfies Vector2,
    } satisfies Input

    window.addEventListener("keyup"    , ke => Stage.dispatch(stage, "native:keyup"    , ke))
    window.addEventListener("keydown"  , ke => Stage.dispatch(stage, "native:keydown"  , ke))
    stage.logicalCanvasElement.addEventListener("mouseup"  , me => Stage.dispatch(stage, "native:mouseup"  , me))
    stage.logicalCanvasElement.addEventListener("mousedown", me => Stage.dispatch(stage, "native:mousedown", me))
    stage.logicalCanvasElement.addEventListener("mousemove", me => Stage.dispatch(stage, "native:mousemove", me))
    stage.logicalCanvasElement.addEventListener("wheel"    , we => Stage.dispatch(stage, "native:wheel"    , we))

    Stage.listen<KeyboardEvent>(stage, "native:keyup"    , native => onNativeKeyUp    (input, native))
    Stage.listen<KeyboardEvent>(stage, "native:keydown"  , native => onNativeKeyDown  (input, native))
    Stage.listen<MouseEvent   >(stage, "native:mouseup"  , native => onNativeMouseUp  (input, native))
    Stage.listen<MouseEvent   >(stage, "native:mousedown", native => onNativeMouseDown(input, native))
    Stage.listen<MouseEvent   >(stage, "native:mousemove", native => onNativeMouseMove(input, native))
    Stage.listen<WheelEvent   >(stage, "native:wheel"    , native => onNativeWheel    (input, native))

    Stage.listen<KeyUp    >(stage, "input:keyup"    , e => onKeyUp    (input, e))
    Stage.listen<KeyDown  >(stage, "input:keydown"  , e => onKeyDown  (input, e))
    Stage.listen<MouseUp  >(stage, "input:mouseup"  , e => onMouseUp  (input, e))
    Stage.listen<MouseDown>(stage, "input:mousedown", e => onMouseDown(input, e))
    Stage.listen<MouseMove>(stage, "input:mousemove", e => onMouseMove(input, e))
    Stage.listen<Wheel    >(stage, "input:wheel"    , e => onWheel    (input, e))

    return input
  },

  isKeyUp(input: Input, key: string) {
    return  !input.keys.get(key)
  },

  isKeyDown(input: Input, key: string) {
    return !!input.keys.get(key)
  },

  isMouseUp(input: Input, button: number) {
    return  !input.buttons.get(button)
  },

  isMouseDown(input: Input, button: number) {
    return !!input.buttons.get(button)
  },

  getMouse(input: Input) {
    return [...input.mouse] satisfies Vector2
  },

  getWheel(input: Input) {
    return [...input.wheel] satisfies Vector2
  },

  poll(input: Input) {
    input.wheel = [ 0, 0 ] satisfies Vector2
  }
}

function onNativeKeyUp  (input: Input, native: KeyboardEvent) {
  const key = native.key
  if (Input.isKeyUp(input, key)) return;
  input.keys.set(key, false)
  Stage.dispatch<KeyUp>(input.stage, "input:keyup", { key, native }, { defer: false })
}

function onNativeKeyDown(input: Input, native: KeyboardEvent) {
  const key = native.key
  if (Input.isKeyDown(input, key)) return;
  input.keys.set(key, true)
  Stage.dispatch<KeyDown>(input.stage, "input:keydown", { key, native }, { defer: false })
}

function onNativeMouseUp  (input: Input, native: MouseEvent) {
  const button = native.button
  if (Input.isMouseUp(input, button)) return;
  input.buttons.set(button, false)
  Stage.dispatch<MouseUp>(input.stage, "input:mouseup", { button, native }, { defer: false })
}

function onNativeMouseDown(input: Input, native: MouseEvent) {
  const button = native.button
  if (Input.isMouseDown(input, button)) return;
  input.buttons.set(button, true)
  Stage.dispatch<MouseDown>(input.stage, "input:mousedown", { button, native }, { defer: false })
}

function onNativeMouseMove(input: Input, native: MouseEvent) {
  const where = Stage.logicalToVirtual(input.stage, [
    native.offsetX,
    native.offsetY
  ])
  input.mouse = [...where] satisfies Vector2
  Stage.dispatch<MouseMove>(input.stage, "input:mousemove", { where, native }, { defer: false })
}

function onNativeWheel(input: Input, native: WheelEvent) {
  const wheel = [
    native.deltaX,
    native.deltaY
  ] satisfies Vector2
  input.wheel = [...wheel] satisfies Vector2
  Stage.dispatch<Wheel>(input.stage, "input:wheel", { wheel, native }, { defer: false })
}

function onKeyUp  (input: Input, e: KeyUp  ) {
  if (input.stage.scene && input.stage.scene.onKeyUp)
    input.stage.scene.onKeyUp(e.key)
}

function onKeyDown(input: Input, e: KeyDown) {
  if (input.stage.scene && input.stage.scene.onKeyDown)
    input.stage.scene.onKeyDown(e.key)
}

function onMouseUp  (input: Input, e: MouseUp  ) {
  if (input.stage.scene && input.stage.scene.onMouseUp)
    input.stage.scene.onMouseUp(e.button)
}

function onMouseDown(input: Input, e: MouseDown) {
  if (input.stage.scene && input.stage.scene.onMouseDown)
    input.stage.scene.onMouseDown(e.button)
}

function onMouseMove(input: Input, e: MouseMove) {
  if (input.stage.scene && input.stage.scene.onMouseMove)
    input.stage.scene.onMouseMove(e.where)
}

function onWheel(input: Input, e: Wheel) {
  if (input.stage.scene && input.stage.scene.onWheel)
    input.stage.scene.onWheel(e.wheel)
}

export type KeyUp = {
  key: string
  native: KeyboardEvent
}

export type KeyDown = {
  key: string
  native: KeyboardEvent
}

export type MouseUp = {
  button: number
  native: MouseEvent
}

export type MouseDown = {
  button: number
  native: MouseEvent
}

export type MouseMove = {
  where: Vector2
  native: MouseEvent
}

export type Wheel = {
  wheel: Vector2
  native: WheelEvent
}


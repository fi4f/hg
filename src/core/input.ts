import { Id, Vector2, type Plain } from "../hg.js"

export type Input = {
  keyboard: Input.Keyboard
  pointers: Input.Pointers
  gamepads: Input.Gamepads
  wheel   : Vector2

  primaryPen   ?: Input.Pointer
  primaryTouch ?: Input.Pointer
  primaryMouse ?: Input.Pointer
}

export namespace Input {
  export type Keyboard = Plain<{
    [key: string]: boolean
  }>

  export type Pointer = Plain<{
    id       : number
    kind     : "pen" | "touch" | "mouse"
    where    : Vector2
    buttons  : number
  }>

  export type Pointers = Plain<{
    [id   : number]: Pointer
  }>

  export type Gamepad = Plain<{
    isConnected: boolean
    buttons: Array<boolean>
    axes   : Array<number >
    index  : number
  }>

  export type Gamepads = Plain<{
    [index: number]: Gamepad
  }>

  export type GamepadConnected    = {
    native: Id<GamepadEvent>
  } & Gamepad

  export type GamepadDisconnected = {
    native: Id<GamepadEvent>
  } & Gamepad

  export type PointerUp     = {
    native: Id<PointerEvent>
  } & Pointer

  export type PointerDown   = {
    native: Id<PointerEvent>
  } & Pointer

  export type PointerMove   = {
    native: Id<PointerEvent>
  } & Pointer

  export type PointerCancel = {
    native: Id<PointerEvent>
  } & Pointer

  export type KeyUp   = {
    native: Id<KeyboardEvent>
    key   : string
  }

  export type KeyDown = {
    native: Id<KeyboardEvent>
    key   : string
  }

  export type Wheel   = {
    native: Id<WheelEvent>
    delta : Vector2
  }
}

export const Input = {
  new() {
    const input = {
      keyboard: { },
      pointers: { },
      gamepads: { },
      wheel   : Vector2.new(),
    } satisfies Input

    window.addEventListener
  },

  getPointer(input: Input, id: number) {
    return input.pointers[id]
  },

  isButtonUp  (input: Input, button: number, id ?: number) {

  },

  isButtonDown(input: Input, button: number, id ?: number) {

  },
}

function onNativeGamepadConnected   (input: Input, native: GamepadEvent) {

}

function onNativeGamepadDisconnected(input: Input, native: GamepadEvent) {

}

function onNativeKeyUp        (input: Input, native: KeyboardEvent) {
  
}

function onNativeKeyDown      (input: Input, native: KeyboardEvent) {

}

function onNativePointerUp    (input: Input, native: PointerEvent ) {
  (native.target as HTMLElement).releasePointerCapture(native.pointerId)
}

function onNativePointerDown  (input: Input, native: PointerEvent ) {
  (native.target as HTMLElement).setPointerCapture(native.pointerId)
}

function onNativePointerMove  (input: Input, native: PointerEvent ) {

}

function onNativePointerCancel(input: Input, native: PointerEvent ) {
  (native.target as HTMLElement).releasePointerCapture(native.pointerId)
}

function onNativeWheel        (input: Input, native: WheelEvent   ) {

}

function onGamepadConnected   (input: Input, e: Input.GamepadConnected   ) {
  Id.release(e.native)
}

function onGamepadDisconnected(input: Input, e: Input.GamepadDisconnected) {
  Id.release(e.native)
}

function onKeyUp              (input: Input, e: Input.KeyUp              ) {
  Id.release(e.native)
}

function onKeyDown            (input: Input, e: Input.KeyDown            ) {
  Id.release(e.native)
}

function onPointerUp          (input: Input, e: Input.PointerUp          ) {
  Id.release(e.native)
}

function onPointerDown        (input: Input, e: Input.PointerDown        ) {
  Id.release(e.native)
}

function onPointerMove        (input: Input, e: Input.PointerMove        ) {
  Id.release(e.native)
}

function onPointerCancel      (input: Input, e: Input.PointerCancel      ) {
  Id.release(e.native)
}

function onWheel              (input: Input, e: Input.Wheel              ) {
  input.wheel = [...e.delta] satisfies Vector2
  Id.release(e.native)
}
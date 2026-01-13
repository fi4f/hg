import { Vector2 } from "../math/vector2.js"
import { emit, on } from "./event.js"
import { Id, un } from "./id.js"

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
  export type Keyboard = {
    [key: string]: boolean
  }

  export type Pointer = {
    id       : number
    kind     : "pen" | "touch" | "mouse"
    where    : Vector2
    buttons  : number
  }

  export type Pointers = {
    [id   : number]: Pointer
  }

  export type Gamepad = {
    isConnected: boolean
    buttons: Array<boolean>
    axes   : Array<number >
    index  : number
  }

  export type Gamepads = {
    [index: number]: Gamepad
  }

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
  new(c: HTMLCanvasElement) {
    const input = {
      pointers: { },
      keyboard: { },
      gamepads: { },
      wheel   : Vector2.new(),
    } satisfies Input

    // pointer events
    c.addEventListener("pointerup"   , native => {
      (native.target as HTMLElement).releasePointerCapture(native.pointerId)
      emit("native:pointerup"    , Id.acquire(native))
    })
    c.addEventListener("pointerdown" , native => {
      (native.target as HTMLElement).    setPointerCapture(native.pointerId)
      emit("native:pointerdown"  , Id.acquire(native))
    })
    c.addEventListener("pointermove" , native => {
      emit("native:pointermove"  , Id.acquire(native))
    })
    c.addEventListener("pointercancel", native => {
      (native.target as HTMLElement).releasePointerCapture(native.pointerId)
      emit("native:pointercancel", Id.acquire(native))
    })

    on<Id<PointerEvent>>("native:pointerup"    , (native) => onNativePointerUp    (input, native))
    on<Id<PointerEvent>>("native:pointerdown"  , (native) => onNativePointerDown  (input, native))
    on<Id<PointerEvent>>("native:pointermove"  , (native) => onNativePointerMove  (input, native))
    on<Id<PointerEvent>>("native:pointercancel", (native) => onNativePointerCancel(input, native))

    on<Input.PointerUp    >("input:pointerup"    , (e) => onPointerUp    (input, e))
    on<Input.PointerDown  >("input:pointerdown"  , (e) => onPointerDown  (input, e))
    on<Input.PointerMove  >("input:pointermove"  , (e) => onPointerMove  (input, e))
    on<Input.PointerCancel>("input:pointercancel", (e) => onPointerCancel(input, e))

    // keyboard events
    window.addEventListener("keyup"              , native => {
      emit("native:keyup"              , Id.acquire(native))
    })
    window.addEventListener("keydown"            , native => {
      emit("native:keydown"            , Id.acquire(native))
    })

    on<Id<KeyboardEvent>>("native:keyup"              , (native) => onNativeKeyUp        (input, native))
    on<Id<KeyboardEvent>>("native:keydown"            , (native) => onNativeKeyDown      (input, native))

    on<Input.KeyUp    >("input:keyup"    , (e) => onKeyUp    (input, e))
    on<Input.KeyDown  >("input:keydown"  , (e) => onKeyDown  (input, e))
    
    // gamepad events
    window.addEventListener("gamepadconnected"   , native => {
      emit("native:gamepadconnected"   , Id.acquire(native))
    })
    window.addEventListener("gamepaddisconnected", native => {
      emit("native:gamepaddisconnected", Id.acquire(native))
    })

    on<Id<GamepadEvent>>("native:gamepadconnected"   , (native) => onNativeGamepadConnected   (input, native))
    on<Id<GamepadEvent>>("native:gamepaddisconnected", (native) => onNativeGamepadDisconnected(input, native))

    on<Input.GamepadConnected   >("input:gamepadconnected"    , (e) => onGamepadConnected   (input, e))
    on<Input.GamepadDisconnected>("input:gamepaddisconnected" , (e) => onGamepadDisconnected(input, e))

    // wheel events
    c.addEventListener("wheel", native => {
      emit("native:wheel", Id.acquire(native))
    })

    on<Id<WheelEvent>>("native:wheel", native => onNativeWheel(input, native))

    on<Input.Wheel>("input:wheel", (e) => onWheel(input, e))
  },

  getPointer(input: Input, id: number) {
    return input.pointers[id]
  },

  isButtonUp  (input: Input, button: number, id ?: number) {

  },

  isButtonDown(input: Input, button: number, id ?: number) {

  },
}

function onNativeGamepadConnected   (input: Input, native: Id<GamepadEvent>) {

}

function onNativeGamepadDisconnected(input: Input, native: Id<GamepadEvent>) {

}

function onNativeKeyUp        (input: Input, native: Id<KeyboardEvent>) {
  emit<Input.KeyUp  >("input:keyup"  , { native, key: un(native).key }, false)
}

function onNativeKeyDown      (input: Input, native: Id<KeyboardEvent>) {
  emit<Input.KeyDown>("input:keydown", { native, key: un(native).key }, false)
}

function onNativePointerUp    (input: Input, native: Id<PointerEvent> ) {

}

function onNativePointerDown  (input: Input, native: Id<PointerEvent> ) {

}

function onNativePointerMove  (input: Input, native: Id<PointerEvent> ) {

}

function onNativePointerCancel(input: Input, native: Id<PointerEvent> ) {

}

function onNativeWheel        (input: Input, native: Id<WheelEvent>   ) {

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
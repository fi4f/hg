let __default__: HTMLCanvasElement;

export const Canvas = {
  get __default__() {
    if (!__default__) {
      __default__ = document.createElement("canvas");
        __default__.style.position = "absolute";
        __default__.style.top      = "0";
        __default__.style.left     = "0";
        __default__.style.width    = "100dvw";
        __default__.style.height   = "100dvh";
      document.body.appendChild(__default__);
    }
    return __default__;
  }
}
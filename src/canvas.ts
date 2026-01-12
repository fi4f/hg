export namespace Canvas {
  export type Element = HTMLCanvasElement        | OffscreenCanvas
  export type Context = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D
}


export const Canvas = {
  Default() {
    const canvas = document.createElement("canvas");
      canvas.style.position = "absolute";
      canvas.style.top      = "0";
      canvas.style.left     = "0";
      canvas.style.width    = "100dvw";
      canvas.style.height   = "100dvh";
    return document.body.appendChild(canvas);
  }
}
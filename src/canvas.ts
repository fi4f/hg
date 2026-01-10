export const Canvas = {
  Default() {
    const canvas = document.createElement("canvas");
      canvas.style.position = "absolute";
      canvas.style.top      = "0";
      canvas.style.left     = "0";
      canvas.style.width    = "dvw";
      canvas.style.height   = "dvh";
    return document.body.appendChild(canvas);
  }
}
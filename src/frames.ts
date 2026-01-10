import type { Scene } from "./scene.js"

export type Frame = {
  atlas: HTMLImageElement
  sx: number, sy: number,
  sw: number, sh: number,
}

export const Frame = {
  new(
    atlas: HTMLImageElement,
    sx = 0, sy = 0,
    sw = atlas.width ,
    sh = atlas.height
  ) {
    return {
      atlas,
      sx, sy,
      sw, sh
    } satisfies Frame
  },

  draw(
    { g }: Scene.RenderContext, 
    frame: Frame, 
    dx=0, 
    dy=0, 
    dw=frame.sw, 
    dh=frame.sh
  ) {
    g.drawImage(frame.atlas,
      frame.sx, frame.sy,
      frame.sw, frame.sh,
      dx , dy , dw , dh ,
    )
  }
}

export const Frames = {
  from(atlas: HTMLImageElement, w: number, h: number, n ?: number) {
    const frames = new Array<Frame>()
    const rows   = Math.floor(atlas.height / h)
    const cols   = Math.floor(atlas.width  / w)

    n ??= rows * cols
    for (let i = 0; i < n; i ++) {
      const row = Math.floor(i / cols)
      const col = Math.floor(i % cols)

      if (
        row < 0 || row >= rows ||
        col < 0 || col >= cols
      ) break;

      frames.push({
        atlas: atlas,
        sx: col * w,
        sy: row * h,
        sw: w, sh: h
      })
    }
    return frames
  },

  draw(
    context: Scene.RenderContext, 
    frames : Array<Frame>, 
    i =0, 
    dx=0, 
    dy=0,
    dw=frames[i]?.sw ?? 0, 
    dh=frames[i]?.sh ?? 0
  ) {
    if (!frames[i]) return;
    Frame.draw(context, frames[i], 
      dx, dy, 
      dw, dh
    )
  }
}
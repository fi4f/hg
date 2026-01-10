export type Frame = {
  sx: number, sy: number,
  sw: number, sh: number,
}

export const Frame = {
  new(
    sx: number, sy: number,
    sw: number, sh: number
  ) {
    return {
      sx, sy,
      sw, sh
    } satisfies Frame
  }
}
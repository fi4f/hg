import { Canvas } from "./canvas.js"
import { Id } from "./id.js"

export namespace Stage {
  export type Instance = {
    readonly configureLogicalBackground: string
    readonly configureVirtualBackground: string
    readonly configureInnerWidth       : "auto" | number
    readonly configureInnerHeight      : "auto" | number
    readonly configureScaleIncrement   : "auto" | number
    readonly configureImageSmoothing   :  false | ImageSmoothingQuality

    logicalCanvasElement: Id<HTMLCanvasElement>
    virtualCanvasElement: Id<OffscreenCanvas  >
    logicalCanvasContext: Id<         CanvasRenderingContext2D>
    virtualCanvasContext: Id<OffscreenCanvasRenderingContext2D>
    virtualScale: number
  }
}

let __default__: Stage.Instance;
let CONFIGURE_LOGICAL_BACKGROUND:          string                = "black";
let CONFIGURE_VIRTUAL_BACKGROUND:          string                = "white";
let CONFIGURE_INNER_WIDTH       : "auto" | number                =  "auto";
let CONFIGURE_INNER_HEIGHT      : "auto" | number                =  "auto";
let CONFIGURE_SCALE_INCREMENT   : "auto" | number                =  "auto";
let CONFIGURE_IMAGE_SMOOTHING   :  false | ImageSmoothingQuality =   false;

export const Stage = {
  Instance: {
    new(o ?: {
      c   ?: HTMLCanvasElement;
      w   ?: "auto" | number;
      h   ?: "auto" | number;
      lbg ?: string;
      vbg ?: string;
      si  ?: "auto" | number;
      is  ?:  false | ImageSmoothingQuality;
    }) {
      const configureLogicalBackground = o?.lbg ?? "black";
      const configureVirtualBackground = o?.vbg ?? "white";
      const configureInnerWidth        = o?.w   ?? "auto" ;
      const configureInnerHeight       = o?.h   ?? "auto" ;
      const configureScaleIncrement    = o?.si  ?? "auto" ;
      const configureImageSmoothing    = o?.is  ?? false;

      const logicalCanvasElement = o?.c ?? Canvas.__default__;
      const virtualCanvasElement = new OffscreenCanvas(
        configureInnerWidth  === "auto" ? logicalCanvasElement.width  : configureInnerWidth ,
        configureInnerHeight === "auto" ? logicalCanvasElement.height : configureInnerHeight
      );

      const logicalCanvasContext = logicalCanvasElement.getContext("2d");
      if (!logicalCanvasContext)
        throw new Error("[Stage.new] Failed to obtain a logical canvas context.");

      const virtualCanvasContext = virtualCanvasElement.getContext("2d");
      if (!virtualCanvasContext)
        throw new Error("[Stage.new] Failed to obtain a virtual canvas context.");

      return {
        configureLogicalBackground,
        configureVirtualBackground,
        configureInnerWidth       ,
        configureInnerHeight      ,
        configureScaleIncrement   ,
        configureImageSmoothing   ,

        logicalCanvasElement: Id.acquire(logicalCanvasElement),
        virtualCanvasElement: Id.acquire(virtualCanvasElement),
        logicalCanvasContext: Id.acquire(logicalCanvasContext),
        virtualCanvasContext: Id.acquire(virtualCanvasContext),
        virtualScale: 1,
      } satisfies Stage.Instance
    }
  },

  get __default__() { 
    return __default__ ??= Stage.Instance.new({
      lbg: CONFIGURE_LOGICAL_BACKGROUND,
      vbg: CONFIGURE_VIRTUAL_BACKGROUND,
      w  : CONFIGURE_INNER_WIDTH       ,
      h  : CONFIGURE_INNER_HEIGHT      ,
      si : CONFIGURE_SCALE_INCREMENT   ,
      is : CONFIGURE_IMAGE_SMOOTHING   ,
    }) 
  },

  set CONFIGURE_LOGICAL_BACKGROUND(lbg: string) { 
    if (__default__) throw new Error("[Stage.CONFIGURE_LOGICAL_BACKGROUND] Default Stage has already been configured.")
    CONFIGURE_LOGICAL_BACKGROUND = lbg;
  },

  set CONFIGURE_VIRTUAL_BACKGROUND(vbg: string) { 
    if (__default__) throw new Error("[Stage.CONFIGURE_VIRTUAL_BACKGROUND] Default Stage has already been configured.")
    CONFIGURE_VIRTUAL_BACKGROUND = vbg;
  },

  set CONFIGURE_INNER_WIDTH(w: "auto" | number) { 
    if (__default__) throw new Error("[Stage.CONFIGURE_INNER_WIDTH ] Default Stage has already been configured.")
    CONFIGURE_INNER_WIDTH  = w;
  },

  set CONFIGURE_INNER_HEIGHT(h: "auto" | number) {
    if (__default__) throw new Error("[Stage.CONFIGURE_INNER_HEIGHT] Default Stage has already been configured.")
    CONFIGURE_INNER_HEIGHT = h;
  },

  set CONFIGURE_SCALE_INCREMENT(si: "auto" | number) {
    if (__default__) throw new Error("[Stage.CONFIGURE_SCALE_INCREMENT] Default Stage has already been configured.")
    CONFIGURE_SCALE_INCREMENT = si;
  },

  set CONFIGURE_IMAGE_SMOOTHING(is: false | ImageSmoothingQuality) {
    if (__default__) throw new Error("[Stage.CONFIGURE_IMAGE_SMOOTHING] Default Stage has already been configured.")
    CONFIGURE_IMAGE_SMOOTHING = is;
  },
}


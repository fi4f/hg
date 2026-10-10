import { dict, num } from "./data";
import { Events } from "./core/events";


export type Options = {
  c?: string | HTMLCanvasElement | CanvasRenderingContext2D | null;
  w?: number | null;
  h?: number | null;
  si?: number | null;
  ups?: number | null;
}

type Configuration = {
  c: HTMLCanvasElement | CanvasRenderingContext2D | null;
  w: number | null;
  h: number | null;
  si: number | null;
  ups: number;
}

export type Frame = {
  x: number;
  y: number;
  w: number;
  h: number;
  scale: number;
}

export type App = {
  c: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  buffer: HTMLCanvasElement;
  graphics: CanvasRenderingContext2D;
  configuration: Configuration;
  requests: Partial<Configuration>[];
  events: Events<{ app: App; dt: number }>;
  ownsCanvas: boolean;
  running: boolean;
  disposed: boolean;
  updating: boolean;
  animation: number | null;
  time: number | null;
  elapsed: number;
}


function configuration(o: unknown): Partial<Configuration> {
  const options = dict.assert(o ?? {});
  const result: Partial<Configuration> = {};

  if (Object.hasOwn(options, "c")) result.c = destination(options.c);

  for (const key of ["w", "h", "si", "ups"] as const) {
    if (!Object.hasOwn(options, key)) continue;

    const value = options[key];
    if (value == null) {
      if (key === "ups") result.ups = 60;
      else result[key] = null;
      continue;
    }

    const n = num.assert(value);
    if (n <= 0) throw new RangeError(`[App] ${key} must be positive`);
    if (key === "ups" && !Number.isFinite(1 / n)) {
      throw new RangeError("[App] ups must produce a finite update interval");
    }
    if ((key === "w" || key === "h") && (!Number.isInteger(n) || n > 0xffffffff)) {
      throw new RangeError(`[App] ${key} must be an unsigned pixel dimension`);
    }

    result[key] = n;
  }

  return result;
}

function destination(c: unknown): Configuration["c"] {
  if (c == null) return null;
  if (typeof c === "string") c = document.getElementById(c);

  if (c instanceof HTMLCanvasElement || c instanceof CanvasRenderingContext2D) return c;
  throw new TypeError("[App] Expected a canvas ID, canvas, or 2D context");
}

function context(c: HTMLCanvasElement) {
  const context = c.getContext("2d");
  if (!context) throw new Error("[App] Canvas cannot provide a 2D context");
  return context;
}

function createCanvas() {
  const c = document.createElement("canvas");
  c.style.position = "fixed";
  c.style.inset = "0";
  c.style.width = "100%";
  c.style.height = "100%";
  c.style.display = "block";
  return c;
}

function resize(app: App) {
  if (app.ownsCanvas) {
    const ratio = window.devicePixelRatio || 1;
    const w = Math.round(window.innerWidth  * ratio);
    const h = Math.round(window.innerHeight * ratio);

    if (app.c.width  !== w) app.c.width  = w;
    if (app.c.height !== h) app.c.height = h;
  }

  const w = app.configuration.w ?? app.c.width;
  const h = app.configuration.h ?? app.c.height;

  if (app.buffer.width  !== w) app.buffer.width  = w;
  if (app.buffer.height !== h) app.buffer.height = h;
}

function apply(app: App, request: Partial<Configuration>) {
  const next = { ...app.configuration, ...request };

  if (next.c !== app.configuration.c) {
    const c = next.c === null ? createCanvas()
      : next.c instanceof HTMLCanvasElement ? next.c : next.c.canvas;
    const ctx = next.c instanceof CanvasRenderingContext2D ? next.c : context(c);

    const ownsCanvas = next.c === null || (app.ownsCanvas && app.c === c);

    if (next.c === null) document.body.append(c);
    if (app.ownsCanvas && app.c !== c) app.c.remove();

    app.c = c;
    app.context = ctx;
    app.ownsCanvas = ownsCanvas;
  }

  app.configuration = next;
}

function active(app: App) {
  if (app.disposed) throw new Error("[App] Application has been disposed");
}

function animate(app: App, time: number) {
  app.animation = null;
  if (!app.running) return;

  let interval = 1 / app.configuration.ups;
  app.elapsed += app.time === null ? interval : Math.max(0, (time - app.time) / 1000);
  app.time = time;

  try {
    // Limit catch-up work when a tab has been inactive.
    let updates = 0;
    while (app.running && app.elapsed >= interval && updates < 5) {
      app.elapsed -= interval;
      App.update(app, interval);
      updates++;
      interval = 1 / app.configuration.ups;
    }

    if (updates === 5) app.elapsed %= interval;
    if (!app.disposed) App.present(app);
  } catch (error) {
    App.pause(app);
    throw error;
  }

  if (app.running && app.animation === null) {
    app.animation = window.requestAnimationFrame(time => animate(app, time));
  }
}


export const App = {
  new(o: unknown = null): App {
    const cfg: Configuration = {
      c: null, w: null, h: null, si: null, ups: 60,
      ...configuration(o),
    };

    const c = cfg.c === null ? createCanvas()
      : cfg.c instanceof HTMLCanvasElement ? cfg.c : cfg.c.canvas;
    const ctx = cfg.c instanceof CanvasRenderingContext2D ? cfg.c : context(c);
    const buffer = document.createElement("canvas");
    const graphics = context(buffer);

    const app: App = {
      c,
      context: ctx,
      buffer,
      graphics,
      configuration: cfg,
      requests: [],
      events: Events.new(),
      ownsCanvas: cfg.c === null,
      running: false,
      disposed: false,
      updating: false,
      animation: null,
      time: null,
      elapsed: 0,
    };

    resize(app);
    if (app.ownsCanvas) document.body.append(c);
    return app;
  },

  configure(app: App, o: unknown = null) {
    active(app);
    app.requests.push(configuration(o));
  },

  update(app: App, dt: number = 0) {
    active(app);
    num.assert(dt);
    if (dt < 0) throw new RangeError("[App] dt must be nonnegative");
    if (app.updating) throw new Error("[App] Cannot update during an update");

    app.updating = true;

    try {
      const requests = app.requests.splice(0);
      for (const request of requests) apply(app, request);

      resize(app);
      Events.emit(app.events, "update", { app, dt });
    } finally {
      app.updating = false;
    }
  },

  frame(app: App): Frame {
    active(app);

    const w = app.buffer.width;
    const h = app.buffer.height;
    const si = app.configuration.si;
    const fit = w === 0 || h === 0 ? 0 : Math.min(app.c.width / w, app.c.height / h);
    const scale = si === null ? fit : Math.max(si, fit - fit % si);

    return {
      x: (app.c.width  - w * scale) / 2,
      y: (app.c.height - h * scale) / 2,
      w: w * scale,
      h: h * scale,
      scale,
    };
  },

  present(app: App) {
    active(app);
    const frame = App.frame(app);
    const ctx = app.context;

    ctx.save();
    try {
      ctx.resetTransform();
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
      ctx.filter = "none";
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.imageSmoothingEnabled = app.configuration.si === null;
      ctx.clearRect(0, 0, app.c.width, app.c.height);

      if (frame.w > 0 && frame.h > 0) {
        ctx.drawImage(app.buffer, frame.x, frame.y, frame.w, frame.h);
      }
    } finally {
      ctx.restore();
    }

    return frame;
  },

  start(app: App) {
    active(app);
    if (app.running) return;

    app.running = true;
    app.time = null;
    app.elapsed = 0;
    app.animation = window.requestAnimationFrame(time => animate(app, time));
  },

  pause(app: App) {
    if (app.animation !== null) window.cancelAnimationFrame(app.animation);
    app.animation = null;
    app.running = false;
    app.time = null;
    app.elapsed = 0;
  },

  dispose(app: App) {
    if (app.disposed) return;
    App.pause(app);

    app.disposed = true;
    app.requests.length = 0;
    app.events.handlers = Object.create(null);
    app.events.pending.length = 0;
    app.buffer.width = 0;
    app.buffer.height = 0;

    if (app.ownsCanvas) app.c.remove();
  },
}

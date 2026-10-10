import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { basename, dirname, join, resolve } from "node:path";
import { after, beforeEach, test } from "node:test";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const buildRoot = mkdtempSync(join(tmpdir(), "hg-app-test-"));

after(() => {
  const target = resolve(buildRoot);
  if (dirname(target) !== resolve(tmpdir()) || !basename(target).startsWith("hg-app-test-")) {
    throw new Error("Refusing to remove an unexpected test build directory");
  }
  rmSync(target, { recursive: true, force: true });
});

execFileSync(process.execPath, [
  join(projectRoot, "node_modules/typescript/bin/tsc"),
  "--ignoreConfig", "--strict", "--noUnusedLocals", "--noUnusedParameters",
  "--target", "ES2023", "--module", "CommonJS",
  "--moduleResolution", "Node10", "--ignoreDeprecations", "6.0",
  "--outDir", buildRoot, join(projectRoot, "src/hg/index.ts"),
  join(projectRoot, "src/hg/data/ref.ts"),
], { cwd: projectRoot, stdio: "pipe" });

const require = createRequire(import.meta.url);
const { hg, App, Events } = require(join(buildRoot, "index.js"));
const { ref } = require(join(buildRoot, "data/ref.js"));

class CanvasContext {
  constructor(canvas) {
    this.canvas = canvas;
    this.calls = [];
    this.states = [];
    this.globalAlpha = 1;
    this.globalCompositeOperation = "source-over";
    this.imageSmoothingEnabled = true;
    this.filter = "none";
    this.shadowColor = "transparent";
    this.shadowBlur = 0;
    this.shadowOffsetX = 0;
    this.shadowOffsetY = 0;
  }

  save() {
    this.states.push(Object.fromEntries(Object.entries(this).filter(([key]) =>
      !["canvas", "calls", "states"].includes(key))));
  }

  restore() {
    Object.assign(this, this.states.pop());
  }

  resetTransform() {
    this.calls.push(["resetTransform"]);
  }

  clearRect(...args) {
    this.calls.push(["clearRect", ...args]);
  }

  drawImage(...args) {
    this.calls.push(["drawImage", ...args]);
    if (this.failDraw) throw new Error("Drawing failed");
  }
}

class Canvas {
  constructor(w = 300, h = 150) {
    this.width = w;
    this.height = h;
    this.style = {};
    this.context = new CanvasContext(this);
  }

  getContext(mode) {
    return mode === "2d" && !this.blocked ? this.context : null;
  }

  remove() {
    document.body.canvases.delete(this);
  }
}

let callbacks;
let elements;

beforeEach(() => {
  callbacks = new Map();
  elements = new Map();
  let id = 0;

  globalThis.HTMLCanvasElement = Canvas;
  globalThis.CanvasRenderingContext2D = CanvasContext;
  globalThis.document = {
    body: {
      canvases: new Set(),
      append(c) { this.canvases.add(c); },
    },
    createElement() { return new Canvas(); },
    getElementById(id) { return elements.get(id) ?? null; },
  };
  globalThis.window = {
    innerWidth: 800,
    innerHeight: 600,
    devicePixelRatio: 2,
    requestAnimationFrame(callback) {
      callbacks.set(++id, callback);
      return id;
    },
    cancelAnimationFrame(id) { callbacks.delete(id); },
  };
});

function animate(time) {
  const [id, callback] = callbacks.entries().next().value;
  callbacks.delete(id);
  callback(time);
}

test("hg exposes namespace operations and apps keep separate state", () => {
  assert.equal(hg.App, App);
  assert.equal(hg.Events, Events);
  assert.equal(typeof hg.num.new, "function");

  const a = App.new();
  const b = App.new();
  assert.notEqual(a.c, b.c);
  assert.notEqual(a.buffer, b.buffer);
  assert.notEqual(a.events, b.events);
  assert.equal(a.running, false);
  assert.equal(a.configuration.ups, 60);
  assert.equal(a.c.width, 1600);
  assert.equal(a.c.height, 1200);
  assert.equal(a.buffer.width, 1600);
  assert.equal(a.buffer.height, 1200);
  assert.equal(document.body.canvases.size, 2);
});

test("canvas IDs, elements, and contexts all resolve without resizing the destination", () => {
  const canvas = new Canvas(800, 600);
  elements.set("preview", canvas);

  for (const c of ["preview", canvas, canvas.context]) {
    const app = App.new({ c, w: 512, h: 256 });
    assert.equal(app.c, canvas);
    assert.equal(app.context, canvas.context);
    assert.equal(app.ownsCanvas, false);
    assert.equal(app.buffer.width, 512);
    assert.equal(app.buffer.height, 256);
    assert.equal(canvas.width, 800);
    assert.equal(canvas.height, 600);
  }
  assert.equal(document.body.canvases.size, 0);
});

test("unset options use defaults and invalid options fail without creating a canvas", () => {
  const app = App.new({ c: undefined, w: null, h: undefined, si: null, ups: null });
  assert.equal(app.configuration.si, null);
  assert.equal(app.configuration.ups, 60);
  assert.equal(app.buffer.width, 1600);

  for (const c of ["missing", {}, 1]) {
    assert.throws(() => App.new({ c }), TypeError);
  }
  for (const value of [false, "options", [], 1]) {
    assert.throws(() => App.new(value), TypeError);
  }
  for (const key of ["w", "h", "si", "ups"]) {
    for (const value of [0, -1, NaN, Infinity, "512", false]) {
      assert.throws(() => App.new({ [key]: value }), undefined, `${key}: ${value}`);
    }
  }
  for (const w of [0.5, 4294967296]) assert.throws(() => App.new({ w }), RangeError);
  assert.throws(() => App.new({ ups: Number.MIN_VALUE }), RangeError);
  assert.equal(document.body.canvases.size, 1);
});

test("configuration is copied, queued, and applied before the next update handler", () => {
  const app = App.new({ c: new Canvas(800, 600), w: 512, h: 512, si: 1 });
  const request = { w: 320 };
  App.configure(app, request);
  request.w = 10;
  App.configure(app, { h: 240 });
  assert.equal(app.buffer.width, 512);

  let observed;
  Events.on(app.events, "update", ({ app, dt }) => {
    observed = [app.buffer.width, app.buffer.height, dt];
    App.configure(app, { si: null, w: undefined });
  });
  App.update(app, 0.25);
  assert.deepEqual(observed, [320, 240, 0.25]);
  assert.equal(app.configuration.si, 1);
  assert.equal(app.requests.length, 1);

  App.update(app);
  assert.equal(app.configuration.si, null);
  assert.equal(app.buffer.width, 800);
  assert.equal(app.buffer.height, 240);
  const queued = app.requests.length;
  assert.throws(() => App.configure(app, { w: -1 }), RangeError);
  assert.equal(app.requests.length, queued);
});

test("buffer dimensions follow bitmap changes only when unset", () => {
  const canvas = new Canvas(800, 600);
  const app = App.new({ c: canvas, h: 256 });
  canvas.width = 1000;
  canvas.height = 700;
  App.update(app);
  assert.equal(app.buffer.width, 1000);
  assert.equal(app.buffer.height, 256);

  const owned = App.new({ w: 512 });
  window.innerWidth = 900;
  window.innerHeight = 700;
  App.update(owned);
  assert.equal(owned.c.width, 1800);
  assert.equal(owned.c.height, 1400);
  assert.equal(owned.buffer.width, 512);
  assert.equal(owned.buffer.height, 1400);
});

test("frame geometry matches the documented whole-number fit and centered clipping", () => {
  const examples = [
    [1024, 1024, 2, 0, 0],
    [800, 600, 1, 144, 44],
    [320, 240, 1, -96, -136],
    [1920, 1080, 2, 448, 28],
  ];
  for (const [w, h, scale, x, y] of examples) {
    const app = App.new({ c: new Canvas(w, h), w: 512, h: 512, si: 1 });
    assert.deepEqual(App.frame(app), { x, y, w: 512 * scale, h: 512 * scale, scale });
  }
  const app = App.new({ c: new Canvas(800, 600), w: 512, h: 256 });
  assert.deepEqual(App.frame(app), { x: 0, y: 100, w: 800, h: 400, scale: 1.5625 });

  App.configure(app, { si: 0.5 });
  App.update(app);
  assert.equal(App.frame(app).scale, 1.5);
});

test("presentation clears letterboxing, draws the buffer, and restores destination state", () => {
  const app = App.new({ c: new Canvas(800, 600), w: 512, h: 512, si: 1 });
  const ctx = app.context;
  ctx.globalAlpha = 0.25;
  ctx.imageSmoothingEnabled = true;
  ctx.filter = "blur(5px)";
  App.present(app);

  assert.deepEqual(ctx.calls, [
    ["resetTransform"],
    ["clearRect", 0, 0, 800, 600],
    ["drawImage", app.buffer, 144, 44, 512, 512],
  ]);
  assert.equal(ctx.globalAlpha, 0.25);
  assert.equal(ctx.imageSmoothingEnabled, true);
  assert.equal(ctx.filter, "blur(5px)");
  assert.equal(ctx.states.length, 0);

  ctx.failDraw = true;
  assert.throws(() => App.present(app), /Drawing failed/);
  assert.equal(ctx.states.length, 0);
  assert.equal(ctx.globalAlpha, 0.25);
});

test("zero-size destinations and buffers do not cause invalid draws", () => {
  const app = App.new({ c: new Canvas(0, 0) });
  assert.deepEqual(App.present(app), { x: 0, y: 0, w: 0, h: 0, scale: 0 });
  assert.equal(app.context.calls.some(([name]) => name === "drawImage"), false);
});

test("canvas changes keep ownership correct and failed context creation keeps current state", () => {
  const app = App.new();
  const original = app.c;
  const blocked = new Canvas();
  blocked.blocked = true;
  App.configure(app, { c: blocked, w: 10 });
  assert.throws(() => App.update(app), /2D context/);
  assert.equal(app.c, original);
  assert.equal(app.configuration.w, null);
  assert.equal(app.updating, false);

  const external = new Canvas();
  document.body.append(external);
  App.configure(app, { c: external });
  App.update(app);
  assert.equal(document.body.canvases.has(original), false);
  App.dispose(app);
  assert.equal(document.body.canvases.has(external), true);

  const owned = App.new();
  const canvas = owned.c;
  App.configure(owned, { c: canvas.context });
  App.update(owned);
  App.dispose(owned);
  assert.equal(document.body.canvases.has(canvas), false);
});

test("start, pause, resume, and disposal manage one animation request per app", () => {
  const app = App.new({ ups: 10 });
  const updates = [];
  Events.on(app.events, "update", ({ dt }) => updates.push(dt));
  App.start(app);
  App.start(app);
  assert.equal(callbacks.size, 1);
  animate(0);
  animate(50);
  animate(100);
  assert.deepEqual(updates, [0.1, 0.1]);

  animate(10000);
  assert.equal(updates.length, 7);
  assert.equal(callbacks.size, 1);
  App.pause(app);
  assert.equal(callbacks.size, 0);
  App.start(app);
  animate(20000);
  assert.equal(updates.length, 8);
  App.dispose(app);
  App.dispose(app);
  assert.equal(callbacks.size, 0);
  assert.equal(document.body.canvases.size, 0);
  for (const operation of [App.start, App.update, App.present, App.frame, App.configure]) {
    assert.throws(() => operation(app), /disposed/);
  }
});

test("manual updates validate time and recover after a callback error", () => {
  const app = App.new();
  for (const dt of [-1, NaN, Infinity, "1"]) assert.throws(() => App.update(app, dt));
  const handler = Events.on(app.events, "update", () => App.update(app));
  assert.throws(() => App.update(app), /during an update/);
  assert.equal(app.updating, false);
  Events.off(app.events, "update", handler);
  App.update(app);

  Events.on(app.events, "update", () => { throw new Error("Update failed"); });
  App.start(app);
  assert.throws(() => animate(0), /Update failed/);
  assert.equal(app.running, false);
  assert.equal(callbacks.size, 0);
});

test("disposing from an update callback prevents another animation request", () => {
  const app = App.new();
  Events.on(app.events, "update", () => App.dispose(app));
  App.start(app);
  animate(0);
  assert.equal(app.disposed, true);
  assert.equal(callbacks.size, 0);
});

test("events deduplicate handlers, snapshot subscriptions, and queue nested emissions", () => {
  const events = Events.new();
  const calls = [];
  const second = value => calls.push(`second:${value}`);
  const third = value => calls.push(`third:${value}`);
  Events.on(events, "update", value => {
    calls.push(`first:${value}`);
    if (value === 1) {
      Events.off(events, "update", second);
      Events.on(events, "update", third);
      Events.emit(events, "update", 2);
    }
  });
  Events.on(events, "update", second);
  Events.on(events, "update", second);
  Events.emit(events, "update", 1);
  assert.deepEqual(calls, ["first:1", "second:1", "first:2", "third:2"]);
  assert.equal(events.requests.length, 0);
  assert.equal(events.dispatching, false);
});

test("events support object prototype names and discard queued work after an error", () => {
  const events = Events.new();
  let value;
  Events.on(events, "__proto__", input => { value = input; });
  Events.emit(events, "__proto__", 7);
  assert.equal(value, 7);
  const fail = Events.on(events, "error", () => {
    Events.emit(events, "__proto__", 9);
    throw new Error("Handler failed");
  });
  assert.throws(() => Events.emit(events, "error", null), /Handler failed/);
  assert.equal(value, 7);
  assert.equal(events.dispatching, false);
  assert.equal(events.requests.length, 0);
  Events.off(events, "error", fail);
  Events.emit(events, "__proto__", 10);
  assert.equal(value, 10);
});

test("reference namespace operations resolve and release the existing table entries", () => {
  const value = {};
  const handle = ref.new(value);
  assert.equal(ref.resolve(handle), value);
  ref.release(handle);
  assert.throws(() => ref.resolve(handle), /does not exist/);
  assert.throws(() => ref.release(handle), /does not exist/);
});

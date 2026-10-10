import { hg } from "./hg";


const app = hg.App.new({ w: 256, h: 256, si: 1 });
let time = 0;

hg.Events.on(app.events, "update", ({ app, dt }) => {
  time += dt;

  const ctx = app.graphics;
  const w = app.buffer.width;
  const h = app.buffer.height;

  ctx.fillStyle = "#161b22";
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "#91d5ff";
  ctx.fillRect(112 + Math.sin(time) * 64, 112 + Math.cos(time) * 64, 32, 32);

  ctx.fillStyle = "#e6edf3";
  ctx.font = "16px monospace";
  ctx.fillText("Mercury", 16, 28);
});

hg.App.start(app);

if (import.meta.hot) {
  import.meta.hot.dispose(() => hg.App.dispose(app));
}

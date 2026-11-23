// Rendert die TikTok/Reels-Videos aus studio.html als MP4 (1080x1920, 30 fps).
// Aufruf (im Repo-Ordner): node marketing/render.js [video-id]
// Braucht: Node, Playwright mit Chromium, ffmpeg.
const { chromium } = require("playwright");
const { execFileSync } = require("child_process");
const fs = require("fs"), path = require("path"), os = require("os");

const DIR = __dirname, ROOT = path.join(DIR, ".."), OUT = path.join(DIR, "videos"), FPS = 30;

async function appShots(browser) {
  // Echte Screenshots der App für das Story-Video
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, locale: "de-DE" });
  const p = await ctx.newPage();
  const day = new Date(); const key = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const sessions = [];
  for (let i = 1; i <= 6; i++) { const d = new Date(day); d.setDate(d.getDate() - i); sessions.push({ day: key(d), min: 45, ok: true, at: d.getTime() }); }
  const base = { coins: 312, owned: ["none", "forest", "headphones"], hat: "headphones", bg: "forest", sessions, lang: "de", dur: 45 };
  const url = "file://" + path.join(ROOT, "index.html");
  const now = Date.now();
  await p.addInitScript(([b, now]) => { if (!sessionStorage.getItem("seeded")) { localStorage.setItem("moosi.v1", JSON.stringify(b)); sessionStorage.setItem("seeded", "1"); } }, [{ ...base, active: { start: now - 31 * 60000, end: now + 14 * 60000 + 5000, dur: 45 } }, now]);
  await p.goto(url); await p.waitForTimeout(600);
  await p.screenshot({ path: path.join(DIR, "shot-running.png") });
  await p.evaluate(() => { const s = window.__moosi.state(); s.active.end = Date.now() - 1; });
  await p.waitForTimeout(1500);
  await p.screenshot({ path: path.join(DIR, "shot-done.png") });
  await ctx.close();
}

async function render(browser, id, dur) {
  const ctx = await browser.newContext({ viewport: { width: 540, height: 960 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  await p.goto("file://" + path.join(DIR, "studio.html"));
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "moosi-"));
  const frames = Math.round(dur * FPS);
  for (let i = 0; i < frames; i++) {
    await p.evaluate(([id, t]) => window.renderFrame(id, t), [id, i / FPS]);
    await p.screenshot({ path: path.join(tmp, `f${String(i).padStart(4, "0")}.jpg`), type: "jpeg", quality: 92 });
  }
  await ctx.close();
  const out = path.join(OUT, `${id}.mp4`);
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-framerate", String(FPS), "-i", path.join(tmp, "f%04d.jpg"),
    "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo", "-shortest",
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-preset", "medium", "-crf", "20", "-c:a", "aac", "-movflags", "+faststart", out]);
  // Vorschaubild (Cover) aus der Mitte
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-ss", String(dur * 0.85), "-i", out, "-frames:v", "1", path.join(OUT, `${id}-cover.jpg`)]);
  fs.rmSync(tmp, { recursive: true, force: true });
  console.log("fertig:", path.relative(ROOT, out));
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  await appShots(browser);
  const p = await browser.newPage(); await p.goto("file://" + path.join(DIR, "studio.html"));
  const list = await p.evaluate(() => window.VIDEOS); await p.close();
  const only = process.argv[2];
  for (const [id, dur] of Object.entries(list)) if (!only || only === id) await render(browser, id, dur);
  await browser.close();
})();

"use strict";
(() => {
const CFG = window.MOOSI_CONFIG || {};
const KEY = "moosi.v1";
const GRACE_MS = 10000; // so lange darf man kurz weg sein, ohne gefragt zu werden
const $ = (id) => document.getElementById(id);

// ---------- Texte ----------
const T = {
  de: {
    start: "Fokus starten", giveUp: "Aufgeben", shop: "Shop", stats: "Statistik", share: "Teilen", close: "Schließen",
    privacy: "Datenschutz", once: "einmalig, kein Abo", buy: "Pro kaufen", haveKey: "Schon gekauft? Lizenzschlüssel eingeben:",
    activate: "Freischalten", soon: "Pro kommt bald!",
    idle: ["Bereit, wenn du es bist 🌱", "Handy weg, Kopf an.", "Ein Block. Mehr nicht."],
    focus: ["Ich wachse… 🌿", "Weiter so!", "Ruhig bleiben, fast geschafft.", "Du machst das gut."],
    done: (m, c) => `Geschafft! ${m} Min fokussiert, +${c} 🪙`,
    failed: "Moosi ist ein bisschen traurig. Nächster Versuch? 💚",
    gaveUp: "Kein Ding. Jeder Anfang zählt.",
    backQ: "Willkommen zurück!", backText: "Du warst kurz weg. Ehrliche Antwort:",
    backLock: "Handy war gesperrt / weggelegt", backApp: "Ich war in einer anderen App",
    today: "Heute", week: "7 Tage", total: "Gesamt", min: "Min", streakDays: "Streak (Tage)",
    proOnly: "Pro", buyFor: (c) => `${c} 🪙`, notEnough: "Nicht genug Münzen – fokussier noch ein bisschen!",
    hats: "Hüte", bgs: "Welten", month: "30 Tage (Pro)", export: "Als CSV exportieren (Pro)",
    perks: ["Eigene Fokuszeit bis 3 Stunden", "Exklusive Hüte & Welten", "30-Tage-Statistik + CSV-Export", "Du unterstützt einen Schüler-Entwickler 💚"],
    licOk: "Pro ist aktiv. Danke! ✨", licBad: "Schlüssel nicht gültig.", licNet: "Keine Verbindung. Später nochmal versuchen.", checking: "Prüfe…",
    shareText: (m, s) => `Heute ${m} Min fokussiert mit Moosi 🌱 · Streak: ${s}`,
    custom: "Eigene",
  },
  en: {
    start: "Start focus", giveUp: "Give up", shop: "Shop", stats: "Stats", share: "Share", close: "Close",
    privacy: "Privacy", once: "one-time, no subscription", buy: "Get Pro", haveKey: "Already bought? Enter license key:",
    activate: "Unlock", soon: "Pro coming soon!",
    idle: ["Ready when you are 🌱", "Phone down, mind on.", "One block. That's all."],
    focus: ["Growing… 🌿", "Keep going!", "Stay calm, almost there.", "You're doing great."],
    done: (m, c) => `Done! ${m} min focused, +${c} 🪙`,
    failed: "Moosi is a little sad. Try again? 💚",
    gaveUp: "No worries. Every start counts.",
    backQ: "Welcome back!", backText: "You were away for a bit. Honest answer:",
    backLock: "Phone was locked / put away", backApp: "I was in another app",
    today: "Today", week: "7 days", total: "Total", min: "min", streakDays: "Streak (days)",
    proOnly: "Pro", buyFor: (c) => `${c} 🪙`, notEnough: "Not enough coins – focus a bit more!",
    hats: "Hats", bgs: "Worlds", month: "30 days (Pro)", export: "Export as CSV (Pro)",
    perks: ["Custom focus time up to 3 hours", "Exclusive hats & worlds", "30-day stats + CSV export", "You support a student developer 💚"],
    licOk: "Pro is active. Thank you! ✨", licBad: "License key not valid.", licNet: "No connection. Try again later.", checking: "Checking…",
    shareText: (m, s) => `Focused ${m} min today with Moosi 🌱 · Streak: ${s}`,
    custom: "Custom",
  },
};

// ---------- Shop ----------
const HATS = [
  { id: "none", ico: "🚫", cost: 0 },
  { id: "cap", ico: "🧢", cost: 20 },
  { id: "flower", ico: "🌼", cost: 30 },
  { id: "headphones", ico: "🎧", cost: 40 },
  { id: "wizard", ico: "🧙", cost: 60 },
  { id: "crown", ico: "👑", cost: 80, pro: true },
];
const BGS = [
  { id: "forest", ico: "🌲", cost: 0, grad: ["#3f7f4f", "#1f4a2c"] },
  { id: "night", ico: "🌙", cost: 40, grad: ["#2b3a67", "#0f1630"] },
  { id: "sunset", ico: "🌅", cost: 50, grad: ["#f08a5d", "#7a3b69"] },
  { id: "ocean", ico: "🌊", cost: 0, pro: true, grad: ["#2a8fbd", "#0b3954"] },
  { id: "space", ico: "🪐", cost: 0, pro: true, grad: ["#3a1c71", "#0b0b1e"] },
];
const PRESETS = [15, 25, 45, 60];

// ---------- Speicher ----------
const fresh = () => ({ coins: 0, owned: ["none", "forest"], hat: "none", bg: "forest", sessions: [], pro: false,
  license: "", lang: (navigator.language || "de").startsWith("de") ? "de" : "en", dur: 25, active: null });
let S;
try { S = Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY) || "{}")); } catch { S = fresh(); }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* privater Modus */ } };
const t = () => T[S.lang] || T.de;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ---------- Datum & Statistik ----------
const dayKey = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const minutesOn = (key) => S.sessions.filter((s) => s.ok && s.day === key).reduce((a, s) => a + s.min, 0);
function streak() {
  let n = 0; const d = new Date();
  if (!minutesOn(dayKey(d))) d.setDate(d.getDate() - 1); // heute noch offen: Streak läuft weiter
  while (minutesOn(dayKey(d)) > 0) { n++; d.setDate(d.getDate() - 1); }
  return n;
}

// ---------- Moosi zeichnen ----------
function moosiSVG(stage, mood) {
  const r = 34 + stage * 9; // wächst
  const cy = 150 - r * 0.55;
  const eyeY = cy - r * 0.1;
  const sad = mood === "sad";
  const mouth = sad
    ? `<path d="M${110 - 10} ${eyeY + 22} q10 -8 20 0" stroke="#1d2b1d" stroke-width="3" fill="none" stroke-linecap="round"/>`
    : `<path d="M${110 - 10} ${eyeY + 16} q10 10 20 0" stroke="#1d2b1d" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  const sprouts = [];
  for (let i = 0; i < stage; i++) {
    const x = 110 + (i - (stage - 1) / 2) * 16;
    sprouts.push(`<path d="M${x} ${cy - r + 4} q-6 -14 0 -22" stroke="#3d8b4e" stroke-width="3" fill="none"/><ellipse cx="${x + 5}" cy="${cy - r - 14}" rx="6" ry="3.5" fill="#6cc27f" transform="rotate(-30 ${x + 5} ${cy - r - 14})"/>`);
  }
  if (stage >= 4) sprouts.push(`<circle cx="${110 + r * 0.55}" cy="${cy - r * 0.7}" r="7" fill="#ffd34e"/><circle cx="${110 + r * 0.55}" cy="${cy - r * 0.7}" r="3" fill="#f08a24"/>`);
  const hatY = cy - r + 2;
  const hats = {
    none: "",
    cap: `<path d="M${85} ${hatY} q25 -30 50 0 z" fill="#d64545"/><rect x="${125}" y="${hatY - 4}" width="26" height="6" rx="3" fill="#a83232"/>`,
    flower: `<g transform="translate(${92} ${hatY - 6})"><circle r="9" fill="#fff"/><circle r="4" fill="#f5b700"/></g>`,
    headphones: `<path d="M${110 - r * 0.85} ${cy} a${r * 0.85} ${r * 0.85} 0 0 1 ${r * 1.7} 0" stroke="#333" stroke-width="5" fill="none"/><rect x="${110 - r * 0.95}" y="${cy - 8}" width="12" height="20" rx="5" fill="#555"/><rect x="${110 + r * 0.95 - 12}" y="${cy - 8}" width="12" height="20" rx="5" fill="#555"/>`,
    wizard: `<path d="M${90} ${hatY + 2} L${110} ${hatY - 48} L${130} ${hatY + 2} z" fill="#5b3fa8"/><circle cx="${110}" cy="${hatY - 20}" r="3" fill="#ffd34e"/>`,
    crown: `<path d="M${88} ${hatY} l6 -24 l10 14 l6 -18 l6 18 l10 -14 l6 24 z" fill="#f2c230" stroke="#b8860b" stroke-width="2"/>`,
  };
  const blush = sad ? "" : `<circle cx="${110 - r * 0.45}" cy="${eyeY + 12}" r="5" fill="#f29c9c" opacity=".6"/><circle cx="${110 + r * 0.45}" cy="${eyeY + 12}" r="5" fill="#f29c9c" opacity=".6"/>`;
  const tear = sad ? `<path d="M${110 + r * 0.32} ${eyeY + 6} q-3 8 0 10 q3 -2 0 -10" fill="#7cc6ff"/>` : "";
  return `<svg viewBox="0 0 220 220" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Moosi">
  <ellipse cx="110" cy="200" rx="62" ry="8" fill="rgba(0,0,0,.18)"/>
  <path d="M70 150 h80 l-10 48 h-60 z" fill="#c4744a"/><rect x="64" y="144" width="92" height="12" rx="4" fill="#d98a5c"/>
  ${sprouts.join("")}
  <ellipse cx="110" cy="${cy}" rx="${r}" ry="${r * 0.9}" fill="${sad ? "#7a9a72" : "#59a96a"}"/>
  <ellipse cx="${110 - r * 0.35}" cy="${cy - r * 0.45}" rx="${r * 0.3}" ry="${r * 0.15}" fill="#fff" opacity=".18"/>
  <circle cx="${110 - r * 0.32}" cy="${eyeY}" r="5" fill="#1d2b1d"/><circle cx="${110 + r * 0.32}" cy="${eyeY}" r="5" fill="#1d2b1d"/>
  <circle cx="${110 - r * 0.32 + 1.5}" cy="${eyeY - 1.5}" r="1.6" fill="#fff"/><circle cx="${110 + r * 0.32 + 1.5}" cy="${eyeY - 1.5}" r="1.6" fill="#fff"/>
  ${blush}${tear}${mouth}${hats[S.hat] || ""}
</svg>`;
}

// ---------- Timer ----------
let mood = "happy";
let hiddenAt = null;
let tickTimer = null;

function stageNow() {
  if (!S.active) return mood === "sad" ? 1 : Math.min(4, Math.floor(minutesOn(dayKey()) / 25));
  const p = 1 - (S.active.end - Date.now()) / (S.active.dur * 60000);
  return Math.max(0, Math.min(4, Math.floor(p * 5)));
}
const fmt = (ms) => { const s = Math.max(0, Math.ceil(ms / 1000)); return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`; };

function startFocus() {
  const now = Date.now();
  S.active = { start: now, end: now + S.dur * 60000, dur: S.dur };
  mood = "happy"; save(); say(pick(t().focus)); render(); tick();
}
function endFocus(ok, msg) {
  if (!S.active) return;
  const a = S.active;
  const min = ok ? a.dur : Math.floor((Date.now() - a.start) / 60000);
  S.sessions.push({ day: dayKey(), min, ok, at: Date.now() });
  if (S.sessions.length > 2000) S.sessions = S.sessions.slice(-2000);
  let coins = 0;
  if (ok) { coins = a.dur + (a.dur >= 45 ? 10 : 0); S.coins += coins; mood = "happy"; celebrate(); }
  S.active = null; save();
  say(ok ? t().done(a.dur, coins) : msg);
  render();
}
function tick() {
  clearInterval(tickTimer);
  const step = () => {
    if (!S.active) { clearInterval(tickTimer); return; }
    const left = S.active.end - Date.now();
    if (left <= 0) { endFocus(true); return; }
    $("time").textContent = fmt(left);
    document.title = `${fmt(left)} · Moosi`;
    const st = stageNow();
    if (st !== renderedStage) drawCreature();
  };
  step(); tickTimer = setInterval(step, 1000);
}
function celebrate() {
  try { navigator.vibrate && navigator.vibrate([80, 60, 120]); } catch { /* egal */ }
  try {
    const ac = new (window.AudioContext || window.webkitAudioContext)();
    [523, 659, 784].forEach((f, i) => {
      const o = ac.createOscillator(), g = ac.createGain();
      o.frequency.value = f; g.gain.setValueAtTime(.12, ac.currentTime + i * .12);
      g.gain.exponentialRampToValueAtTime(.001, ac.currentTime + i * .12 + .3);
      o.connect(g).connect(ac.destination); o.start(ac.currentTime + i * .12); o.stop(ac.currentTime + i * .12 + .3);
    });
  } catch { /* kein Ton */ }
}

// Weggehen erkennen. Web-Apps können "gesperrt" und "andere App" nicht unterscheiden → ehrlich fragen.
document.addEventListener("visibilitychange", () => {
  if (!S.active) return;
  if (document.hidden) { hiddenAt = Date.now(); return; }
  const away = hiddenAt ? Date.now() - hiddenAt : 0; hiddenAt = null;
  if (S.active.end <= Date.now()) { endFocus(true); return; }
  if (away > GRACE_MS) $("returnDlg").showModal();
});
$("returnDlg").addEventListener("close", () => {
  if ($("returnDlg").returnValue === "app") { mood = "sad"; endFocus(false, t().failed); }
  else say(pick(t().focus));
});

// ---------- Anzeige ----------
let renderedStage = -1;
function drawCreature() {
  renderedStage = stageNow();
  const c = $("creature");
  c.innerHTML = moosiSVG(renderedStage, mood);
  c.classList.toggle("bob", mood !== "sad");
  const bg = BGS.find((b) => b.id === S.bg) || BGS[0];
  $("stage").style.background = `linear-gradient(160deg, ${bg.grad[0]}, ${bg.grad[1]})`;
}
function say(text) { $("msg").textContent = text; }

function render() {
  const L = t();
  document.documentElement.lang = S.lang;
  $("langBtn").textContent = S.lang === "de" ? "EN" : "DE";
  document.querySelectorAll("[data-t]").forEach((el) => { const v = L[el.dataset.t]; if (typeof v === "string") el.textContent = v; });
  $("coins").textContent = `🪙 ${S.coins}`;
  $("streak").textContent = `🔥 ${streak()}`;

  const running = !!S.active;
  const box = $("presets"); box.innerHTML = "";
  const opts = [...PRESETS, "custom"];
  for (const p of opts) {
    const b = document.createElement("button"); b.type = "button";
    const isCustom = p === "custom";
    b.textContent = isCustom ? `${L.custom}${S.pro ? "" : " ✨"}` : `${p} ${L.min}`;
    const selected = isCustom ? !PRESETS.includes(S.dur) : S.dur === p;
    b.setAttribute("aria-pressed", String(selected));
    b.disabled = running;
    b.onclick = () => {
      if (isCustom) { if (!S.pro) { openPro(); return; } S.dur = +$("customRange").value; }
      else S.dur = p;
      save(); render();
    };
    box.appendChild(b);
  }
  $("customRow").hidden = running || !S.pro || PRESETS.includes(S.dur);
  $("customLabel").textContent = `${$("customRange").value} ${L.min}`;

  const btn = $("mainBtn");
  btn.textContent = running ? L.giveUp : L.start;
  btn.classList.toggle("ghost", running);
  if (!running) { $("time").textContent = fmt(S.dur * 60000); document.title = "Moosi – Fokus-Buddy"; }
  drawCreature();
}

$("mainBtn").onclick = () => { if (S.active) { mood = "sad"; endFocus(false, t().gaveUp); } else startFocus(); };
$("langBtn").onclick = () => { S.lang = S.lang === "de" ? "en" : "de"; save(); render(); say(pick(t().idle)); };
$("customRange").oninput = (e) => { S.dur = +e.target.value; save(); $("customLabel").textContent = `${S.dur} ${t().min}`; $("time").textContent = fmt(S.dur * 60000); };
document.querySelectorAll("[data-open]").forEach((b) => b.onclick = () => {
  const id = b.dataset.open;
  if (id === "shopDlg") renderShop();
  if (id === "statsDlg") renderStats();
  if (id === "proDlg") { openPro(); return; }
  $(id).showModal();
});

// ---------- Shop ----------
function renderShop() {
  const L = t(), box = $("shopList"); box.innerHTML = "";
  const section = (title, items, slot) => {
    const h = document.createElement("p"); h.className = "section-title"; h.textContent = title; box.appendChild(h);
    for (const it of items) {
      const b = document.createElement("button"); b.type = "button"; b.className = "item" + (S[slot] === it.id ? " on" : "");
      const owned = S.owned.includes(it.id) || (it.pro && S.pro);
      const label = owned ? "✓" : it.pro ? `✨ ${L.proOnly}` : L.buyFor(it.cost);
      b.innerHTML = `<span class="ico">${it.ico}</span><span class="cost"></span>`;
      b.querySelector(".cost").textContent = label;
      b.onclick = () => {
        if (!owned) {
          if (it.pro) { $("shopDlg").close(); openPro(); return; }
          if (S.coins < it.cost) { alert(L.notEnough); return; }
          S.coins -= it.cost; S.owned.push(it.id);
        }
        S[slot] = it.id; save(); render(); renderShop();
      };
      box.appendChild(b);
    }
  };
  section(L.hats, HATS, "hat");
  section(L.bgs, BGS, "bg");
}

// ---------- Statistik ----------
function renderStats() {
  const L = t(), body = $("statsBody");
  const days = S.pro ? 30 : 7;
  const list = [];
  for (let i = days - 1; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); list.push({ d, m: minutesOn(dayKey(d)) }); }
  const max = Math.max(25, ...list.map((x) => x.m));
  const week = list.slice(-7).reduce((a, x) => a + x.m, 0);
  const total = S.sessions.filter((s) => s.ok).reduce((a, s) => a + s.min, 0);
  const fmtDay = (d) => days > 7 ? String(d.getDate()) : d.toLocaleDateString(S.lang, { weekday: "short" }).slice(0, 2);
  body.innerHTML = `<div class="kpis"><div><b>${minutesOn(dayKey())}</b><span>${L.today} (${L.min})</span></div><div><b>${week}</b><span>${L.week} (${L.min})</span></div><div><b>${streak()}</b><span>${L.streakDays}</span></div></div>
  <div class="bars">${list.map((x) => `<div style="height:${(x.m / max) * 100}%" title="${x.m}"></div>`).join("")}</div>
  <div class="bars-labels">${list.map((x) => `<span>${days > 14 && x.d.getDate() % 5 ? "" : fmtDay(x.d)}</span>`).join("")}</div>
  <p class="small">${L.total}: ${total} ${L.min}</p>`;
  const ex = document.createElement("button"); ex.type = "button"; ex.textContent = S.pro ? L.export.replace(" (Pro)", "") : `✨ ${L.export}`;
  ex.onclick = () => {
    if (!S.pro) { $("statsDlg").close(); openPro(); return; }
    const csv = "datum,minuten,geschafft\n" + S.sessions.map((s) => `${s.day},${s.min},${s.ok ? 1 : 0}`).join("\n");
    download(new Blob([csv], { type: "text/csv" }), "moosi-statistik.csv");
  };
  body.appendChild(ex);
}
function download(blob, name) {
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

// ---------- Pro / Lizenz (Gumroad) ----------
function openPro() {
  const L = t();
  $("perks").innerHTML = ""; L.perks.forEach((p) => { const li = document.createElement("li"); li.textContent = p; $("perks").appendChild(li); });
  $("priceTag").textContent = CFG.price || "4,99 €";
  const buy = $("buyLink");
  if (CFG.buyUrl) { buy.href = CFG.buyUrl; buy.textContent = L.buy; } else { buy.removeAttribute("href"); buy.textContent = L.soon; }
  $("licMsg").textContent = S.pro ? L.licOk : "";
  $("licInput").value = S.license || "";
  $("proDlg").showModal();
}
async function verifyLicense(key, increment) {
  const body = new URLSearchParams({ product_id: CFG.gumroadProductId, license_key: key, increment_uses_count: String(increment) });
  const r = await fetch("https://api.gumroad.com/v2/licenses/verify", { method: "POST", body });
  const j = await r.json().catch(() => ({}));
  const p = j.purchase || {};
  return !!(j.success && !p.refunded && !p.chargebacked && !p.disputed);
}
$("licBtn").onclick = async () => {
  const L = t(), key = $("licInput").value.trim();
  if (!key) return;
  if (!CFG.gumroadProductId) { $("licMsg").textContent = L.soon; return; }
  $("licMsg").textContent = L.checking;
  try {
    if (await verifyLicense(key, true)) { S.pro = true; S.license = key; save(); $("licMsg").textContent = L.licOk; render(); }
    else $("licMsg").textContent = L.licBad;
  } catch { $("licMsg").textContent = L.licNet; }
};
// Erstattete Käufe still wieder sperren (nur online, Fehler ignorieren)
if (S.pro && S.license && CFG.gumroadProductId && navigator.onLine) {
  verifyLicense(S.license, false).then((ok) => { if (!ok) { S.pro = false; save(); render(); } }).catch(() => {});
}

// ---------- Teilen-Bild (für TikTok / Insta-Story) ----------
$("shareBtn").onclick = async () => {
  const L = t(), W = 1080, H = 1920;
  const cv = document.createElement("canvas"); cv.width = W; cv.height = H;
  const g = cv.getContext("2d");
  const bg = BGS.find((b) => b.id === S.bg) || BGS[0];
  const grad = g.createLinearGradient(0, 0, W, H); grad.addColorStop(0, bg.grad[0]); grad.addColorStop(1, bg.grad[1]);
  g.fillStyle = grad; g.fillRect(0, 0, W, H);
  const img = new Image();
  const svg = moosiSVG(Math.max(2, stageNow()), "happy");
  img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  await img.decode().catch(() => {});
  g.drawImage(img, 140, 380, 800, 800);
  g.fillStyle = "#fff"; g.textAlign = "center";
  g.font = "bold 120px system-ui, sans-serif"; g.fillText(`${minutesOn(dayKey())} ${L.min}`, W / 2, 1360);
  g.font = "600 60px system-ui, sans-serif"; g.fillText(`🔥 Streak: ${streak()}`, W / 2, 1470);
  g.font = "bold 72px system-ui, sans-serif"; g.fillText("Moosi 🌱", W / 2, 260);
  g.font = "48px system-ui, sans-serif"; g.globalAlpha = .85; g.fillText(CFG.siteUrl || location.host, W / 2, 1780);
  const blob = await new Promise((res) => cv.toBlob(res, "image/png"));
  if (!blob) return;
  const file = new File([blob], "moosi.png", { type: "image/png" });
  const text = L.shareText(minutesOn(dayKey()), streak());
  try {
    if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], text }); return; }
  } catch (e) { if (e && e.name === "AbortError") return; }
  download(blob, "moosi.png");
};

// ---------- Start ----------
if ("serviceWorker" in navigator && location.protocol !== "file:") navigator.serviceWorker.register("sw.js").catch(() => {});
render();
if (S.active) { if (S.active.end <= Date.now()) endFocus(true); else { say(pick(t().focus)); tick(); } }
else say(pick(t().idle));
window.__moosi = { state: () => S }; // für Tests
})();

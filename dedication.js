// ═══════════════════════════════════════════════════════════════
//  dedication.js — "Dedicated to You" chapter
//  A glass vinyl player (her photo as the label) that plays either
//  a dedicated mp3 (CONFIG.dedicationSong.url) or the background
//  music, with a live equalizer, seek bar and dedication lines.
// ═══════════════════════════════════════════════════════════════
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const song = CONFIG.dedicationSong || {};
  const lines = Array.isArray(CONFIG.dedicationLines) ? CONFIG.dedicationLines : [];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const card = $("dedication-section");
  if (!card) return;
  const vinyl = $("vinyl"), arm = $("tonearm"), eq = $("ded-eq");
  const playBtn = $("ded-play"), icon = playBtn.querySelector(".ded-icon");
  const fill = $("ded-fill"), bar = $("ded-bar"), cur = $("ded-cur"), dur = $("ded-dur");

  // Static text
  const raw = (CONFIG.recipientName || "you").trim();
  $("ded-name").textContent = raw.charAt(0).toUpperCase() + raw.slice(1);
  $("ded-title").textContent = song.title || "Our Song";
  $("ded-artist").textContent = song.artist || "";

  // ── Audio source ──
  // Own track → separate Audio that pauses background music while it plays.
  // No track → drive the existing background music (keeps the corner button in sync).
  const own = song.url ? new Audio(song.url) : null;
  if (own) { own.preload = "metadata"; own.loop = true; own.volume = 0.6; }
  const music = () => (window.LoveApp && LoveApp.music) || null;
  const audio = () => own || (music() && music().audio);
  let bgWasPlaying = false;

  function isPlaying() {
    const a = audio();
    return !!a && !a.paused;
  }
  function play() {
    if (own) {
      const m = music();
      bgWasPlaying = !!(m && m.isPlaying());
      if (bgWasPlaying) m.toggle();
      own.play().catch(() => {});
    } else if (music() && !music().isPlaying()) {
      music().toggle();
    }
  }
  function pause() {
    if (own) {
      own.pause();
      const m = music();
      if (bgWasPlaying && m && !m.isPlaying()) m.toggle();
      bgWasPlaying = false;
    } else if (music() && music().isPlaying()) {
      music().toggle();
    }
  }

  // ── UI sync ──
  const fmt = (t) => {
    if (!isFinite(t)) return "0:00";
    const m = Math.floor(t / 60), s = Math.floor(t % 60);
    return m + ":" + String(s).padStart(2, "0");
  };
  function syncUI() {
    const on = isPlaying();
    card.classList.toggle("is-playing", on);
    icon.textContent = on ? "❚❚" : "▶";
    playBtn.setAttribute("aria-label", on ? "Pause the dedication" : "Play the dedication");
  }
  function tick() {
    const a = audio();
    if (a && a.duration) {
      fill.style.width = (a.currentTime / a.duration) * 100 + "%";
      cur.textContent = fmt(a.currentTime);
      dur.textContent = fmt(a.duration);
      bar.setAttribute("aria-valuenow", Math.round((a.currentTime / a.duration) * 100));
    }
    syncUI();
  }
  let ticker = null;

  playBtn.addEventListener("click", () => {
    if (isPlaying()) pause(); else play();
    setTimeout(syncUI, 60);
  });
  vinyl.addEventListener("click", () => playBtn.click());

  function seek(clientX) {
    const a = audio();
    if (!a || !a.duration) return;
    const r = bar.getBoundingClientRect();
    a.currentTime = Math.min(Math.max((clientX - r.left) / r.width, 0), 1) * a.duration;
    tick();
  }
  bar.addEventListener("click", (e) => seek(e.clientX));
  bar.addEventListener("keydown", (e) => {
    const a = audio();
    if (!a || !a.duration) return;
    if (e.key === "ArrowRight") a.currentTime = Math.min(a.duration, a.currentTime + 5);
    if (e.key === "ArrowLeft") a.currentTime = Math.max(0, a.currentTime - 5);
    tick();
  });

  // Randomise equalizer bar speeds once
  eq.querySelectorAll("i").forEach((b) => {
    b.style.animationDuration = (0.55 + Math.random() * 0.6).toFixed(2) + "s";
    b.style.animationDelay = (-Math.random()).toFixed(2) + "s";
  });

  // ── Dedication lines, one by one ──
  let lineTimers = [];
  function showLines() {
    const box = $("ded-lines");
    lineTimers.forEach(clearTimeout);
    lineTimers = [];
    box.innerHTML = "";
    lines.forEach((text, i) => {
      lineTimers.push(setTimeout(() => {
        const p = document.createElement("p");
        p.className = "ded-line";
        p.textContent = text;
        box.appendChild(p);
      }, reduceMotion ? 0 : 900 + i * 1500));
    });
  }

  $("ded-next-btn").addEventListener("click", () => window.LoveApp && LoveApp.navigateTo("letter"));

  // ── Section lifecycle ──
  let shown = false;
  document.addEventListener("love:section", (e) => {
    if (e.detail === "dedication") {
      clearInterval(ticker);
      ticker = setInterval(tick, 300);
      tick();
      if (!shown) { shown = true; showLines(); }
    } else {
      clearInterval(ticker);
      ticker = null;
      if (own && !own.paused) pause();   // stop a dedicated track when leaving
    }
  });
  document.addEventListener("love:replay", () => {
    shown = false;
    lineTimers.forEach(clearTimeout);
    $("ded-lines").innerHTML = "";
    if (own) { own.pause(); own.currentTime = 0; }
  });
})();

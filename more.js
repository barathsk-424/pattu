// ═══════════════════════════════════════════════════════════════
//  more.js — feature pack 2
//  • Glass 3D tilt + pointer glare     • Love Quiz chapter
//  • Hold-to-hug button (finale)       • Keepsake card download
//  • Fullscreen chip (hero)
//  Uses window.LoveApp / window.LoveFX and the "love:section" /
//  "love:replay" events from app.js.
// ═══════════════════════════════════════════════════════════════
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const fx = () => window.LoveFX || { toast() {}, burstHearts() {} };
  const fireConfetti = (o) => { if (typeof confetti === "function") confetti(o); };
  const PALETTE = ["#C084FC", "#FFB8D0", "#F5D58A", "#A78BFA", "#FFFFFF", "#FF8FB1"];
  let currentId = "hero";

  // ─── 1. Glass tilt + glare ─────────────────────────────────────
  // Sections with canvases measured by position keep a flat card.
  const NO_TILT = new Set(["cake", "finale", "balloons"]);
  if (finePointer && !reduceMotion) {
    let raf = null;
    window.addEventListener("pointermove", (e) => {
      if (e.pointerType !== "mouse" || raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const card = document.querySelector(".story-section.active .premium-card");
        if (!card) return;
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty("--mx", (px * 100).toFixed(1) + "%");
        card.style.setProperty("--my", (py * 100).toFixed(1) + "%");
        const inside = px >= -0.1 && px <= 1.1 && py >= -0.1 && py <= 1.1;
        card.style.setProperty("--glare", inside ? "1" : "0.5");
        if (NO_TILT.has(currentId) || !inside) {
          card.style.transform = "";
          return;
        }
        const rx = (0.5 - py) * 5;
        const ry = (px - 0.5) * 6;
        card.style.transform = `perspective(1100px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      });
    }, { passive: true });
  }

  // ─── 2. Love Quiz ──────────────────────────────────────────────
  const quiz = Array.isArray(CONFIG.quiz) ? CONFIG.quiz : [];
  let qIdx = 0, mistakes = 0, quizBusy = false, quizBuilt = false;

  function renderProgress() {
    $("quiz-progress").innerHTML = quiz.map((_, i) =>
      `<span class="${i < qIdx ? "done" : i === qIdx ? "current" : ""}"></span>`).join("");
  }

  function renderQuestion() {
    const body = $("quiz-body");
    if (qIdx >= quiz.length) return renderResult();
    renderProgress();
    const item = quiz[qIdx];
    body.innerHTML = `
      <p class="quiz-question"></p>
      <div class="quiz-options"></div>
      <p class="quiz-reaction"></p>`;
    body.querySelector(".quiz-question").textContent = item.q;
    const opts = body.querySelector(".quiz-options");
    const reaction = body.querySelector(".quiz-reaction");
    item.options.forEach((label, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "quiz-opt";
      b.textContent = label;
      b.addEventListener("click", () => {
        if (quizBusy) return;
        const ok = item.answer === "all" || item.answer === i;
        if (ok) {
          quizBusy = true;
          b.classList.add("correct");
          reaction.textContent = item.right || "Correct! 💖";
          const r = b.getBoundingClientRect();
          fx().burstHearts(r.left + r.width / 2, r.top + r.height / 2, 8);
          if (navigator.vibrate) navigator.vibrate(15);
          setTimeout(() => { quizBusy = false; qIdx++; renderQuestion(); }, 1400);
        } else {
          mistakes++;
          b.classList.remove("wrong");
          void b.offsetWidth;          // restart shake animation
          b.classList.add("wrong");
          reaction.textContent = item.wrong || "Hmm… try again 😜";
          if (navigator.vibrate) navigator.vibrate([10, 30, 10]);
        }
      });
      opts.appendChild(b);
    });
  }

  function renderResult() {
    renderProgress();
    const body = $("quiz-body");
    const score = Math.max(0, 100 - mistakes * 10);
    body.innerHTML = `
      <div class="quiz-result">
        <p class="section-subtitle" style="margin-bottom:0">Your love score</p>
        <p class="quiz-score shimmer-text">${score}%</p>
        <p class="quiz-reaction" style="margin-top:4px">${score === 100 ? "Perfect! You know my heart by heart 💯" : "Close enough — I love you anyway 💞"}</p>
        <button id="quiz-next-btn" class="btn-primary btn-shine" style="margin-top:16px">One More Surprise 🎧</button>
      </div>`;
    fireConfetti({ particleCount: 110, spread: 90, origin: { y: 0.55 }, colors: PALETTE });
    $("quiz-next-btn").addEventListener("click", () => window.LoveApp && LoveApp.navigateTo("dedication"));
  }

  function startQuiz() {
    if (quizBuilt) return;
    quizBuilt = true;
    qIdx = 0; mistakes = 0; quizBusy = false;
    if (!quiz.length) { renderResult(); return; }
    renderQuestion();
  }

  // ─── 3. Hold-to-hug ────────────────────────────────────────────
  const hugBtn = $("hug-btn");
  const hugRing = $("hug-ring");
  const CIRC = 2 * Math.PI * 54;
  let hugs = 0, holdStart = 0, holdRaf = null, progress = 0, holding = false;

  function setRing(p) { if (hugRing) hugRing.style.strokeDashoffset = (CIRC * (1 - p)).toFixed(1); }

  function holdLoop(t) {
    if (!holding) return;
    progress = Math.min(1, (t - holdStart) / 1200);
    setRing(progress);
    if (progress >= 1) return completeHug();
    holdRaf = requestAnimationFrame(holdLoop);
  }
  function completeHug() {
    holding = false;
    hugBtn.classList.remove("holding");
    hugBtn.classList.remove("burst"); void hugBtn.offsetWidth; hugBtn.classList.add("burst");
    hugs++;
    $("hug-count").textContent = hugs === 1 ? "1 hug delivered 💞" : `${hugs} hugs delivered 💞`;
    const r = hugBtn.getBoundingClientRect();
    fx().burstHearts(r.left + r.width / 2, r.top + r.height / 2, 12);
    fireConfetti({
      particleCount: 50, spread: 70, scalar: 0.9, colors: PALETTE,
      origin: { x: (r.left + r.width / 2) / innerWidth, y: (r.top + r.height / 2) / innerHeight }
    });
    if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
    if (hugs === 1 || hugs % 5 === 0) fx().toast(hugs === 1 ? "Hug received! Squeezing you back 🤗" : `${hugs} hugs?! You're the sweetest 🥹`);
    setTimeout(drain, 350);
  }
  function drain() {
    cancelAnimationFrame(holdRaf);
    const from = progress, t0 = performance.now();
    (function step(t) {
      if (holding) return;
      const k = Math.min(1, (t - t0) / 300);
      progress = from * (1 - k);
      setRing(progress);
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  }
  if (hugBtn) {
    setRing(0);
    hugBtn.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      holding = true;
      hugBtn.classList.add("holding");
      holdStart = performance.now() - progress * 1200;
      try { hugBtn.setPointerCapture(e.pointerId); } catch (_) { /* pointer already gone */ }
      holdRaf = requestAnimationFrame(holdLoop);
    });
    const release = () => {
      if (!holding) return;
      holding = false;
      hugBtn.classList.remove("holding");
      drain();
    };
    hugBtn.addEventListener("pointerup", release);
    hugBtn.addEventListener("pointercancel", release);
    hugBtn.addEventListener("contextmenu", (e) => e.preventDefault());
    // keyboard: Enter/Space sends a hug instantly
    hugBtn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); progress = 1; setRing(1); completeHug(); }
    });
  }

  // ─── 4. Keepsake card (PNG download) ───────────────────────────
  function loadImg(src) {
    return new Promise((res) => {
      const img = new Image();
      img.onload = () => res(img);
      img.onerror = () => res(null);
      img.src = src;
    });
  }
  function wrapText(ctx, text, maxW) {
    const words = text.split(" "), lines = [];
    let line = "";
    for (const w of words) {
      const test = line ? line + " " + w : w;
      if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; }
      else line = test;
    }
    if (line) lines.push(line);
    return lines;
  }
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  async function makeKeepsake() {
    const W = 1080, H = 1350;
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const ctx = c.getContext("2d");
    try {
      await Promise.all([
        document.fonts.load("150px 'Great Vibes'"),
        document.fonts.load("italic 500 40px 'Playfair Display'"),
        document.fonts.load("italic 40px 'Lora'"),
        document.fonts.load("700 50px 'Dancing Script'")
      ]);
    } catch (_) { /* fall back to system fonts */ }

    // Background
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#0B0418"); bg.addColorStop(0.5, "#1E0A4A"); bg.addColorStop(1, "#120530");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    const orb = (x, y, r, col) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, col); g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
    };
    orb(150, 200, 420, "rgba(192,132,252,0.55)");
    orb(950, 1150, 460, "rgba(255,92,147,0.40)");
    orb(900, 250, 300, "rgba(245,213,138,0.25)");
    for (let i = 0; i < 160; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.8})`;
      ctx.beginPath(); ctx.arc(Math.random() * W, Math.random() * H, Math.random() * 1.8, 0, Math.PI * 2); ctx.fill();
    }

    // Glass panel
    roundRect(ctx, 80, 110, W - 160, H - 220, 56);
    const glass = ctx.createLinearGradient(80, 110, W - 80, H - 110);
    glass.addColorStop(0, "rgba(255,255,255,0.16)"); glass.addColorStop(1, "rgba(255,255,255,0.05)");
    ctx.fillStyle = glass; ctx.fill();
    ctx.lineWidth = 2; ctx.strokeStyle = "rgba(255,255,255,0.35)"; ctx.stroke();

    // Photo
    const cx = W / 2, cy = 360, R = 160;
    const img = await loadImg("assets/hero.svg");
    const ring = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
    ring.addColorStop(0, "#F5D58A"); ring.addColorStop(0.5, "#FF8FB1"); ring.addColorStop(1, "#A78BFA");
    ctx.beginPath(); ctx.arc(cx, cy, R + 14, 0, Math.PI * 2); ctx.fillStyle = ring; ctx.fill();
    ctx.save();
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.clip();
    if (img) {
      const s = Math.max((R * 2) / img.width, (R * 2) / img.height);
      ctx.drawImage(img, cx - (img.width * s) / 2, cy - (img.height * s) / 2, img.width * s, img.height * s);
    } else {
      ctx.fillStyle = "#3B0F6B"; ctx.fillRect(cx - R, cy - R, R * 2, R * 2);
    }
    ctx.restore();

    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    // Eyebrow
    ctx.fillStyle = "#E8C870";
    ctx.font = "italic 500 40px 'Playfair Display', Georgia, serif";
    ctx.fillText("H A P P Y   B I R T H D A Y", cx, 640);
    // Name
    const raw = (CONFIG.recipientName || "My Love").trim();
    const name = raw.charAt(0).toUpperCase() + raw.slice(1);
    const ng = ctx.createLinearGradient(cx - 300, 0, cx + 300, 0);
    ng.addColorStop(0, "#FFFFFF"); ng.addColorStop(0.35, "#F5D58A"); ng.addColorStop(0.7, "#FFB8D0"); ng.addColorStop(1, "#E4D4FF");
    ctx.fillStyle = ng;
    ctx.font = "160px 'Great Vibes', 'Dancing Script', cursive";
    ctx.shadowColor = "rgba(255,150,200,0.45)"; ctx.shadowBlur = 30;
    ctx.fillText(name, cx, 800);
    ctx.shadowBlur = 0;
    // Message
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "italic 40px 'Lora', Georgia, serif";
    const msg = CONFIG.finaleText || "May all your wishes come true.";
    wrapText(ctx, msg, W - 300).slice(0, 4).forEach((l, i) => ctx.fillText(l, cx, 900 + i * 58));
    // Date + signature
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.font = "500 30px 'Poppins', sans-serif";
    ctx.fillText(new Date().toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" }), cx, 1150);
    ctx.fillStyle = "#FFD7E6";
    ctx.font = "700 50px 'Dancing Script', cursive";
    ctx.fillText("With all my love, " + (CONFIG.keepsakeFrom || "me") + " 💍", cx, 1060);

    return new Promise((res) => c.toBlob(res, "image/png"));
  }

  const keepBtn = $("keepsake-btn");
  if (keepBtn) {
    keepBtn.addEventListener("click", async () => {
      const label = keepBtn.textContent;
      keepBtn.disabled = true;
      keepBtn.textContent = "Creating your card… ✨";
      try {
        const blob = await makeKeepsake();
        const file = "happy-birthday-" + (CONFIG.recipientName || "love").toLowerCase().replace(/\s+/g, "-") + ".png";
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = file;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 4000);
        fx().toast("Keepsake saved to your device 💾");
      } catch (err) {
        console.warn("[keepsake]", err);
        fx().toast("Couldn't create the card, please try again 🙏");
      }
      keepBtn.disabled = false;
      keepBtn.textContent = label;
    });
  }

  // ─── 5. Fullscreen chip ────────────────────────────────────────
  const fsChip = $("fs-chip");
  const root = document.documentElement;
  if (fsChip && root.requestFullscreen) {
    fsChip.hidden = false;
    const sync = () => { fsChip.textContent = document.fullscreenElement ? "✕ Exit fullscreen" : "⛶ Fullscreen for the best experience"; };
    fsChip.addEventListener("click", () => {
      if (document.fullscreenElement) document.exitFullscreen();
      else root.requestFullscreen().catch(() => fx().toast("Fullscreen isn't available here"));
    });
    document.addEventListener("fullscreenchange", sync);
  }

  // ─── 6. Wire into app state ────────────────────────────────────
  document.addEventListener("love:section", (e) => {
    currentId = e.detail;
    document.querySelectorAll(".premium-card").forEach((c) => { c.style.transform = ""; });
    if (currentId === "quiz") startQuiz();
  });
  document.addEventListener("love:replay", () => {
    quizBuilt = false;
    hugs = 0; progress = 0; setRing(0);
    const hc = $("hug-count"); if (hc) hc.textContent = "";
  });
})();

// ═══════════════════════════════════════════════════════════════
//  extras.js — premium add-ons for "Love, Laughter & Forever"
//  • Starfield + shooting stars      • Journey progress bar
//  • "Together since" live counter   • Reasons-I-love-you flip cards
//  • Scratch-card surprise (finale)  • Wish lanterns (finale)
//  • Multilingual "I love you"       • Love-note modal & toasts
//  • Sparkle cursor trail / tap hearts
//  Talks to app.js through window.LoveApp and the custom events
//  "love:section" and "love:replay".
// ═══════════════════════════════════════════════════════════════
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const fireConfetti = (opts) => { if (typeof confetti === "function") confetti(opts); };
  const PALETTE = ["#7C3AED", "#A67FE8", "#C9B0F5", "#C8A84B", "#F5D58A", "#E4D4FF", "#C084FC", "#FF8FB1"];

  // ─── 1. Toast + Love-note modal ────────────────────────────────
  const toastEl = $("love-toast");
  let toastTimer = null;
  function toast(text, ms) {
    if (!toastEl) return;
    toastEl.textContent = text;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), ms || 3200);
  }

  const noteEl = $("love-note");
  let lastFocus = null;
  function note(title, message, icon) {
    if (!noteEl) return;
    lastFocus = document.activeElement;
    $("love-note-title").textContent = title;
    $("love-note-text").textContent = message;
    $("love-note-icon").textContent = icon || "💌";
    noteEl.hidden = false;
    requestAnimationFrame(() => noteEl.classList.add("open"));
    $("love-note-close").focus({ preventScroll: true });
  }
  function closeNote() {
    if (!noteEl || noteEl.hidden) return;
    noteEl.classList.remove("open");
    setTimeout(() => { noteEl.hidden = true; }, 350);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  if (noteEl) {
    $("love-note-close").addEventListener("click", closeNote);
    noteEl.addEventListener("click", (e) => { if (e.target === noteEl) closeNote(); });
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") closeNote(); });
  }

  // Small burst of DOM hearts at a point (used for taps & reveals)
  function burstHearts(x, y, count) {
    const symbols = ["💖", "💜", "✨", "💕"];
    for (let i = 0; i < (count || 6); i++) {
      const h = document.createElement("span");
      h.className = "tap-heart";
      h.textContent = symbols[i % symbols.length];
      const a = Math.random() * Math.PI * 2;
      const d = 30 + Math.random() * 40;
      h.style.left = x + "px";
      h.style.top = y + "px";
      h.style.setProperty("--tx", Math.cos(a) * d + "px");
      h.style.setProperty("--ty", Math.sin(a) * d - 20 + "px");
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 900);
    }
  }

  window.LoveFX = { toast, note, burstHearts };

  // Wrap emojis in gradient titles so they keep their colours
  document.querySelectorAll(".section-title").forEach((t) => {
    t.innerHTML = t.textContent.replace(/(\p{Extended_Pictographic}[️‍\p{Extended_Pictographic}]*)/gu,
      '<span class="title-emoji">$1</span>');
  });

  // ─── 2. Starfield with shooting stars ──────────────────────────
  (function starfield() {
    const canvas = $("starfield");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = 0, h = 0, stars = [], shooting = null, nextShoot = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(170, Math.round((w * h) / 8000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.2 + 0.25,
        tw: Math.random() * Math.PI * 2,
        sp: 0.6 + Math.random() * 1.6,
        gold: Math.random() < 0.12
      }));
      if (reduceMotion) draw(0);
    }

    function draw(t) {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const a = reduceMotion ? 0.7 : 0.35 + 0.65 * Math.abs(Math.sin(s.tw + t * 0.001 * s.sp));
        ctx.globalAlpha = a;
        ctx.fillStyle = s.gold ? "#F5D58A" : "#EDE0FF";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (reduceMotion) return;
      if (!shooting && t > nextShoot) {
        shooting = { x: Math.random() * w * 0.7, y: Math.random() * h * 0.35, len: 90 + Math.random() * 80, life: 0 };
        nextShoot = t + 4000 + Math.random() * 6000;
      }
      if (shooting) {
        shooting.life += 1;
        const p = shooting.life / 55;
        const x = shooting.x + p * 420, y = shooting.y + p * 200;
        const g = ctx.createLinearGradient(x, y, x - shooting.len, y - shooting.len * 0.48);
        g.addColorStop(0, `rgba(255,240,210,${1 - p})`);
        g.addColorStop(1, "rgba(255,240,210,0)");
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - shooting.len, y - shooting.len * 0.48);
        ctx.stroke();
        if (p >= 1) shooting = null;
      }
    }

    function loop(t) {
      if (!document.hidden) draw(t);
      requestAnimationFrame(loop);
    }
    window.addEventListener("resize", resize);
    resize();
    if (!reduceMotion) requestAnimationFrame(loop);
  })();

  // ─── 3. Journey progress bar ───────────────────────────────────
  const CHAPTERS = [
    { id: "hero", label: "Welcome" },
    { id: "balloons", label: "Pop the Balloons" },
    { id: "cake", label: "Make a Wish" },
    { id: "gift", label: "A Little Gift" },
    { id: "memories", label: "Our Story" },
    { id: "reasons", label: "reasons of love" },
    { id: "quiz", label: "The Love Quiz" },
    { id: "dedication", label: "Dedicated to You" },
    { id: "letter", label: "Just for You" },
    { id: "finale", label: "Forever & Always" }
  ];
  const journey = document.createElement("nav");
  journey.className = "journey";
  journey.setAttribute("aria-label", "Story progress");
  journey.innerHTML = `
    <div class="journey-label"><span class="journey-chapter"></span><span class="journey-title"></span></div>
    <div class="journey-track">
      <div class="journey-fill"></div>
      ${CHAPTERS.map((c, i) => `<span class="journey-dot" style="left:${(i / (CHAPTERS.length - 1)) * 100}%" title="${c.label}"></span>`).join("")}
    </div>`;
  document.body.appendChild(journey);
  const jFill = journey.querySelector(".journey-fill");
  const jDots = journey.querySelectorAll(".journey-dot");

  function updateJourney(id) {
    const idx = CHAPTERS.findIndex((c) => c.id === id);
    if (idx < 0) return;
    journey.classList.add("visible");
    journey.querySelector(".journey-chapter").textContent = `Chapter ${idx + 1} of ${CHAPTERS.length}`;
    journey.querySelector(".journey-title").textContent = CHAPTERS[idx].label;
    jFill.style.width = (idx / (CHAPTERS.length - 1)) * 100 + "%";
    jDots.forEach((d, i) => {
      d.classList.toggle("done", i < idx);
      d.classList.toggle("current", i === idx);
    });
  }

  // Staggered entrance for each card's children (WAAPI → never fights CSS animations)
  function staggerIn(id) {
    if (reduceMotion) return;
    const card = document.querySelector(`#${id}-section .premium-card`);
    if (!card || !card.animate) return;
    Array.from(card.children).forEach((el, i) => {
      el.animate(
        [{ opacity: 0, translate: "0 18px" }, { opacity: 1, translate: "0 0" }],
        { duration: 650, delay: 80 + i * 75, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "backwards" }
      );
    });
  }

  // ─── 4. "Together since" live counter ──────────────────────────
  (function togetherCounter() {
    const box = $("together-box");
    if (!box || !CONFIG.togetherSince) return;
    const start = new Date(CONFIG.togetherSince + (CONFIG.togetherSince.length <= 10 ? "T00:00:00" : ""));
    if (isNaN(start.getTime())) return;
    box.hidden = false;
    const pad = (n) => String(n).padStart(2, "0");
    const els = { d: $("tg-days"), h: $("tg-hours"), m: $("tg-mins"), s: $("tg-secs") };
    function tick() {
      let diff = Math.max(0, Math.floor((Date.now() - start.getTime()) / 1000));
      const d = Math.floor(diff / 86400); diff -= d * 86400;
      const h = Math.floor(diff / 3600); diff -= h * 3600;
      const m = Math.floor(diff / 60); const s = diff - m * 60;
      els.d.textContent = d.toLocaleString();
      els.h.textContent = pad(h);
      els.m.textContent = pad(m);
      els.s.textContent = pad(s);
    }
    tick();
    setInterval(tick, 1000);
  })();

  // ─── 5. reasons of love (flip cards) ────────────────────────
  let reasonsBuilt = false;
  let reasonsFound = 0;
  const reasons = Array.isArray(CONFIG.reasons) && CONFIG.reasons.length ? CONFIG.reasons : [
    { emoji: "💖", text: "Because you are you." }
  ];

  function buildReasons() {
    if (reasonsBuilt) return;
    reasonsBuilt = true;
    reasonsFound = 0;
    const grid = $("reasons-grid");
    const nextBtn = $("reasons-next-btn");
    grid.innerHTML = "";
    $("reasons-total").textContent = reasons.length;
    $("reasons-found").textContent = "0";
    $("reasons-meter-fill").style.width = "0%";
    nextBtn.classList.add("is-hidden");

    reasons.forEach((r, i) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "reason-card";
      card.setAttribute("aria-label", `Reveal reason ${i + 1}`);
      card.style.setProperty("--tilt", (i % 2 ? 1.5 : -1.5) + "deg");
      card.innerHTML = `
        <span class="reason-inner">
          <span class="reason-face reason-front">
            <span class="reason-num">#${i + 1}</span>
            <span class="reason-heart">${r.emoji || "💖"}</span>
            <span class="reason-tap">tap to open</span>
          </span>
          <span class="reason-face reason-back"></span>
        </span>`;
      card.querySelector(".reason-back").textContent = r.text;
      card.addEventListener("click", (e) => {
        if (card.classList.contains("flipped")) return;
        card.classList.add("flipped");
        card.setAttribute("aria-label", r.text);
        if (navigator.vibrate) navigator.vibrate(12);
        const rect = card.getBoundingClientRect();
        burstHearts(rect.left + rect.width / 2, rect.top + rect.height / 2, 5);
        reasonsFound++;
        $("reasons-found").textContent = reasonsFound;
        $("reasons-meter-fill").style.width = (reasonsFound / reasons.length) * 100 + "%";
        if (reasonsFound === reasons.length) {
          fireConfetti({ particleCount: 90, spread: 80, origin: { y: 0.6 }, colors: PALETTE });
          toast("Every reason leads back to you 💞");
          nextBtn.classList.remove("is-hidden");
          if (nextBtn.animate && !reduceMotion) {
            nextBtn.animate([{ opacity: 0, transform: "scale(0.8)" }, { opacity: 1, transform: "scale(1)" }],
              { duration: 500, easing: "cubic-bezier(0.34, 1.56, 0.64, 1)" });
          }
        }
      });
      grid.appendChild(card);
    });
  }
  $("reasons-next-btn").addEventListener("click", () => window.LoveApp && LoveApp.navigateTo("quiz"));

  // ─── 6. Scratch card (finale) ──────────────────────────────────
  let scratchReady = false;
  let scratchDone = false;

  function initScratch() {
    if (scratchReady) return;
    const canvas = $("scratch-canvas");
    const reveal = $("scratch-reveal");
    if (!canvas) return;
    reveal.textContent = CONFIG.scratchCardMessage || CONFIG.hiddenMessage || "I love you ❤️";
    const rect = canvas.getBoundingClientRect();
    if (!rect.width) return; // not laid out yet; try again on next visit
    scratchReady = true;
    scratchDone = false;
    canvas.classList.remove("cleared");
    $("scratch-hint").textContent = "Scratch the gold with your finger ☝️";

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Gold foil
    const g = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    g.addColorStop(0, "#8A6A1F");
    g.addColorStop(0.25, "#E8C870");
    g.addColorStop(0.5, "#FFF0B8");
    g.addColorStop(0.75, "#D4AF37");
    g.addColorStop(1, "#8A6A1F");
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, rect.width, rect.height);
    for (let i = 0; i < 70; i++) {
      ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.5})`;
      ctx.beginPath();
      ctx.arc(Math.random() * rect.width, Math.random() * rect.height, Math.random() * 1.6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "rgba(70,40,5,0.85)";
    ctx.font = "600 20px 'Dancing Script', cursive";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✨ Scratch here ✨", rect.width / 2, rect.height / 2);

    let drawing = false, last = null, moves = 0;
    function pos(e) {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }
    function scratch(p) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = 38;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo((last || p).x, (last || p).y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      last = p;
      if (++moves % 10 === 0) checkCleared();
    }
    function checkCleared() {
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      let clear = 0, total = 0;
      for (let i = 3; i < data.length; i += 64) { total++; if (data[i] === 0) clear++; }
      if (clear / total > 0.45) finishScratch();
    }
    function finishScratch() {
      if (scratchDone) return;
      scratchDone = true;
      canvas.classList.add("cleared");
      $("scratch-hint").textContent = "Surprise unlocked! 💝";
      const r = canvas.getBoundingClientRect();
      fireConfetti({
        particleCount: 120, spread: 100, colors: PALETTE,
        origin: { x: (r.left + r.width / 2) / window.innerWidth, y: (r.top + r.height / 2) / window.innerHeight }
      });
      if (navigator.vibrate) navigator.vibrate([20, 40, 20]);
    }

    canvas.onpointerdown = (e) => {
      if (scratchDone) return;
      drawing = true; last = null;
      try { canvas.setPointerCapture(e.pointerId); } catch (_) { /* pointer already gone */ }
      scratch(pos(e));
    };
    canvas.onpointermove = (e) => { if (drawing && !scratchDone) scratch(pos(e)); };
    canvas.onpointerup = canvas.onpointercancel = () => { drawing = false; last = null; };
    // Keyboard fallback: Enter reveals
    canvas.tabIndex = 0;
    canvas.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); finishScratch(); } };
  }

  // ─── 7. Wish lanterns (finale) ─────────────────────────────────
  let wishesReleased = 0;
  const wishForm = $("wish-form");
  if (wishForm) {
    wishForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = $("wish-input");
      const wish = input.value.trim();
      if (!wish) { input.focus(); toast("Write a little wish first ✍️"); return; }
      const r = input.getBoundingClientRect();
      const lantern = document.createElement("div");
      lantern.className = "wish-lantern";
      lantern.innerHTML = `<span class="lantern-body"></span><span class="lantern-text"></span>`;
      lantern.querySelector(".lantern-text").textContent = wish;
      lantern.style.left = Math.min(Math.max(r.left + r.width / 2, 70), window.innerWidth - 70) + "px";
      lantern.style.top = r.top + "px";
      lantern.style.setProperty("--sway", (Math.random() > 0.5 ? 1 : -1) * (20 + Math.random() * 30) + "px");
      document.body.appendChild(lantern);
      setTimeout(() => lantern.remove(), 9000);
      input.value = "";
      wishesReleased++;
      $("wish-count").textContent = wishesReleased === 1
        ? "1 wish is floating up to the stars ✨"
        : `${wishesReleased} wishes are floating up to the stars ✨`;
      toast("Your wish is on its way to the stars 🌟");
    });
  }

  // ─── 8. Floating multilingual "I love you" (finale) ────────────
  const ilyLayer = $("ily-layer");
  let ilyTimer = null;
  function startIly() {
    if (ilyTimer || reduceMotion || !ilyLayer) return;
    const words = CONFIG.loveLanguages || ["I love you"];
    let i = 0;
    ilyTimer = setInterval(() => {
      if (ilyLayer.childElementCount > 10) return;
      const el = document.createElement("span");
      el.className = "ily-word";
      el.textContent = words[i++ % words.length];
      // keep words to the side gutters so they don't sit on top of the card text
      const side = Math.random() < 0.5;
      el.style.left = (side ? 2 + Math.random() * 22 : 70 + Math.random() * 22) + "vw";
      el.style.fontSize = (0.9 + Math.random() * 0.9) + "rem";
      el.style.animationDuration = (9 + Math.random() * 5) + "s";
      ilyLayer.appendChild(el);
      el.addEventListener("animationend", () => el.remove());
    }, 1100);
  }
  function stopIly() {
    clearInterval(ilyTimer);
    ilyTimer = null;
    if (ilyLayer) ilyLayer.innerHTML = "";
  }

  // ─── 9. Cursor sparkle trail & tap hearts ──────────────────────
  if (!reduceMotion) {
    if (finePointer) {
      let lastSpark = 0;
      window.addEventListener("pointermove", (e) => {
        if (e.pointerType !== "mouse") return;
        const now = performance.now();
        if (now - lastSpark < 45) return;
        lastSpark = now;
        const s = document.createElement("span");
        s.className = "cursor-spark";
        s.style.left = e.clientX + "px";
        s.style.top = e.clientY + "px";
        s.style.background = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 750);
      }, { passive: true });
    }
    window.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "mouse") return;
      if (e.target.closest("canvas, input, .balloon")) return;
      burstHearts(e.clientX, e.clientY, 4);
    }, { passive: true });
  }

  // ─── 10. Wire into app state ───────────────────────────────────
  document.addEventListener("love:section", (e) => {
    const id = e.detail;
    const sec = $(id + "-section");
    if (sec) sec.scrollTop = 0;
    updateJourney(id);
    staggerIn(id);
    if (id === "reasons") buildReasons();
    if (id === "finale") {
      startIly();
      // wait for the section transition so the canvas has its real size
      setTimeout(initScratch, 450);
    } else {
      stopIly();
    }
  });

  document.addEventListener("love:replay", () => {
    reasonsBuilt = false;
    scratchReady = false;
    scratchDone = false;
    wishesReleased = 0;
    const wc = $("wish-count");
    if (wc) wc.textContent = "";
    stopIly();
  });
})();

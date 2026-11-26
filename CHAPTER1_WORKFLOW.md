# Chapter 1 — "Welcome" Page · Complete Workflow

> **தமிழ் சுருக்கம்:** இந்த document-ல Chapter 1 (முதல் பக்கம் — Tharuma photo, "Happy Birthday", counter, "Are You Ready? ❤️" button) எப்படி வேலை செய்யுது, எந்த வரிசையில என்ன வருது, ஒவ்வொரு பகுதியோட size / colour / font / animation / timing எல்லாமே இருக்கு. இதை வச்சு புது folder-ல build பண்ணா, இதே page அப்படியே வரும்.

This document describes **only Chapter 1** of the birthday site, exactly as it works today in `D:\pattu`. Follow it to rebuild the same page in a new folder.

---

## 1. Flow at a glance

```
Open the link
   │
   ▼
[A] Gift intro screen (only first visit in a browser session)
   │  she taps the gift box
   │  → lid flies open, hearts + confetti burst (1.8 s)
   │  → screen fades out (0.9 s)
   ▼
[B] Loader screen  "❤️  Loading Love..."   (2.2 s, then fades 1 s)
   ▼
[C] CHAPTER 1 — Welcome card appears
   │  • card contents rise in one by one
   │  • subtitle types itself (starts after 0.8 s)
   │  • "together" counter ticks every second
   │  • background: stars, shooting stars, aurora, glass orbs, floating hearts
   │
   │  Hidden extras: triple-tap name · long-press photo · Konami code
   ▼
She taps "Are You Ready? ❤️"
   → background music starts (love.mp3)
   → page moves to the next chapter
```

If the intro was already played in this browser session (`sessionStorage.giftIntroPlayed = "1"`), step [A] is skipped and the page goes straight to [B] → [C].

---

## 2. Step-by-step behaviour

### [A] Gift intro screen
| Item | Value |
|---|---|
| Layer | Full screen, fixed, `z-index: 3000` |
| Background | `radial-gradient(ellipse at 50% 60%, #F5EEFF 0%, #E0C8FF 40%, #C8A0F0 100%)` |
| Sunburst | `repeating-conic-gradient(rgba(180,140,255,0.10) 0 10deg, transparent 10deg 20deg)`, rotates 360° every **28 s** |
| Sparkles | **22** soft violet glow dots, random size 30–90 px, random position, pulse 2–5 s |
| Text above box | "A Special Gift Awaits You ❤️" — Dancing Script, `clamp(1.4rem, 5vw, 2.1rem)`, `#2E0A5E`, slides down in 0.7 s |
| Gift box | Violet box (`#7C3AED → #5B21B6` lid, `#A67FE8 → #7C3AED` body), gold ribbon `#C8A84B → #A07C28`, gold bow. Size `clamp(160px,35vw,220px)` × `clamp(175px,38vw,240px)`. Floats up/down 8 px every **3.2 s** |
| Text below box | "Tap the gift to open your surprise" — Poppins 500, `clamp(0.9rem, 3vw, 1.08rem)`, `#3B1080`, slides up after 0.3 s |
| Tap / click / Enter | 1. Lid rotates `rotateX(-130deg)` and fades · 2. Inner glow scales to 2.2× · 3. **20** emoji particles (💜💖✨💎🌸⭐💫) + **30** confetti dots burst outward · 4. canvas-confetti burst at **350 ms** · 5. at **1800 ms** screen fades (opacity 0, scale 1.06, 0.85 s) · 6. +900 ms: screen removed, `sessionStorage.giftIntroPlayed = "1"`, loader starts |

### [B] Loader
| Item | Value |
|---|---|
| Background | `linear-gradient(145deg, #0F0620 0%, #1A0840 50%, #0F0620 100%)`, `z-index: 1000` |
| Heart | ❤️ at 4.5 rem, heartbeat pulse every 1.2 s |
| Text | "Loading Love..." — Great Vibes, `clamp(2rem, 7vw, 2.8rem)`, `#DDD0F8`, glow `0 0 24px rgba(200,170,255,0.65)` |
| Timing | Waits **2200 ms**, fades out over **1 s**, then Chapter 1 is shown and the typewriter starts |

### [C] Chapter 1 appears
1. The section fades in: from `opacity 0, translateY(30px) scale(0.965)` to normal in **0.6 s**, easing `cubic-bezier(0.22, 1, 0.36, 1)`.
2. Each item inside the card rises in one after another: from `opacity 0, 18px lower` → normal, **650 ms** each, delay **80 ms + 75 ms × position**.
3. The progress pill at the top shows **"CHAPTER 1 OF 10 · Welcome"** with the first dot highlighted.
4. The subtitle starts typing after **800 ms**, one letter every **70 ms**.
5. The counter updates every **1 s**.

### Button press — "Are You Ready? ❤️"
1. Starts the background music (`love.mp3`, volume **0.3**, loops).
   If the browser blocks autoplay, music starts on her next tap anywhere.
2. Moves to the next chapter.
   *(In a standalone Chapter-1-only page, decide what it opens next, e.g. your main site link.)*

---

## 3. Screen layout (top to bottom)

```
┌───────────────────────────────────────────┐
│ [CHAPTER 1 OF 10 · Welcome ●──○──○…]  (♪)  │  ← glass progress pill + music button
│                                           │
│   ┌───────────── glass card ───────────┐  │
│   │          ( photo in gold ring )💖   │  │
│   │                                     │  │
│   │        H A P P Y  B I R T H D A Y   │  │  ← gold eyebrow
│   │             Tharuma                 │  │  ← big shimmering script name
│   │  To the one who makes life beautiful... │  ← typewriter
│   │                                     │  │
│   │     EVERY SECOND WITH YOU COUNTS     │  │
│   │  [1,013 days][14 hrs][05 min][42 s] │  │  ← live counter
│   │                                     │  │
│   │       ( Are You Ready? ❤️ )          │  │  ← glossy pulsing button
│   │   ( ⛶ Fullscreen for the best … )    │  │  ← small glass chip
│   └─────────────────────────────────────┘  │
│        stars · orbs · floating hearts      │
└───────────────────────────────────────────┘
```

---

## 4. Element specifications

### 4.1 Page background (back → front)
| Order | Layer | Spec |
|---|---|---|
| 1 | Body | `radial-gradient(120% 80% at 50% 120%, #2A0B52 0%, transparent 60%), linear-gradient(160deg, #0B0418 0%, #160736 45%, #0E0526 100%)` |
| 2 | Aurora | 3 round blobs, 70 vmax, opacity 0.38: violet `rgba(124,58,237,0.55)` top-left (drifts 26 s), pink `rgba(255,143,177,0.32)` bottom-right (32 s), gold `rgba(232,200,112,0.18)` centre (38 s) |
| 3 | Starfield (canvas) | Star count = `min(170, width × height ÷ 8000)`, radius 0.25–1.45 px, 12 % gold `#F5D58A`, others `#EDE0FF`, each twinkles (opacity 0.35–1). **Shooting star** every 4–10 s, lasts 55 frames, moves 420 px right / 200 px down |
| 4 | Glass orbs | 5 blurred-looking colour balls, opacity 0.6, float 18–28 s: violet 260 px (top-left), pink 200 px (right), gold 150 px (bottom-left), cyan-indigo 180 px (top-right), magenta 110 px (centre-right) |
| 5 | Floating hearts | New one every **900 ms**, max **26** on screen, rise from bottom to top in 6–9 s while rotating, opacity ~0.35. Symbols: 💜 💜 💜 🪻 🪻 💟 💟 💖 💕 💝 ✨ ⭐ 💫 🌸 |
| 6 | Section glow | Behind the card: `radial-gradient(70% 55% at 50% 35%, rgba(167,139,250,0.16), transparent 70%)` |

### 4.2 Glass card
| Property | Value |
|---|---|
| Width | 100 %, max **520 px**, centred |
| Padding | 36 px 28 px (phones ≤ 480 px: 28 px 18 px) |
| Corner radius | 24 px (phones: 20 px) |
| Glass fill | `linear-gradient(145deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0.08) 100%)` |
| Blur | `backdrop-filter: blur(26px) saturate(170%)` (phones ≤ 600 px: `blur(14px) saturate(160%)`) |
| Border | 1 px `rgba(255,255,255,0.22)` |
| Shadow | `0 30px 70px -25px rgba(5,0,20,0.75)` + top inner highlight `inset 0 1px 0 rgba(255,255,255,0.35)` |
| Rotating border light | Thin 1.5 px conic gradient — gold `rgba(232,200,112,0.95)` → violet `rgba(192,132,252,0.95)` — spins around the edge every **7 s** |
| Glare | Soft white spot (`radial-gradient 420px, rgba(255,255,255,0.16)`) that follows the mouse |
| 3D tilt (computers only) | Tilts toward the mouse: up to **5°** up/down, **6°** left/right, `perspective(1100px)`, eases back in 0.5 s |
| Content | Centred column, text centred |

### 4.3 Photo with gold ring
| Property | Value |
|---|---|
| Size | `clamp(140px, 35vw, 180px)` square, round, 22 px gap below |
| Image | `assets/hero.jpg` (her photo, square crop 640 × 640 around face and shoulders), `object-fit: cover`, 3 px border `rgba(255,255,255,0.85)`, shadow `0 12px 40px rgba(0,0,0,0.45), 0 0 40px rgba(192,132,252,0.45)` |
| Ring | 9 px outside the photo, 3 px thick, colours `#E8C870 → #FF8FB1 → #A78BFA → #E8C870`, spins every **6 s** |
| Badge | 💖 at bottom-right, 1.6 rem, heartbeat every 1.8 s |
| Hover | Scales 1.06 and rotates 2° (0.5 s) |
| Tooltip | "Hold me for a secret!" |

### 4.4 Title
| Part | Spec |
|---|---|
| Eyebrow "HAPPY BIRTHDAY" | Playfair Display italic 500, `clamp(1rem, 3.6vw, 1.25rem)`, letter-spacing 0.32 em, uppercase, colour `#E8C870`, 4 px below |
| Name "Tharuma" | Great Vibes, `clamp(3.4rem, 14vw, 5.4rem)`, line-height 1.05. Gradient text `linear-gradient(100deg, #FFFFFF 0%, #F5D58A 25%, #FFB8D0 50%, #D8C2FF 75%, #FFFFFF 100%)` at 200 % width, **shimmer slides every 5 s**. Glow `drop-shadow(0 4px 22px rgba(255,180,220,0.35))`. First letter auto-capitalised from config |

### 4.5 Typewriter subtitle
| Property | Value |
|---|---|
| Text | `To the one who makes life beautiful...` |
| Font | Lora italic, `clamp(1rem, 3.5vw, 1.2rem)`, light text colour `#F0EAFF` |
| Space | min-height 26 px, 28 px below |
| Timing | Starts 800 ms after the page shows, 70 ms per letter (~2.7 s total) |

### 4.6 "Together" counter
| Property | Value |
|---|---|
| Shows when | `togetherSince` is set in config (hidden if `""`) |
| Label | Before the date: "COUNTDOWN TO YOUR SPECIAL DAY 🎂"; from the date on: "EVERY SECOND WITH YOU COUNTS" — 0.72 rem, letter-spacing 0.22 em, `#C4B5E8` |
| Grid | 4 equal boxes, 8 px gap, max width 340 px. Margin: -6 px top, 24 px bottom |
| Each box | Glass (`rgba(255,255,255,0.20→0.08)` gradient, 1 px white 22 % border, blur 14 px), radius 14 px, padding 10 px 4 px 8 px |
| Number | Playfair Display 600, `clamp(1.1rem, 4.6vw, 1.45rem)`, white, fixed-width digits |
| Unit | DAYS / HOURS / MINS / SECS — 0.64 rem, uppercase, `#C4B5E8` |
| Logic | Date is **26 Dec 2026, 00:00** (local time). Before it: counts **down** (`date − now`). From it on: counts **up** (`now − date`). Days with comma (e.g. 1,013), hours/mins/secs as two digits. Refreshes every second; the label switches automatically at midnight |

### 4.7 "Are You Ready? ❤️" button
| Property | Value |
|---|---|
| Shape | Pill, radius 50 px, padding 15 px 34 px (phones: 14 px 24 px) |
| Text | Poppins 600, 1.05 rem (phones 1 rem), white, slight text shadow |
| Fill | Glossy: `linear-gradient(180deg, rgba(255,255,255,0.28) 0%, transparent 52%)` over `linear-gradient(135deg, rgba(167,109,250,0.95) 0%, rgba(124,58,237,0.92) 50%, rgba(219,39,119,0.85) 100%)` |
| Border / glow | 1 px `rgba(255,255,255,0.35)`, shadow `0 12px 30px -8px rgba(168,85,247,0.7)` |
| Animations | Double-heartbeat pulse (scale 1 → 1.06 → 1 → 1.06 → 1) every **2 s** · white light sweep across it every **3.2 s** |
| Hover / press | Lifts 2 px and grows 3 % / presses down to 98 % |
| Keyboard focus | 3 px gold outline |

### 4.8 Fullscreen chip
| Property | Value |
|---|---|
| Text | "⛶ Fullscreen for the best experience" (changes to "✕ Exit fullscreen") |
| Style | Small glass pill, padding 7 px 14 px, Poppins 500 0.78 rem, 14 px above, opacity 0.85 |
| Shows when | The browser supports fullscreen (hidden on iPhone) |

### 4.9 Top bar items
| Item | Spec |
|---|---|
| Progress pill | Glass pill, top 14 px, centred, width `min(440px, 100vw − 150px)` (phones: left 12 px, width `100vw − 88px`). Text "CHAPTER 1 OF 10" in gold `#E8C870` + "· Welcome". Thin 4 px track, 10 dots, first dot gold with glow |
| Music button | 48 px glass circle, top-right (18 px, 18 px), white music-note icon. Pulses while music plays; tap to pause/play |

---

## 5. Hidden surprises on Chapter 1
| Trigger | What happens |
|---|---|
| Tap the name **3 times within 1.2 s** | 💖 emoji rain (40 emojis) + glass love-note pop-up showing `hiddenMessage` |
| **Hold the photo 1.5 s** | 🥰 emoji rain + love-note pop-up showing `hiddenMessage` |
| Keyboard **↑ ↑ ↓ ↓ ← → ← → B A** | 🥰 emoji rain + pop-up "Cheat code unlocked 🎮" with `konamiCodeResponse` |
| Mouse move (computers) | Small coloured sparkles trail the cursor (one every 45 ms) |
| Tap anywhere (phones) | 4 tiny hearts burst from the finger |

Love-note pop-up: dark blurred backdrop, glass card (max 380 px, radius 22 px), big emoji icon, Dancing Script title, Lora text, "Aww, close ❤️" button. Closes on button, outside tap, or Esc.

---

## 6. Design tokens

**Colours**
| Name | Hex |
|---|---|
| Deep night | `#0B0418`, `#160736`, `#0E0526` |
| Violet | `#7C3AED`, `#A78BFA`, `#C084FC` |
| Gold | `#E8C870`, `#F5D58A`, `#C8A84B` |
| Rose | `#FF8FB1`, `#FFB8D0` |
| Text light | `#F0EAFF` · muted `#C4B5E8` |

**Fonts** (Google Fonts)
`Great Vibes` (name, loader) · `Playfair Display` italic 500 / 600 (eyebrow, numbers) · `Lora` italic (subtitle) · `Poppins` 300 / 400 / 500 / 600 (buttons, labels) · `Dancing Script` 600 / 700 (intro text, pop-up title)

**Motion**
Main easing `cubic-bezier(0.22, 1, 0.36, 1)` · Bouncy easing `cubic-bezier(0.34, 1.56, 0.64, 1)` · If the phone has "reduce motion" turned on, all spinning / floating / shimmer animations stop.

---

## 7. Settings used (from `config.js`)
```js
recipientName: "Tharuma",
musicUrl: "love.mp3?v=3",
musicVolume: 0.3,
togetherSince: "2026-12-26",   // future = countdown, past = count-up ("" hides the counter)
hiddenMessage: "Psst... You found the secret message! I have a special dinner reservation for us tonight at 7 PM. Dress up! 😉",
konamiCodeResponse: "💖 UNLIMITED LOVE MODE ACTIVATED 💖"
```

---

## 8. Files needed in the new folder
| File | What Chapter 1 uses from it |
|---|---|
| `index.html` | `<head>`, music button, aurora / starfield / glass-orbs / hearts layers, gift intro, loader, `#hero-section`, love-note pop-up, toast, script tags |
| `styles.css` | Base reset, tokens, loader, gift intro, music button, floating hearts, card base, button base, hero base |
| `extras.css` | Night background, aurora, shimmer text, hero eyebrow / name / ring, counter, button shine, progress pill, love-note, sparkles |
| `glass.css` | Glass card, glass controls, glossy button, glass orbs, progress pill glass, fullscreen chip |
| `config.js` | Settings in section 7 |
| `app.js` | Gift intro, loader timing, music, floating hearts, hero name + typewriter, button, Easter eggs |
| `extras.js` | Starfield + shooting stars, progress pill, card stagger, together counter, love-note, cursor sparkles / tap hearts |
| `more.js` | 3D tilt + glare, fullscreen chip |
| `assets/hero.jpg` | Her photo in the circle |
| `love.mp3` | Background music |
| canvas-confetti 1.6.0 (CDN) | Gift-intro confetti |

---

## 9. Rebuild checklist
- [ ] Gift intro shows on first open; tapping the box bursts and fades in ~2.7 s
- [ ] Loader shows "Loading Love..." for 2.2 s, then fades
- [ ] Card is frosted glass with the spinning gold-violet edge
- [ ] Photo has the spinning gold-pink-violet ring and 💖 badge
- [ ] "HAPPY BIRTHDAY" in gold spaced capitals, "Tharuma" in big shimmering script
- [ ] Subtitle types itself after 0.8 s
- [ ] Counter counts down to 26 Dec 2026 ("Countdown to your special day 🎂") and ticks every second
- [ ] Button pulses, has a light sweep, starts music on tap
- [ ] Stars twinkle, a shooting star crosses every few seconds, orbs and hearts float
- [ ] Triple-tap name and long-press photo open the secret pop-up
- [ ] Looks right at 375 px phone width (no sideways scrolling)

---

## 10. Ready-to-use prompt (to recreate with an AI)
> Build a single-page "Chapter 1 — Welcome" birthday screen exactly per the attached CHAPTER1_WORKFLOW.md. Follow the flow in section 1 (gift intro → loader → welcome card), every value in sections 2–6, the settings in section 7, and pass every item in the checklist in section 9. Use plain HTML, CSS and JavaScript, Google Fonts, and canvas-confetti 1.6.0 from jsDelivr. Mobile-first; it must look right at 375 px wide.

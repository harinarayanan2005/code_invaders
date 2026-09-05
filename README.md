# CODE INVADERS — Terminal Typing Defense v5.0

> A high-velocity, arcade cyberpunk typing defense game built with Vanilla JavaScript, Web Audio API, and Canvas API. Neutralize falling code tokens before core breach!

![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)
![Tech Stack: Vanilla JS](https://img.shields.io/badge/Tech-Vanilla%20JS-blue.svg)
![Styling: CSS3](https://img.shields.io/badge/Styling-Vanilla%20CSS3-ff69b4.svg)
![Audio: Web%20Audio%20API](https://img.shields.io/badge/Audio-Web%20Audio%20API-purple.svg)

---

## 🚀 Features

- **👾 Cyber Boss Encounters**: Multi-phase Mega Bosses (*Legacy Monolith*, *Merge Conflict*, *Memory Leak*) descend on milestone waves (Wave 5, 10, 15) with animated boss health bars, multi-part command destruction, and boss victory rewards.
- **⏱️ Time Attack / Survival Rush Mode**: Fast-paced 60-second countdown mode where neutralizing corruption tokens rapidly rewards bonus time and combo multipliers.
- **🛠️ Custom Code Pack Creator**: Paste your own project codebase, functions, or word lists to automatically extract and compile tokens into tiered Easy/Normal/Hard difficulty pools.
- **📚 Curated Topic & Language Packs**: Tiered vocabulary sets for **JavaScript/TypeScript**, **Python**, **React**, **Rust**, **SQL**, and **CSS**.
- **Cyberpunk Terminal Aesthetics**: Multi-color ambient matrix code rain backdrop, CRT scanline overlay, vignette, and flicker visual effects.
- **Dynamic Difficulty Modes**:
  - **Chapter 0: TRAINING (Easy)** — Basic syntax & language primitives (42–65 px/s).
  - **Chapter 1: INVASION (Normal)** — System architecture & developer tooling (55–82 px/s).
  - **Chapter 2: CORE BREACH (Hard)** — Distributed systems, algorithms & concurrency (68–102 px/s).
  - **Chapter ⚡: TIME ATTACK (Survival)** — 60s countdown clock with kill-time bonuses.
  - **Chapter ∞: ZEN (Practice)** — Infinite core integrity for untimed warmup.
- **EMP Nuke Special Power**:
  - Purging code tokens charges the EMP Capacitor.
  - Type `EMP` or press `[TAB]` to detonate a screen-wide EMP blast and neutralize all active threats!
- **Web Audio Synthesizer**: Zero external audio assets required. All laser sweeps, explosions, alarms, boss sirens, time bonus chimes, and fanfare sounds are synthesized dynamically using the Web Audio API.
- **Pause & Resume System**: Press `[ESC]` or click `PAUSE` to freeze the game loop and spawn timers. Dedicated input handling ensures typing letters like `P` never triggers unwanted pauses.
- **High Score Persistence**: Automatically saves top scores per mode in `localStorage` with visual high score banners.

---

## 🎮 How to Play & Controls

| Action | Control / Keybinding |
| :--- | :--- |
| **Type Target Word** | Type matching letters into terminal input & press `[ENTER]` |
| **Detonate EMP Nuke** | Type `EMP` + `[ENTER]` or press `[TAB]` (when charged) |
| **Pause / Resume Game** | Press `[ESC]` or click `PAUSE [ESC]` button in HUD |
| **Select Operation Mode** | Click mode card or press numeric keys `[1]`, `[2]`, `[3]`, `[4]`, `[5]` |
| **Custom Code Pack Creator** | Click `+ CUSTOM PACK` pill in the Language Pack selector |
| **Toggle CRT Filter** | Click `CRT: ON / OFF` in Settings |
| **Toggle Mute Audio** | Click `SOUND: ON / OFF` button in HUD |

---

## 🛠️ Project Structure

```text
code-invaders/
├── index.html         # Main application HTML & DOM structure
├── styles.css         # Cyberpunk design system & scrollable layout tokens
├── README.md          # Project documentation & GitHub guide
├── LICENSE            # MIT License file
├── .gitignore         # Git ignore rules for OS and IDE files
└── js/
    ├── config.js      # Game constants, word pools, and storage keys
    ├── audio.js       # Web Audio API sound synthesizer engine
    ├── rain.js        # Multi-colored matrix code rain canvas renderer
    └── game.js        # Core game engine, rAF loop, EMP power, and UI logic
```

---

## 📦 How to Run Locally

### Option 1: Direct Browser Launch
Double-click [`index.html`](index.html) or open it directly in any browser (Chrome, Firefox, Edge, Safari).

### Option 2: Local HTTP Server (Python)
Run a quick Python server from the project directory:
```powershell
python -m http.server 3000
```
Then visit [`http://localhost:3000`](http://localhost:3000) in your browser.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

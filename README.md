# CODE INVADERS — Terminal Typing Defense v4.5

> A high-velocity, arcade cyberpunk typing defense game built with Vanilla JavaScript, Web Audio API, and Canvas API. Neutralize falling code tokens before core breach!

![License: MIT](https://img.shields.io/badge/License-MIT-brightgreen.svg)
![Tech Stack: Vanilla JS](https://img.shields.io/badge/Tech-Vanilla%20JS-blue.svg)
![Styling: CSS3](https://img.shields.io/badge/Styling-Vanilla%20CSS3-ff69b4.svg)
![Audio: Web%20Audio%20API](https://img.shields.io/badge/Audio-Web%20Audio%20API-purple.svg)

---

## 🚀 Features

- **Cyberpunk Terminal Aesthetics**: Multi-color ambient matrix code rain backdrop, CRT scanline overlay, vignette, and flicker visual effects.
- **Dynamic Difficulty Modes**:
  - **Chapter 0: TRAINING (Easy)** — Basic syntax & language primitives (40–60 px/s).
  - **Chapter 1: INVASION (Normal)** — System architecture & developer tooling (54–80 px/s).
  - **Chapter 2: CORE BREACH (Hard)** — Distributed systems, algorithms & concurrency (68–100 px/s).
- **EMP Nuke Special Power**:
  - Purging code tokens charges the EMP Capacitor.
  - Type `EMP` or press `[TAB]` to detonate a screen-wide EMP blast and neutralize all active threats!
- **Web Audio Synthesizer**: Zero external audio assets required. All laser sweeps, explosions, alarms, and fanfare sounds are synthesized dynamically using the Web Audio API.
- **Pause & Resume System**: Press `[ESC]` or click `PAUSE` to freeze the game loop and spawn timers. Dedicated input handling ensures typing letters like `P` never triggers unwanted pauses.
- **High Score Persistence**: Automatically saves top scores per mode in `localStorage` with visual high score banners.
- **Full Responsive Layout & Vertical Scrolling**: Works smoothly across viewports and smaller monitor heights with custom cyberpunk scrollbars.

---

## 🎮 How to Play & Controls

| Action | Control / Keybinding |
| :--- | :--- |
| **Type Target Word** | Type matching prefix into terminal input & press `[ENTER]` |
| **Detonate EMP Nuke** | Type `EMP` + `[ENTER]` or press `[TAB]` (when charged) |
| **Pause / Resume Game** | Press `[ESC]` or click `PAUSE [ESC]` button in HUD |
| **Select Operation Mode** | Click mode card or press numeric keys `[1]`, `[2]`, `[3]` |
| **Toggle CRT Filter** | Click `CRT: ON / OFF` button in HUD |
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

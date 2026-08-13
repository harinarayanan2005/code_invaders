/**
 * CODE INVADERS — Core Engine & State Machine
 */

(function () {
  "use strict";

  // Core Game State
  const state = {
    screen: 'BOOT',       // 'BOOT' | 'MODE_SELECT' | 'PLAYING' | 'PAUSED' | 'GAME_OVER'
    mode: 'easy',
    pool: null,
    lives: 3,
    score: 0,
    combo: 0,
    bestCombo: 0,
    purged: 0,
    missedTypes: 0,
    totalEnters: 0,
    wave: 1,
    empCharge: 0,
    startTime: 0,
    endTime: 0,
    running: false,
    words: [],           // active falling word objects { el, x, y, text, speed, tokColor, critical }
    fieldW: 800,
    fieldH: 600,
    recentWords: [],
    crtOff: false,
    highScores: {
      easy: 0,
      normal: 0,
      hard: 0
    }
  };

  let spawnTimeout = null;
  let rafId = null;
  let lastTs = 0;

  // DOM Cache
  const DOM = {
    stage: document.getElementById('stage'),
    codeRain: document.getElementById('codeRain'),
    scanlines: document.getElementById('scanlines'),
    flicker: document.getElementById('flicker'),
    boot: document.getElementById('boot'),
    bootLines: document.getElementById('bootLines'),
    titleBlock: document.getElementById('titleBlock'),
    modeSelect: document.getElementById('modeSelect'),
    modeCards: document.querySelectorAll('.mode-card'),
    hud: document.getElementById('hud'),
    integrity: document.getElementById('integrity'),
    scoreVal: document.getElementById('scoreVal'),
    comboVal: document.getElementById('comboVal'),
    waveVal: document.getElementById('waveVal'),
    waveLabel: document.getElementById('waveLabel'),
    empHudBlock: document.getElementById('empHudBlock'),
    empBarFill: document.getElementById('empBarFill'),
    empReadyText: document.getElementById('empReadyText'),
    btnCrt: document.getElementById('btnCrt'),
    btnPause: document.getElementById('btnPause'),
    btnMute: document.getElementById('btnMute'),
    toastWrap: document.getElementById('toastWrap'),
    field: document.getElementById('field'),
    terminal: document.getElementById('terminal'),
    input: document.getElementById('typedInput'),
    pauseScreen: document.getElementById('pauseScreen'),
    btnResume: document.getElementById('btnResume'),
    btnAbort: document.getElementById('btnAbort'),
    endScreen: document.getElementById('endScreen'),
    endTitle: document.getElementById('endTitle'),
    endStats: document.getElementById('endStats'),
    goHsBanner: document.getElementById('goHsBanner'),
    retryBtn: document.getElementById('retryBtn'),
    btnChangeMode: document.getElementById('btnChangeMode'),
    hsEasy: document.getElementById('hs-easy'),
    hsNormal: document.getElementById('hs-normal'),
    hsHard: document.getElementById('hs-hard')
  };

  // -------------------------------------------------------------------
  // 1. HIGH SCORES & PREFERENCES STORAGE
  // -------------------------------------------------------------------

  function loadHighScores() {
    try {
      const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.HIGH_SCORES);
      if (saved) {
        state.highScores = Object.assign(state.highScores, JSON.parse(saved));
      }
    } catch (e) {}
    updateHighScoreUI();
  }

  function saveHighScore(mode, score) {
    if (score > (state.highScores[mode] || 0)) {
      state.highScores[mode] = score;
      try {
        localStorage.setItem(CONFIG.STORAGE_KEYS.HIGH_SCORES, JSON.stringify(state.highScores));
      } catch (e) {}
      updateHighScoreUI();
      return true;
    }
    return false;
  }

  function updateHighScoreUI() {
    if (DOM.hsEasy) DOM.hsEasy.textContent = `BEST SCORE: ${state.highScores.easy || 0}`;
    if (DOM.hsNormal) DOM.hsNormal.textContent = `BEST SCORE: ${state.highScores.normal || 0}`;
    if (DOM.hsHard) DOM.hsHard.textContent = `BEST SCORE: ${state.highScores.hard || 0}`;
  }

  function loadPreferences() {
    try {
      state.crtOff = localStorage.getItem(CONFIG.STORAGE_KEYS.CRT_OFF) === 'true';
    } catch (e) {}
    applyCRTState();
  }

  function toggleCRT() {
    state.crtOff = !state.crtOff;
    try {
      localStorage.setItem(CONFIG.STORAGE_KEYS.CRT_OFF, state.crtOff);
    } catch (e) {}
    applyCRTState();
  }

  function applyCRTState() {
    if (state.crtOff) {
      if (DOM.scanlines) DOM.scanlines.classList.add('off');
      if (DOM.flicker) DOM.flicker.classList.add('off');
      if (DOM.btnCrt) {
        DOM.btnCrt.textContent = 'CRT: OFF';
        DOM.btnCrt.classList.add('off');
      }
    } else {
      if (DOM.scanlines) DOM.scanlines.classList.remove('off');
      if (DOM.flicker) DOM.flicker.classList.remove('off');
      if (DOM.btnCrt) {
        DOM.btnCrt.textContent = 'CRT: ON';
        DOM.btnCrt.classList.remove('off');
      }
    }
  }

  // -------------------------------------------------------------------
  // 2. BOOT SEQUENCE
  // -------------------------------------------------------------------

  const bootScript = [
    { t: "CORE SYSTEM INITIALIZING...", cls: "" },
    { t: "NETWORK STATUS: UNSTABLE", cls: "warn" },
    { t: "WARNING", cls: "warn" },
    { t: "UNKNOWN CODE FRAGMENTS DETECTED", cls: "warn" },
    { t: "INCOMING CODE INVASION", cls: "warn" },
    { t: "DEFENSE TERMINAL ONLINE", cls: "hi" },
    { t: "WELCOME, OPERATOR.", cls: "hi" }
  ];

  function runBoot() {
    state.screen = 'BOOT';
    DOM.boot.style.display = 'flex';
    DOM.hud.classList.remove('show');
    DOM.terminal.classList.remove('show');
    DOM.pauseScreen.classList.remove('show');
    DOM.endScreen.classList.remove('show');

    DOM.bootLines.innerHTML = '';
    DOM.titleBlock.classList.remove('show');
    DOM.modeSelect.classList.remove('show');

    updateHighScoreUI();

    let i = 0;
    function next() {
      if (i >= bootScript.length) {
        setTimeout(() => {
          DOM.titleBlock.classList.add('show');
          setTimeout(() => {
            DOM.modeSelect.classList.add('show');
            state.screen = 'MODE_SELECT';
          }, 350);
        }, 250);
        return;
      }
      const line = document.createElement('div');
      line.className = 'boot-line' + (bootScript[i].cls ? ' ' + bootScript[i].cls : '');
      line.textContent = bootScript[i].t;
      DOM.bootLines.appendChild(line);
      requestAnimationFrame(() => line.classList.add('show'));

      // Auto-scroll boot log box
      DOM.bootLines.scrollTop = DOM.bootLines.scrollHeight;
      SoundFX.playBoot();

      i++;
      setTimeout(next, 420);
    }
    next();
  }

  function selectMode(modeKey) {
    if (!CONFIG.MODES[modeKey]) return;
    state.mode = modeKey;
    state.pool = CONFIG.MODES[modeKey];
    startGame(modeKey);
  }

  DOM.modeCards.forEach(card => {
    card.addEventListener('click', () => selectMode(card.dataset.mode));
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') selectMode(card.dataset.mode);
    });
  });

  // -------------------------------------------------------------------
  // 3. GAME START
  // -------------------------------------------------------------------

  function startGame(mode) {
    state.screen = 'PLAYING';
    state.lives = 3;
    state.score = 0;
    state.combo = 0;
    state.bestCombo = 0;
    state.purged = 0;
    state.missedTypes = 0;
    state.totalEnters = 0;
    state.wave = 1;
    state.empCharge = 0;
    state.startTime = performance.now();
    state.running = true;
    state.words = [];
    state.recentWords = [];

    DOM.boot.style.display = 'none';
    DOM.hud.classList.add('show');
    DOM.terminal.classList.add('show');
    DOM.pauseScreen.classList.remove('show');
    DOM.endScreen.classList.remove('show');

    DOM.field.innerHTML = '';
    DOM.input.value = '';
    DOM.waveLabel.textContent = CONFIG.MODES[mode].label;

    updateFieldDimensions();
    updateHUD();
    DOM.input.focus();

    if (mode === 'normal') toast('MULTIPLE CODE FRAGMENTS DETECTED', 'core');
    if (mode === 'hard') toast('MULTIPLE THREATS DETECTED', 'danger');

    lastTs = performance.now();
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(loop);

    scheduleSpawn(300);
  }

  function updateFieldDimensions() {
    const rect = DOM.field.getBoundingClientRect();
    state.fieldW = rect.width || window.innerWidth;
    state.fieldH = rect.height || (window.innerHeight - 150);
  }

  window.addEventListener('resize', () => {
    updateFieldDimensions();
  });

  // -------------------------------------------------------------------
  // 4. SPAWN ENGINE
  // -------------------------------------------------------------------

  function getExclusionLimit() {
    return Math.min(15, Math.ceil(state.pool.words.length / 6));
  }

  function pickWord() {
    const pool = state.pool.words;
    const limit = getExclusionLimit();

    let candidates = pool.filter(w => !state.recentWords.includes(w));
    if (candidates.length === 0) candidates = pool;

    const picked = candidates[Math.floor(Math.random() * candidates.length)];

    state.recentWords.push(picked);
    if (state.recentWords.length > limit) {
      state.recentWords.shift();
    }
    return picked;
  }

  function scheduleSpawn(delay) {
    clearTimeout(spawnTimeout);
    spawnTimeout = setTimeout(() => {
      if (!state.running || state.screen !== 'PLAYING') return;
      spawnWord();
      const [lo, hi] = state.pool.spawn;
      const ramp = Math.max(0.38, 1 - (state.wave - 1) * 0.08);
      scheduleSpawn((lo + Math.random() * (hi - lo)) * ramp);
    }, delay);
  }

  function spawnWord() {
    if (!state.running || state.screen !== 'PLAYING') return;

    const text = pickWord();
    const el = document.createElement('div');
    el.className = 'word';
    el.textContent = text;

    const tokColor = CONFIG.TOKEN_COLORS[Math.floor(Math.random() * CONFIG.TOKEN_COLORS.length)];
    el.style.setProperty('--tok', tokColor);
    DOM.field.appendChild(el);

    const w = el.getBoundingClientRect().width || (text.length * 11 + 24);
    const maxX = Math.max(10, state.fieldW - w - 10);
    const x = 10 + Math.random() * maxX;

    const [slo, shi] = state.pool.speed;
    const speed = (slo + Math.random() * (shi - slo)) * (1 + (state.wave - 1) * 0.07);

    el.style.left = x + 'px';
    el.style.top = '-30px';

    state.words.push({ el, x, y: -30, text, speed, tokColor, critical: false, width: w });
  }

  // -------------------------------------------------------------------
  // 5. GAME LOOP
  // -------------------------------------------------------------------

  function loop(ts) {
    if (!state.running || state.screen !== 'PLAYING') return;

    const dt = Math.min(0.05, (ts - lastTs) / 1000);
    lastTs = ts;

    const criticalY = state.fieldH - 70;
    for (let i = state.words.length - 1; i >= 0; i--) {
      const w = state.words[i];
      w.y += w.speed * dt;
      w.el.style.top = w.y + 'px';

      if (w.y > criticalY && !w.critical) {
        w.critical = true;
        w.el.classList.add('critical');
        toast('CRITICAL THREAT — CORE BREACH IMMINENT', 'danger');
      }

      if (w.y >= state.fieldH - 24) {
        loseLife(w);
        state.words.splice(i, 1);
      }
    }

    const newWave = 1 + Math.floor(state.score / CONFIG.WAVE_SCORE_STEP);
    if (newWave !== state.wave) {
      state.wave = newWave;
      DOM.waveVal.textContent = String(state.wave).padStart(2, '0');
      SoundFX.playWaveUp();
      if (state.mode === 'hard') {
        toast('CORE LOAD: ' + Math.min(96, 60 + state.wave * 6) + '%', 'warn');
      } else {
        toast('INCOMING TRAFFIC INCREASING — WAVE ' + state.wave, 'warn');
      }
    }

    rafId = requestAnimationFrame(loop);
  }

  function loseLife(w) {
    if (w.el && w.el.parentNode) w.el.parentNode.removeChild(w.el);
    state.lives--;
    state.combo = 0;
    SoundFX.playDamage();
    updateHUD();
    toast('CORE DAMAGE DETECTED', 'danger');
    if (state.lives <= 0) {
      endGame(false);
    }
  }

  // -------------------------------------------------------------------
  // 6. PAUSE & EMP POWERS
  // -------------------------------------------------------------------

  function togglePause() {
    if (state.screen === 'PLAYING') {
      state.screen = 'PAUSED';
      state.running = false;
      clearTimeout(spawnTimeout);
      cancelAnimationFrame(rafId);
      DOM.pauseScreen.classList.add('show');
      SoundFX.playPause();
    } else if (state.screen === 'PAUSED') {
      resumeGame();
    }
  }

  function resumeGame() {
    if (state.screen !== 'PAUSED') return;
    state.screen = 'PLAYING';
    state.running = true;
    DOM.pauseScreen.classList.remove('show');
    DOM.input.focus();
    SoundFX.playPause();

    lastTs = performance.now();
    rafId = requestAnimationFrame(loop);
    scheduleSpawn(800);
  }

  function addEMPCharge(points = 1) {
    if (state.empCharge < CONFIG.EMP_MAX_CHARGE) {
      state.empCharge = Math.min(CONFIG.EMP_MAX_CHARGE, state.empCharge + points);
      if (state.empCharge === CONFIG.EMP_MAX_CHARGE) {
        toast('EMP CAPACITOR CHARGED! PRESS [TAB] OR TYPE "EMP"', 'emp');
      }
      updateHUD();
    }
  }

  function triggerEMP() {
    if (state.empCharge < CONFIG.EMP_MAX_CHARGE) return false;

    state.empCharge = 0;
    SoundFX.playEMP();

    const blast = document.createElement('div');
    blast.className = 'emp-blast-overlay';
    DOM.field.appendChild(blast);
    setTimeout(() => blast.remove(), 550);

    toast('*** EMP BLAST ACTIVATED! ***', 'emp');

    const wordsToPurge = [...state.words];
    wordsToPurge.forEach(targetWord => {
      spawnPurgeBurst(targetWord);
      if (targetWord.el && targetWord.el.parentNode) targetWord.el.remove();
      state.purged++;
      state.score += 15 + targetWord.text.length * 2;
    });

    state.words = [];
    DOM.input.value = '';
    updateHUD();
    return true;
  }

  // -------------------------------------------------------------------
  // 7. INPUT & TARGETING
  // -------------------------------------------------------------------

  DOM.input.addEventListener('input', () => {
    if (!state.running || state.screen !== 'PLAYING') return;
    const typed = DOM.input.value.toUpperCase();
    DOM.input.value = typed;

    for (const w of state.words) {
      const isPrefix = typed.length > 0 && w.text.startsWith(typed);
      w.el.classList.toggle('targeted', isPrefix);
      if (isPrefix) {
        w.el.innerHTML = '<span class="matched">' + w.text.slice(0, typed.length) + '</span>' + w.text.slice(typed.length);
      } else {
        w.el.textContent = w.text;
      }
    }
  });

  DOM.input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      if (!state.running || state.screen !== 'PLAYING') return;
      handleEnterPress();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (state.screen === 'PLAYING') {
        triggerEMP();
      }
    }
  });

  function handleEnterPress() {
    const typed = DOM.input.value.toUpperCase().trim();
    DOM.input.value = '';
    if (!typed) return;

    if (typed === CONFIG.EMP_COMMAND) {
      if (triggerEMP()) return;
    }

    state.totalEnters++;
    const idx = state.words.findIndex(w => w.text === typed);
    if (idx >= 0) {
      fireLaser(state.words[idx]);
      state.words.splice(idx, 1);
    } else {
      state.missedTypes++;
      SoundFX.playError();
      DOM.input.classList.remove('miss');
      void DOM.input.offsetWidth;
      DOM.input.classList.add('miss');
    }
  }

  function fireLaser(w) {
    const rect = w.el.getBoundingClientRect();
    const fieldRect = DOM.field.getBoundingClientRect();
    const cx = rect.left - fieldRect.left + rect.width / 2;
    const cy = rect.top - fieldRect.top + rect.height / 2;

    const color = w.tokColor || 'var(--lock)';
    const laser = document.createElement('div');
    laser.className = 'laser';
    laser.style.left = cx + 'px';
    laser.style.top = '0px';
    laser.style.height = cy + 'px';
    laser.style.background = 'linear-gradient(180deg, transparent, ' + color + ', transparent)';
    laser.style.boxShadow = '0 0 10px ' + color;
    DOM.field.appendChild(laser);
    setTimeout(() => laser.remove(), 160);

    spawnPurgeBurst(w, cx, cy, color);

    if (w.el && w.el.parentNode) w.el.parentNode.removeChild(w.el);

    SoundFX.playLaser();
    SoundFX.playPurge();

    state.score += 10 + w.text.length * 2 + state.combo * 3;
    state.purged++;
    state.combo++;
    state.bestCombo = Math.max(state.bestCombo, state.combo);
    addEMPCharge(1);
    updateHUD();

    if (state.combo === 3) toast('DEFENSE EFFICIENCY INCREASED — COMBO x3', 'core');
    else if (state.combo === 5) toast('CORE DEFENSE OPTIMIZED — COMBO x5', 'core');
    else if (state.combo === 10) toast('ELITE OPERATOR STATUS — COMBO x10', 'core');
    else if (state.combo > 10 && state.combo % 5 === 0) toast('COMBO x' + state.combo, 'core');
  }

  function spawnPurgeBurst(w, cx, cy, color) {
    if (!cx || !cy) {
      const rect = w.el.getBoundingClientRect();
      const fieldRect = DOM.field.getBoundingClientRect();
      cx = rect.left - fieldRect.left + rect.width / 2;
      cy = rect.top - fieldRect.top + rect.height / 2;
    }
    const burst = document.createElement('div');
    burst.className = 'purge-burst';
    burst.textContent = 'PURGED';
    burst.style.left = (cx - 24) + 'px';
    burst.style.top = cy + 'px';
    burst.style.color = color || 'var(--purge)';
    burst.style.textShadow = '0 0 10px ' + (color || 'var(--purge)');
    DOM.field.appendChild(burst);
    setTimeout(() => burst.remove(), 600);
  }

  function updateHUD() {
    DOM.scoreVal.textContent = state.score.toLocaleString();
    DOM.comboVal.textContent = state.combo > 1 ? ('COMBO x' + state.combo) : '';

    let hearts = '';
    for (let i = 0; i < 3; i++) {
      hearts += '<span class="heart' + (i < state.lives ? '' : ' lost') + '">♥</span> ';
    }
    DOM.integrity.innerHTML = hearts.trim();

    // EMP HUD fill
    const empPercent = Math.min(100, Math.round((state.empCharge / CONFIG.EMP_MAX_CHARGE) * 100));
    if (DOM.empBarFill) DOM.empBarFill.style.width = `${empPercent}%`;

    if (state.empCharge >= CONFIG.EMP_MAX_CHARGE) {
      if (DOM.empHudBlock) DOM.empHudBlock.classList.add('charged');
      if (DOM.empReadyText) DOM.empReadyText.style.display = 'inline';
    } else {
      if (DOM.empHudBlock) DOM.empHudBlock.classList.remove('charged');
      if (DOM.empReadyText) DOM.empReadyText.style.display = 'none';
    }
  }

  function toast(msg, cls) {
    const el = document.createElement('div');
    el.className = 'toast ' + (cls || 'core');
    el.textContent = msg;
    DOM.toastWrap.appendChild(el);
    setTimeout(() => el.remove(), 2000);
  }

  // -------------------------------------------------------------------
  // 8. GAME OVER
  // -------------------------------------------------------------------

  function endGame(win) {
    state.running = false;
    cancelAnimationFrame(rafId);
    clearTimeout(spawnTimeout);
    DOM.terminal.classList.remove('show');

    const elapsedSec = Math.max(1, Math.round((performance.now() - state.startTime) / 1000));
    const accuracy = state.totalEnters > 0
      ? Math.round((state.purged / state.totalEnters) * 100)
      : 100;

    const isNewHighScore = saveHighScore(state.mode, state.score);
    if (isNewHighScore) {
      if (DOM.goHsBanner) DOM.goHsBanner.style.display = 'block';
      SoundFX.playHighScore();
    } else {
      if (DOM.goHsBanner) DOM.goHsBanner.style.display = 'none';
    }

    DOM.endTitle.textContent = win ? 'SYSTEM RESTORED' : 'CORE BREACHED';
    DOM.endTitle.className = win ? '' : 'fail';

    DOM.endStats.innerHTML = `
      <div>FINAL SCORE<b>${state.score.toLocaleString()}</b></div>
      <div>TARGETS PURGED<b>${state.purged}</b></div>
      <div>BEST COMBO<b>x${state.bestCombo}</b></div>
      <div>ACCURACY<b>${accuracy}%</b></div>
      <div>DEPTH REACHED<b>${state.wave}</b></div>
      <div>TIME SURVIVED<b>${elapsedSec}s</b></div>
    `;

    setTimeout(() => {
      DOM.endScreen.classList.add('show');
      state.screen = 'GAME_OVER';
    }, win ? 200 : 800);

    if (!win) toast('THE CORE HAS FALLEN.', 'danger');
  }

  // -------------------------------------------------------------------
  // 9. EVENT LISTENERS
  // -------------------------------------------------------------------

  document.addEventListener('keydown', (e) => {
    if (state.screen === 'BOOT' || state.screen === 'MODE_SELECT') {
      if (e.key === '1') selectMode('easy');
      if (e.key === '2') selectMode('normal');
      if (e.key === '3') selectMode('hard');
    } else if (state.screen === 'GAME_OVER' && e.key === 'Enter') {
      runBoot();
    } else if (e.key === 'Escape') {
      if (state.screen === 'PLAYING' || state.screen === 'PAUSED') {
        togglePause();
      }
    } else if (state.screen === 'PLAYING') {
      if (document.activeElement !== DOM.input && e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        DOM.input.focus();
      }
    }
  });

  DOM.retryBtn.addEventListener('click', () => {
    runBoot();
  });

  if (DOM.btnChangeMode) {
    DOM.btnChangeMode.addEventListener('click', () => {
      runBoot();
    });
  }

  if (DOM.btnPause) {
    DOM.btnPause.addEventListener('click', () => {
      togglePause();
    });
  }

  if (DOM.btnResume) {
    DOM.btnResume.addEventListener('click', () => {
      resumeGame();
    });
  }

  if (DOM.btnAbort) {
    DOM.btnAbort.addEventListener('click', () => {
      runBoot();
    });
  }

  DOM.btnMute.addEventListener('click', () => {
    const muted = SoundFX.toggleMute();
    DOM.btnMute.textContent = muted ? 'SOUND: OFF' : 'SOUND: ON';
    DOM.btnMute.classList.toggle('muted', muted);
  });

  if (DOM.btnCrt) {
    DOM.btnCrt.addEventListener('click', () => {
      toggleCRT();
    });
  }

  document.addEventListener('click', (e) => {
    if (state && state.running && !e.target.classList.contains('btn-ctrl')) {
      DOM.input.focus();
    }
  });

  // Initial Load
  window.addEventListener('DOMContentLoaded', () => {
    loadHighScores();
    loadPreferences();
    CodeRain.init('codeRain');
    runBoot();
  });

})();

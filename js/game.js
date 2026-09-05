/**
 * CODE INVADERS — Core Engine & State Machine
 * Features: Power-ups (Full Screen Bomb, Freeze 5s, Repair), Auto-demolish, Zen Practice Mode
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
    freezeUntil: 0,
    startTime: 0,
    endTime: 0,
    running: false,
    words: [],           // active falling word objects { el, x, y, text, speed, tokColor, critical, powerup }
    fieldW: 800,
    fieldH: 600,
    recentWords: [],
    crtOff: false,
    theme: 'cyberpunk',
    wordPack: 'jsts',
    unlockedAchievements: {},
    currentWPM: 0,
    currentAccuracy: 100,
    purgedChars: 0,
    totalKeyHits: 0,
    correctKeyHits: 0,
    empCount: 0,
    damageCount: 0,
    activeBoss: null,
    defeatedBosses: [],
    timeRemaining: 60,
    totalTimeSurvived: 0,
    lastLowTimeBeep: 0,
    customPacks: {},
    activePlayer: 'OPERATOR_1',
    playerProfiles: {
      'OPERATOR_1': { avatar: '👤', easy: 0, normal: 0, hard: 0, survival: 0, zen: 0 }
    },
    keyStats: {},
    weakestKeys: [],
    highScores: {
      easy: 0,
      normal: 0,
      hard: 0,
      survival: 0,
      zen: 0
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
    integrityHudBlock: document.getElementById('integrityHudBlock'),
    timerHudBlock: document.getElementById('timerHudBlock'),
    timerVal: document.getElementById('timerVal'),
    bossHudWrap: document.getElementById('bossHudWrap'),
    bossIcon: document.getElementById('bossIcon'),
    bossName: document.getElementById('bossName'),
    bossPhase: document.getElementById('bossPhase'),
    bossHpPercent: document.getElementById('bossHpPercent'),
    bossHpFill: document.getElementById('bossHpFill'),
    scoreVal: document.getElementById('scoreVal'),
    comboVal: document.getElementById('comboVal'),
    waveVal: document.getElementById('waveVal'),
    waveLabel: document.getElementById('waveLabel'),
    wpmVal: document.getElementById('wpmVal'),
    accuracyVal: document.getElementById('accuracyVal'),
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
    endHeatmapWrap: document.getElementById('endHeatmapWrap'),
    endKeyboardHeatmap: document.getElementById('endKeyboardHeatmap'),
    endWeakKeysBanner: document.getElementById('endWeakKeysBanner'),
    btnHeatmapDrill: document.getElementById('btnHeatmapDrill'),
    goHsBanner: document.getElementById('goHsBanner'),
    retryBtn: document.getElementById('retryBtn'),
    btnChangeMode: document.getElementById('btnChangeMode'),
    hsEasy: document.getElementById('hs-easy'),
    hsNormal: document.getElementById('hs-normal'),
    hsHard: document.getElementById('hs-hard'),
    hsSurvival: document.getElementById('hs-survival'),
    hsZen: document.getElementById('hs-zen'),
    // Profile, Theme, Pack & Trophy DOM
    activePlayerTag: document.getElementById('activePlayerTag'),
    btnSwitchPlayer: document.getElementById('btnSwitchPlayer'),
    themeButtons: document.querySelectorAll('.btn-theme'),
    packPillsContainer: document.getElementById('packPillsContainer'),
    packPills: document.querySelectorAll('.pack-pill'),
    btnCustomPackModal: document.getElementById('btnCustomPackModal'),
    customPackModal: document.getElementById('customPackModal'),
    customPackNameInput: document.getElementById('customPackNameInput'),
    customPackSourceInput: document.getElementById('customPackSourceInput'),
    btnParseCustomCode: document.getElementById('btnParseCustomCode'),
    customTokensPreviewList: document.getElementById('customTokensPreviewList'),
    countEasy: document.getElementById('countEasy'),
    countNormal: document.getElementById('countNormal'),
    countHard: document.getElementById('countHard'),
    countTotal: document.getElementById('countTotal'),
    btnSaveCustomPack: document.getElementById('btnSaveCustomPack'),
    btnCloseCustomPackModal: document.getElementById('btnCloseCustomPackModal'),
    btnTrophies: document.getElementById('btnTrophies'),
    trophyModal: document.getElementById('trophyModal'),
    trophyGrid: document.getElementById('trophyGrid'),
    btnCloseTrophies: document.getElementById('btnCloseTrophies'),
    btnStats: document.getElementById('btnStats'),
    statsModal: document.getElementById('statsModal'),
    statsGrid: document.getElementById('statsGrid'),
    careerHeatmapWrap: document.getElementById('careerHeatmapWrap'),
    careerKeyboardHeatmap: document.getElementById('careerKeyboardHeatmap'),
    btnCloseStats: document.getElementById('btnCloseStats'),
    playerModal: document.getElementById('playerModal'),
    playerHandleInput: document.getElementById('playerHandleInput'),
    btnCreatePlayer: document.getElementById('btnCreatePlayer'),
    playerList: document.getElementById('playerList'),
    btnClosePlayerModal: document.getElementById('btnClosePlayerModal'),
    btnRandomName: document.getElementById('btnRandomName'),
    avatarPickerGrid: document.getElementById('avatarPickerGrid'),
    bootControls: document.getElementById('bootControls'),
    btnSettings: document.getElementById('btnSettings'),
    btnBootSettings: document.getElementById('btnBootSettings'),
    settingsModal: document.getElementById('settingsModal'),
    btnCloseSettings: document.getElementById('btnCloseSettings'),
    btnToggleSfx: document.getElementById('btnToggleSfx'),
    btnToggleMusic: document.getElementById('btnToggleMusic'),
    musicVolumeSlider: document.getElementById('musicVolumeSlider'),
    btnToggleCrtModal: document.getElementById('btnToggleCrtModal')
  };

  // -------------------------------------------------------------------
  // 1. PLAYER PROFILES & HIGH SCORES STORAGE
  // -------------------------------------------------------------------

  function loadPlayerProfiles() {
    try {
      const savedProfiles = localStorage.getItem(CONFIG.STORAGE_KEYS.PLAYER_PROFILES);
      if (savedProfiles) {
        state.playerProfiles = JSON.parse(savedProfiles);
      }
      const savedActive = localStorage.getItem(CONFIG.STORAGE_KEYS.ACTIVE_PLAYER);
      if (savedActive && state.playerProfiles[savedActive]) {
        state.activePlayer = savedActive;
      } else if (!state.playerProfiles[state.activePlayer]) {
        state.playerProfiles['OPERATOR_1'] = { avatar: '👤', easy: 0, normal: 0, hard: 0, zen: 0 };
        state.activePlayer = 'OPERATOR_1';
      }
    } catch (e) {
      state.playerProfiles = { 'OPERATOR_1': { avatar: '👤', easy: 0, normal: 0, hard: 0, zen: 0 } };
      state.activePlayer = 'OPERATOR_1';
    }
    setActivePlayer(state.activePlayer);
  }

  function setActivePlayer(handle) {
    if (!handle) return;
    state.activePlayer = handle;
    if (!state.playerProfiles[handle]) {
      state.playerProfiles[handle] = { avatar: '👤', easy: 0, normal: 0, hard: 0, zen: 0 };
    }
    state.activeAvatar = state.playerProfiles[handle].avatar || '👤';
    state.highScores = state.playerProfiles[handle];
    try {
      localStorage.setItem(CONFIG.STORAGE_KEYS.ACTIVE_PLAYER, handle);
      localStorage.setItem(CONFIG.STORAGE_KEYS.PLAYER_PROFILES, JSON.stringify(state.playerProfiles));
    } catch (e) {}
    if (DOM.activePlayerTag) DOM.activePlayerTag.textContent = `${state.activeAvatar} ${handle}`;
    updateHighScoreUI();
  }

  function generateRandomName() {
    const pool = CONFIG.PRESET_HANDLES || ['CYBER_PHANTOM', 'BYTE_NINJA', 'NEON_DEFENDER'];
    const name = pool[Math.floor(Math.random() * pool.length)];
    if (DOM.playerHandleInput) {
      DOM.playerHandleInput.value = name;
      DOM.playerHandleInput.focus();
    }
  }

  function renderAvatarPicker() {
    if (!DOM.avatarPickerGrid) return;
    DOM.avatarPickerGrid.innerHTML = '';
    const avatars = CONFIG.AVATARS || ['👤', '🤖', '⚡', '🛡️', '👾', '💀', '🔮', '⚔️', '🛸', '💎'];
    if (!state.selectedAvatar) state.selectedAvatar = state.activeAvatar || '👤';

    avatars.forEach(av => {
      const badge = document.createElement('div');
      badge.className = `avatar-badge${av === state.selectedAvatar ? ' selected' : ''}`;
      badge.textContent = av;
      badge.addEventListener('click', () => {
        state.selectedAvatar = av;
        renderAvatarPicker();
      });
      DOM.avatarPickerGrid.appendChild(badge);
    });
  }

  function createPlayerProfile(rawHandle) {
    const handle = rawHandle.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
    if (!handle) return alert('Please enter a valid operator handle (Letters/Numbers/Underscore).');
    const av = state.selectedAvatar || '👤';
    if (state.playerProfiles[handle]) {
      state.playerProfiles[handle].avatar = av;
      setActivePlayer(handle);
    } else {
      state.playerProfiles[handle] = { avatar: av, easy: 0, normal: 0, hard: 0, zen: 0 };
      setActivePlayer(handle);
    }
    renderPlayerList();
    if (DOM.playerHandleInput) DOM.playerHandleInput.value = '';
    closePlayerModal();
  }

  function renderPlayerList() {
    if (!DOM.playerList) return;
    DOM.playerList.innerHTML = '';
    Object.keys(state.playerProfiles).forEach(handle => {
      const p = state.playerProfiles[handle];
      const av = p.avatar || '👤';
      const item = document.createElement('div');
      item.className = `player-item${handle === state.activePlayer ? ' active' : ''}`;
      const totalBest = (p.easy || 0) + (p.normal || 0) + (p.hard || 0);
      item.innerHTML = `
        <span class="player-item-name">${av} ${handle} ${handle === state.activePlayer ? '★' : ''}</span>
        <span class="player-item-scores">BEST: ${totalBest.toLocaleString()} PTS (E:${p.easy || 0} N:${p.normal || 0} H:${p.hard || 0})</span>
      `;
      item.addEventListener('click', () => {
        setActivePlayer(handle);
        renderPlayerList();
        closePlayerModal();
      });
      DOM.playerList.appendChild(item);
    });
  }

  function openPlayerModal() {
    state.selectedAvatar = state.activeAvatar || '👤';
    renderAvatarPicker();
    renderPlayerList();
    if (DOM.playerModal) DOM.playerModal.classList.add('show');
    if (DOM.playerHandleInput) {
      DOM.playerHandleInput.value = '';
      setTimeout(() => DOM.playerHandleInput.focus(), 100);
    }
  }

  function closePlayerModal() {
    if (DOM.playerModal) DOM.playerModal.classList.remove('show');
  }

  // -------------------------------------------------------------------
  // 1C. SYSTEM SETTINGS MODAL ENGINE
  // -------------------------------------------------------------------

  function openSettingsModal() {
    updateSettingsUI();
    if (DOM.settingsModal) DOM.settingsModal.classList.add('show');
  }

  function closeSettingsModal() {
    if (DOM.settingsModal) DOM.settingsModal.classList.remove('show');
  }

  function updateSettingsUI() {
    if (DOM.btnToggleSfx) {
      const muted = SoundFX.isMuted();
      DOM.btnToggleSfx.textContent = muted ? 'SFX: OFF' : 'SFX: ON';
      DOM.btnToggleSfx.classList.toggle('on', !muted);
      if (DOM.btnMute) {
        DOM.btnMute.textContent = muted ? 'SOUND: OFF' : 'SOUND: ON';
        DOM.btnMute.classList.toggle('muted', muted);
      }
    }
    if (DOM.btnToggleMusic) {
      const musicMuted = SoundFX.isMusicMuted();
      DOM.btnToggleMusic.textContent = musicMuted ? 'MUSIC: OFF' : 'MUSIC: ON';
      DOM.btnToggleMusic.classList.toggle('on', !musicMuted);
    }
    if (DOM.musicVolumeSlider) {
      DOM.musicVolumeSlider.value = SoundFX.getMusicVolume();
    }
    if (DOM.btnToggleCrtModal) {
      DOM.btnToggleCrtModal.textContent = state.crtOff ? 'CRT: OFF' : 'CRT: ON';
      DOM.btnToggleCrtModal.classList.toggle('on', !state.crtOff);
    }
  }

  function saveHighScore(mode, score) {
    if (mode === 'zen') return false;
    const currentBest = state.highScores[mode] || 0;
    if (score > currentBest) {
      state.highScores[mode] = score;
      state.playerProfiles[state.activePlayer][mode] = score;
      try {
        localStorage.setItem(CONFIG.STORAGE_KEYS.PLAYER_PROFILES, JSON.stringify(state.playerProfiles));
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
    if (DOM.hsSurvival) {
      const best = state.highScores.survival || 0;
      DOM.hsSurvival.textContent = `BEST SURVIVED: ${typeof best === 'number' ? best.toFixed(1) : best}s`;
    }
  }

  // -------------------------------------------------------------------
  // 1D. LANGUAGE WORD PACK & CUSTOM PACK SELECTOR ENGINE
  // -------------------------------------------------------------------

  function loadWordPack() {
    loadCustomPacks();
    let savedPack = 'jsts';
    try {
      savedPack = localStorage.getItem(CONFIG.STORAGE_KEYS.WORD_PACK) || 'jsts';
    } catch (e) {}
    setWordPack(savedPack);
  }

  function loadCustomPacks() {
    try {
      const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.CUSTOM_PACKS);
      if (saved) {
        state.customPacks = JSON.parse(saved);
        Object.keys(state.customPacks).forEach(packKey => {
          CONFIG.WORD_PACKS[packKey] = state.customPacks[packKey];
        });
      }
    } catch (e) {}
    renderPackPills();
  }

  function renderPackPills() {
    if (!DOM.packPillsContainer) return;
    DOM.packPillsContainer.innerHTML = '';

    Object.keys(CONFIG.WORD_PACKS).forEach(packKey => {
      const pack = CONFIG.WORD_PACKS[packKey];
      const pill = document.createElement('button');
      pill.className = 'pack-pill' + (state.wordPack === packKey ? ' active' : '');
      pill.dataset.pack = packKey;
      pill.textContent = pack.name || packKey.toUpperCase();
      pill.addEventListener('click', () => {
        setWordPack(packKey);
      });
      DOM.packPillsContainer.appendChild(pill);
    });
  }

  function setWordPack(packKey) {
    if (!CONFIG.WORD_PACKS[packKey]) packKey = 'jsts';
    state.wordPack = packKey;
    try {
      localStorage.setItem(CONFIG.STORAGE_KEYS.WORD_PACK, packKey);
    } catch (e) {}

    renderPackPills();

    const pack = CONFIG.WORD_PACKS[packKey];
    if (pack) {
      if (pack.easy && pack.normal && pack.hard) {
        CONFIG.MODES.easy.words = pack.easy;
        CONFIG.MODES.normal.words = pack.normal;
        CONFIG.MODES.hard.words = pack.hard;
        CONFIG.MODES.zen.words = pack.words || [...pack.easy, ...pack.normal, ...pack.hard];
        if (CONFIG.MODES.survival) CONFIG.MODES.survival.words = pack.normal.length ? pack.normal : pack.words;
      } else if (pack.words && pack.words.length > 0) {
        Object.keys(CONFIG.MODES).forEach(m => {
          CONFIG.MODES[m].words = pack.words;
        });
      }
    }
  }

  function openCustomPackModal() {
    if (DOM.customPackModal) DOM.customPackModal.classList.add('show');
    if (DOM.customPackNameInput) DOM.customPackNameInput.focus();
  }

  function closeCustomPackModal() {
    if (DOM.customPackModal) DOM.customPackModal.classList.remove('show');
  }

  function parseSourceCode(rawText) {
    if (!rawText) return { easy: [], normal: [], hard: [], all: [] };
    const matches = rawText.match(/[A-Za-z_][A-Za-z0-9_]{2,}/g) || [];
    const unique = [...new Set(matches.map(m => m.toUpperCase()))];

    const easy = unique.filter(w => w.length >= 3 && w.length <= 5);
    const normal = unique.filter(w => w.length >= 6 && w.length <= 9);
    const hard = unique.filter(w => w.length >= 10);

    return { easy, normal, hard, all: unique };
  }

  let currentParsedTokens = null;

  function handleParseCustomCode() {
    const raw = DOM.customPackSourceInput ? DOM.customPackSourceInput.value : '';
    currentParsedTokens = parseSourceCode(raw);

    if (DOM.countEasy) DOM.countEasy.textContent = currentParsedTokens.easy.length;
    if (DOM.countNormal) DOM.countNormal.textContent = currentParsedTokens.normal.length;
    if (DOM.countHard) DOM.countHard.textContent = currentParsedTokens.hard.length;
    if (DOM.countTotal) DOM.countTotal.textContent = currentParsedTokens.all.length;

    if (DOM.customTokensPreviewList) {
      DOM.customTokensPreviewList.innerHTML = '';
      if (currentParsedTokens.all.length === 0) {
        DOM.customTokensPreviewList.innerHTML = '<span style="color:var(--text-dim);font-size:11px;">No valid tokens detected. Paste code above and click compile.</span>';
        return;
      }
      currentParsedTokens.all.slice(0, 50).forEach(tok => {
        const chip = document.createElement('span');
        const tier = tok.length <= 5 ? 'easy' : (tok.length <= 9 ? 'normal' : 'hard');
        chip.className = `token-chip ${tier}`;
        chip.textContent = tok;
        DOM.customTokensPreviewList.appendChild(chip);
      });
      if (currentParsedTokens.all.length > 50) {
        const more = document.createElement('span');
        more.className = 'token-chip';
        more.textContent = `+${currentParsedTokens.all.length - 50} MORE`;
        DOM.customTokensPreviewList.appendChild(more);
      }
    }
  }

  function handleSaveCustomPack() {
    const rawName = DOM.customPackNameInput ? DOM.customPackNameInput.value.trim() : '';
    if (!rawName) {
      alert('Please enter a pack name (e.g., MY_API, JAVA_SPRING).');
      return;
    }

    if (!currentParsedTokens || currentParsedTokens.all.length === 0) {
      handleParseCustomCode();
    }

    if (!currentParsedTokens || currentParsedTokens.all.length === 0) {
      alert('Please paste code or words to extract playable tokens.');
      return;
    }

    const packKey = 'custom_' + rawName.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const newPack = {
      name: rawName.toUpperCase().slice(0, 14),
      label: rawName.toUpperCase(),
      easy: currentParsedTokens.easy.length > 0 ? currentParsedTokens.easy : currentParsedTokens.all,
      normal: currentParsedTokens.normal.length > 0 ? currentParsedTokens.normal : currentParsedTokens.all,
      hard: currentParsedTokens.hard.length > 0 ? currentParsedTokens.hard : currentParsedTokens.all,
      words: currentParsedTokens.all
    };

    state.customPacks[packKey] = newPack;
    CONFIG.WORD_PACKS[packKey] = newPack;

    try {
      localStorage.setItem(CONFIG.STORAGE_KEYS.CUSTOM_PACKS, JSON.stringify(state.customPacks));
    } catch (e) {}

    renderPackPills();
    setWordPack(packKey);
    unlockAchievement('CUSTOM_HACKER');
    closeCustomPackModal();
    toast(`CUSTOM PACK "${newPack.name}" COMPILED & ACTIVATED!`, 'emp');
  }

  // -------------------------------------------------------------------
  // 1E. ACHIEVEMENTS & TROPHY ROOM ENGINE
  // -------------------------------------------------------------------

  function loadAchievements() {
    try {
      const saved = localStorage.getItem(CONFIG.STORAGE_KEYS.ACHIEVEMENTS);
      if (saved) {
        state.unlockedAchievements = JSON.parse(saved);
      }
    } catch (e) {}
  }

  function unlockAchievement(id) {
    if (!CONFIG.ACHIEVEMENTS[id]) return;
    if (!state.unlockedAchievements[id]) {
      state.unlockedAchievements[id] = Date.now();
      try {
        localStorage.setItem(CONFIG.STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(state.unlockedAchievements));
      } catch (e) {}
      SoundFX.playHighScore();
      toast(`🏆 UNLOCKED: ${CONFIG.ACHIEVEMENTS[id].title}!`, 'core');
    }
  }

  function checkAchievements() {
    if (state.currentWPM >= 60) unlockAchievement('SPEED_DEMON');
    if (state.combo >= 15) unlockAchievement('COMBO_KING');
    if (state.empCount >= 3) unlockAchievement('NUKE_SPECIALIST');
    if (state.wave >= 5 && state.damageCount === 0 && state.mode !== 'zen') unlockAchievement('UNTOUCHABLE');
    if (state.purged >= 15 && state.currentAccuracy === 100) unlockAchievement('PRECISION_MASTER');
  }

  function renderTrophyGrid() {
    if (!DOM.trophyGrid) return;
    DOM.trophyGrid.innerHTML = '';
    Object.values(CONFIG.ACHIEVEMENTS).forEach(ach => {
      const isUnlocked = !!state.unlockedAchievements[ach.id];
      const card = document.createElement('div');
      card.className = `trophy-card${isUnlocked ? ' unlocked' : ''}`;
      card.innerHTML = `
        <div class="trophy-icon">${ach.icon}</div>
        <div class="trophy-info">
          <div class="trophy-title">${ach.title} ${isUnlocked ? '✓' : '🔒'}</div>
          <div class="trophy-desc">${ach.desc}</div>
        </div>
      `;
      DOM.trophyGrid.appendChild(card);
    });
  }

  function openTrophyModal() {
    renderTrophyGrid();
    if (DOM.trophyModal) DOM.trophyModal.classList.add('show');
  }

  function closeTrophyModal() {
    if (DOM.trophyModal) DOM.trophyModal.classList.remove('show');
  }

  // -------------------------------------------------------------------
  // 1F. LIFETIME CAREER STATS ENGINE
  // -------------------------------------------------------------------

  function renderCareerStats() {
    if (!DOM.statsGrid) return;
    const profile = state.playerProfiles[state.activePlayer] || {};
    const st = profile.stats || { gamesPlayed: 0, gamesWon: 0, totalPurged: 0, bestWPM: 0, totalKeyHits: 0, correctKeyHits: 0, empTriggered: 0, playTimeSec: 0 };
    const acc = st.totalKeyHits > 0 ? Math.round((st.correctKeyHits / st.totalKeyHits) * 100) : 100;
    const mins = Math.floor((st.playTimeSec || 0) / 60);
    const secs = (st.playTimeSec || 0) % 60;
    const formattedTime = `${mins}m ${secs}s`;

    DOM.statsGrid.innerHTML = `
      <div class="stat-box stat-box-full">
        <div class="stat-lbl">OPERATOR PROFILE</div>
        <div class="stat-val" style="color:var(--lock);">${state.activeAvatar} ${state.activePlayer}</div>
      </div>
      <div class="stat-box">
        <div class="stat-lbl">MISSIONS PLAYED</div>
        <div class="stat-val">${st.gamesPlayed || 0}</div>
      </div>
      <div class="stat-box">
        <div class="stat-lbl">MISSIONS RESTORED</div>
        <div class="stat-val" style="color:var(--core);">${st.gamesWon || 0}</div>
      </div>
      <div class="stat-box">
        <div class="stat-lbl">CORRUPTION PURGED</div>
        <div class="stat-val">${(st.totalPurged || 0).toLocaleString()}</div>
      </div>
      <div class="stat-box">
        <div class="stat-lbl">PEAK WPM SPEED</div>
        <div class="stat-val" style="color:var(--warn);">${st.bestWPM || 0} WPM</div>
      </div>
      <div class="stat-box">
        <div class="stat-lbl">LIFETIME ACCURACY</div>
        <div class="stat-val">${acc}%</div>
      </div>
      <div class="stat-box">
        <div class="stat-lbl">EMP BLASTS FIRED</div>
        <div class="stat-val">${st.empTriggered || 0}</div>
      </div>
      <div class="stat-box stat-box-full">
        <div class="stat-lbl">TOTAL TIME DEFENDING CORE</div>
        <div class="stat-val">${formattedTime}</div>
      </div>
    `;

    if (DOM.careerKeyboardHeatmap) {
      renderKeyboardHeatmap(DOM.careerKeyboardHeatmap, profile.lifetimeKeyStats || {});
    }
  }

  function openStatsModal() {
    renderCareerStats();
    if (DOM.statsModal) DOM.statsModal.classList.add('show');
  }

  function closeStatsModal() {
    if (DOM.statsModal) DOM.statsModal.classList.remove('show');
  }

  // -------------------------------------------------------------------
  // 1G. KEYSTROKE ANALYTICS & KEYBOARD HEATMAP ENGINE
  // -------------------------------------------------------------------

  const KEYBOARD_LAYOUT = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '_', '-']
  ];

  function recordKeyAttempt(char, isHit) {
    if (!char) return;
    const upper = char.toUpperCase();
    if (!/^[A-Z_\-]$/.test(upper)) return;

    if (!state.keyStats[upper]) {
      state.keyStats[upper] = { hits: 0, misses: 0 };
    }
    if (isHit) {
      state.keyStats[upper].hits++;
    } else {
      state.keyStats[upper].misses++;
    }
  }

  function recordWordMiss(word) {
    if (!word) return;
    for (let i = 0; i < word.length; i++) {
      recordKeyAttempt(word[i], false);
    }
  }

  function renderKeyboardHeatmap(containerEl, statsSource) {
    if (!containerEl) return;
    const stats = statsSource || {};
    let html = '';

    KEYBOARD_LAYOUT.forEach(row => {
      html += '<div class="heatmap-row">';
      row.forEach(key => {
        const kData = stats[key] || { hits: 0, misses: 0 };
        const total = (kData.hits || 0) + (kData.misses || 0);
        let statusClass = 'unused';
        let tooltip = `${key}: UNUSED (0 attempts)`;

        if (total > 0) {
          const acc = Math.round(((kData.hits || 0) / total) * 100);
          if (acc >= 95) {
            statusClass = 'perfect';
          } else if (acc >= 85) {
            statusClass = 'good';
          } else if (acc >= 70) {
            statusClass = 'warning';
          } else {
            statusClass = 'critical';
          }
          tooltip = `${key}: ${acc}% Acc (${kData.hits || 0} hits / ${kData.misses || 0} miss)`;
        }

        html += `<div class="key-cap ${statusClass}" data-key="${key}" data-tooltip="${tooltip}">${key}</div>`;
      });
      html += '</div>';
    });

    containerEl.innerHTML = html;
  }

  function analyzeWeakestKeys(statsSource) {
    const stats = statsSource || {};
    const keysWithData = [];

    Object.keys(stats).forEach(k => {
      const d = stats[k];
      const total = (d.hits || 0) + (d.misses || 0);
      if (total >= 2) {
        const acc = Math.round((d.hits / total) * 100);
        keysWithData.push({ key: k, acc: acc, misses: d.misses, total: total });
      }
    });

    // Sort by lowest accuracy first, then most misses
    keysWithData.sort((a, b) => a.acc - b.acc || b.misses - a.misses);
    return keysWithData.filter(k => k.acc < 90).slice(0, 5);
  }

  function startTargetedDrill(weakKeys) {
    if (!weakKeys || weakKeys.length === 0) return;
    const targetChars = weakKeys.map(k => (typeof k === 'string' ? k : k.key).toUpperCase());

    const pack = CONFIG.WORD_PACKS[state.wordPack] || CONFIG.WORD_PACKS['jsts'];
    const fullPool = pack.words || [...(pack.easy || []), ...(pack.normal || []), ...(pack.hard || [])];

    const matchingWords = fullPool.filter(w => {
      const u = w.toUpperCase();
      return targetChars.some(c => u.includes(c));
    });

    const drillWords = matchingWords.length >= 8 ? matchingWords : fullPool;

    DOM.endScreen.classList.remove('show');
    state.mode = 'zen';
    state.pool = {
      label: `DRILL [${targetChars.join(', ')}]`,
      words: drillWords,
      spawnRate: 2200,
      baseSpeed: 55,
      criticalChance: 0.1,
      maxSimultaneous: 3
    };

    toast(`🎯 TARGETED DRILL INITIALIZED FOR [${targetChars.join(' ')}]`, 'core');
    startGame('zen');
  }

  // -------------------------------------------------------------------
  // 1B. DYNAMIC THEME ENGINE
  // -------------------------------------------------------------------

  function setTheme(themeKey) {
    if (!CONFIG.THEMES[themeKey]) themeKey = 'cyberpunk';
    state.theme = themeKey;
    document.body.dataset.theme = themeKey;

    try {
      localStorage.setItem(CONFIG.STORAGE_KEYS.THEME, themeKey);
    } catch (e) {}

    DOM.themeButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === themeKey);
    });

    const themeColors = {
      cyberpunk: ['#7ee6c4', '#6de8ff', '#c9a6ff', '#ffc857', '#8fb2ff', '#35ffa0'],
      matrix: ['#00ff66', '#33ff88', '#77ffaa', '#00cc55', '#bbff00'],
      amber: ['#ffb000', '#ffd066', '#ff9900', '#ffe088', '#ff7700'],
      blood: ['#ff2a4b', '#ff6b81', '#ff4466', '#ff99aa', '#cc0022']
    };

    if (CodeRain && CodeRain.setThemeColors) {
      CodeRain.setThemeColors(themeColors[themeKey] || themeColors.cyberpunk);
    }
  }

  function loadTheme() {
    let savedTheme = 'cyberpunk';
    try {
      savedTheme = localStorage.getItem(CONFIG.STORAGE_KEYS.THEME) || 'cyberpunk';
    } catch (e) {}
    setTheme(savedTheme);
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
    if (DOM.bootControls) DOM.bootControls.classList.remove('show');

    updateHighScoreUI();

    let i = 0;
    function next() {
      if (i >= bootScript.length) {
        setTimeout(() => {
          DOM.titleBlock.classList.add('show');
          setTimeout(() => {
            DOM.modeSelect.classList.add('show');
            if (DOM.bootControls) DOM.bootControls.classList.add('show');
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

      DOM.bootLines.scrollTop = DOM.bootLines.scrollHeight;
      SoundFX.playBoot();

      i++;
      setTimeout(next, 420);
    }
    next();
  }

  function selectMode(modeKey) {
    if (!CONFIG.MODES[modeKey]) return;
    DOM.input.value = '';
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
    state.lives = mode === 'zen' ? 999 : 3;
    state.score = 0;
    state.combo = 0;
    state.bestCombo = 0;
    state.purged = 0;
    state.missedTypes = 0;
    state.totalEnters = 0;
    state.wave = 1;
    state.empCharge = 0;
    state.freezeUntil = 0;
    state.startTime = performance.now();
    state.running = true;
    state.words = [];
    state.recentWords = [];
    state.purgedChars = 0;
    state.totalKeyHits = 0;
    state.correctKeyHits = 0;
    state.keyStats = {};
    state.weakestKeys = [];
    state.currentWPM = 0;
    state.currentAccuracy = 100;
    state.empCount = 0;
    state.damageCount = 0;
    state.activeBoss = null;
    state.defeatedBosses = [];

    if (!state.pool) {
      state.pool = CONFIG.MODES[mode] || CONFIG.MODES.easy;
    }

    DOM.boot.style.display = 'none';
    DOM.hud.classList.add('show');
    DOM.terminal.classList.add('show');
    DOM.pauseScreen.classList.remove('show');
    DOM.endScreen.classList.remove('show');
    if (DOM.bossHudWrap) DOM.bossHudWrap.style.display = 'none';

    if (mode === 'survival') {
      state.timeRemaining = (CONFIG.MODES.survival && CONFIG.MODES.survival.initialTime) || 60;
      state.totalTimeSurvived = 0;
      state.lastLowTimeBeep = 0;
      if (DOM.timerHudBlock) DOM.timerHudBlock.style.display = 'flex';
      if (DOM.integrityHudBlock) DOM.integrityHudBlock.style.display = 'none';
      if (DOM.timerVal) {
        DOM.timerVal.textContent = state.timeRemaining.toFixed(1) + 's';
        DOM.timerVal.classList.remove('critical');
      }
      toast('⏱️ TIME ATTACK INITIALIZED — 60S CLOCK RUNNING!', 'warn');
    } else {
      if (DOM.timerHudBlock) DOM.timerHudBlock.style.display = 'none';
      if (DOM.integrityHudBlock) DOM.integrityHudBlock.style.display = 'flex';
      if (mode === 'normal') toast('MULTIPLE CODE FRAGMENTS DETECTED', 'core');
      if (mode === 'hard') toast('MULTIPLE THREATS DETECTED', 'danger');
      if (mode === 'zen') toast('ZEN PRACTICE MODE INITIALIZED', 'core');
    }

    if (DOM.field) {
      DOM.field.innerHTML = '';
      DOM.field.dataset.mode = mode; // Set level-specific background atmosphere
    }
    DOM.input.value = '';
    DOM.waveLabel.textContent = (state.pool && state.pool.label) || CONFIG.MODES[mode].label;

    updateFieldDimensions();
    updateHUD();
    DOM.input.focus();

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
  // 4. SPAWN ENGINE & POWER-UPS
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

  function getMaxActiveWords() {
    const baseCaps = { easy: 2, normal: 3, hard: 4, survival: 4, zen: 3 };
    const maxCaps = { easy: 5, normal: 6, hard: 7, survival: 6, zen: 6 };
    const base = baseCaps[state.mode] || 3;
    const maxLimit = maxCaps[state.mode] || 6;
    const waveBonus = Math.floor((state.wave - 1) * 0.75);
    return Math.min(maxLimit, base + waveBonus);
  }

  function scheduleSpawn(delay) {
    clearTimeout(spawnTimeout);
    spawnTimeout = setTimeout(() => {
      if (!state.running || state.screen !== 'PLAYING') return;

      // Halt regular spawns while Boss fight is active
      if (!state.activeBoss) {
        const maxCap = getMaxActiveWords();
        if (state.words.length < maxCap) {
          spawnWord();
        }
      }

      const [lo, hi] = state.pool.spawn;
      const ramp = Math.max(0.45, 1 - (state.wave - 1) * 0.05);
      scheduleSpawn((lo + Math.random() * (hi - lo)) * ramp);
    }, delay);
  }

  function spawnWord() {
    if (!state.running || state.screen !== 'PLAYING') return;

    // Power-up spawn check (4% total roll chance for rarity)
    const roll = Math.random();
    let powerupType = null;
    if (roll < 0.015) powerupType = 'FREEZE';      // 1.5% chance
    else if (roll < 0.030) powerupType = 'REPAIR'; // 1.5% chance
    else if (roll < 0.040) powerupType = 'BOMB';   // 1.0% chance

    let text = powerupType ? CONFIG.POWERUPS[powerupType].command : pickWord();
    const el = document.createElement('div');
    el.className = 'word';
    if (powerupType) el.classList.add(`powerup-${powerupType.toLowerCase()}`);

    el.textContent = text;

    const tokColor = powerupType ? CONFIG.POWERUPS[powerupType].color : CONFIG.TOKEN_COLORS[Math.floor(Math.random() * CONFIG.TOKEN_COLORS.length)];
    el.style.setProperty('--tok', tokColor);
    DOM.field.appendChild(el);

    const w = el.getBoundingClientRect().width || (text.length * 11 + 24);
    const maxX = Math.max(10, state.fieldW - w - 10);
    const x = 10 + Math.random() * maxX;

    const [slo, shi] = state.pool.speed;
    const speed = (slo + Math.random() * (shi - slo)) * (1 + (state.wave - 1) * 0.04);

    el.style.left = x + 'px';
    el.style.top = '-30px';

    state.words.push({ el, x, y: -30, text, speed, tokColor, critical: false, width: w, powerup: powerupType, isBoss: false });
  }

  // -------------------------------------------------------------------
  // 4B. BOSS BATTLE ENGINE
  // -------------------------------------------------------------------

  function checkBossEncounter() {
    if (state.activeBoss || state.screen !== 'PLAYING' || state.mode === 'zen') return;
    if (!CONFIG.BOSSES) return;
    const bossConfig = CONFIG.BOSSES.find(b => b.wave === state.wave);
    if (bossConfig && !state.defeatedBosses.includes(bossConfig.id)) {
      spawnBoss(bossConfig);
    }
  }

  function spawnBoss(bossConfig) {
    state.activeBoss = {
      id: bossConfig.id,
      name: bossConfig.name,
      subtitle: bossConfig.subtitle,
      icon: bossConfig.icon,
      color: bossConfig.color || '#ff4d6d',
      phases: bossConfig.phases,
      phaseIndex: 0,
      totalPhases: bossConfig.phases.length,
      currentWord: bossConfig.phases[0].text,
      wordObj: null
    };

    SoundFX.playBossAlert();
    toast(`⚠️ WARNING: MEGA THREAT APPROACHING: ${bossConfig.name} ⚠️`, 'danger');

    // Show Boss HUD overlay
    if (DOM.bossHudWrap) {
      DOM.bossHudWrap.style.display = 'block';
      if (DOM.bossIcon) DOM.bossIcon.textContent = bossConfig.icon;
      if (DOM.bossName) DOM.bossName.textContent = bossConfig.name;
      updateBossHUD();
    }

    // Spawn Boss entity on playfield
    const el = document.createElement('div');
    el.className = 'word boss-entity';
    el.innerHTML = `<span class="boss-subtag">${bossConfig.name} [PHASE 1/${bossConfig.phases.length}]</span><span class="boss-text">${bossConfig.phases[0].text}</span>`;
    el.style.setProperty('--tok', bossConfig.color || '#ff4d6d');
    DOM.field.appendChild(el);

    const w = el.getBoundingClientRect().width || 240;
    const cx = Math.max(20, (state.fieldW - w) / 2);
    el.style.left = cx + 'px';
    el.style.top = '10px';

    const bossWordObj = {
      el,
      x: cx,
      y: 10,
      text: bossConfig.phases[0].text,
      speed: 18, // Slow, imposing descent
      tokColor: bossConfig.color || '#ff4d6d',
      critical: false,
      width: w,
      isBoss: true
    };

    state.activeBoss.wordObj = bossWordObj;
    state.words.push(bossWordObj);
  }

  function updateBossHUD() {
    if (!state.activeBoss || !DOM.bossHudWrap) return;
    const { phaseIndex, totalPhases, phases } = state.activeBoss;
    const currentPhase = phases[phaseIndex];
    const pct = Math.max(0, Math.round(((totalPhases - phaseIndex) / totalPhases) * 100));

    if (DOM.bossPhase) {
      DOM.bossPhase.textContent = `PHASE ${phaseIndex + 1}/${totalPhases}: ${currentPhase ? currentPhase.name : 'VULNERABILITY'}`;
    }
    if (DOM.bossHpPercent) {
      DOM.bossHpPercent.textContent = `${pct}%`;
    }
    if (DOM.bossHpFill) {
      DOM.bossHpFill.style.width = `${pct}%`;
    }
  }

  function damageBoss() {
    if (!state.activeBoss) return;
    const boss = state.activeBoss;
    boss.phaseIndex++;

    SoundFX.playBossDamage();
    updateBossHUD();

    if (boss.phaseIndex < boss.totalPhases) {
      const nextPhase = boss.phases[boss.phaseIndex];
      boss.currentWord = nextPhase.text;
      if (boss.wordObj) {
        boss.wordObj.text = nextPhase.text;
        boss.wordObj.el.innerHTML = `<span class="boss-subtag">${boss.name} [PHASE ${boss.phaseIndex + 1}/${boss.totalPhases}]</span><span class="boss-text">${nextPhase.text}</span>`;
      }
      toast(`BOSS SHIELD CRACKED! VULNERABILITY EXPOSED: ${nextPhase.text}`, 'warn');
    } else {
      defeatBoss();
    }
  }

  function defeatBoss() {
    if (!state.activeBoss) return;
    const boss = state.activeBoss;
    state.defeatedBosses.push(boss.id);

    SoundFX.playBossDefeated();

    if (boss.wordObj && boss.wordObj.el) {
      const rect = boss.wordObj.el.getBoundingClientRect();
      const fieldRect = DOM.field.getBoundingClientRect();
      const cx = rect.left - fieldRect.left + rect.width / 2;
      const cy = rect.top - fieldRect.top + rect.height / 2;
      spawnPurgeBurst(boss.wordObj, cx, cy, '#ffc857');
      if (CodeRain && CodeRain.spawnBurst) {
        CodeRain.spawnBurst(cx, cy, '#ff4d6d', 45);
      }
      if (boss.wordObj.el.parentNode) boss.wordObj.el.remove();
      const idx = state.words.indexOf(boss.wordObj);
      if (idx >= 0) state.words.splice(idx, 1);
    }

    state.score += 500;
    state.empCharge = CONFIG.EMP_MAX_CHARGE;
    if (state.mode !== 'zen' && state.mode !== 'survival') {
      state.lives = Math.min(3, state.lives + 1);
    }

    toast(`🏆 MEGA THREAT DEFEATED: ${boss.name}! +500 PTS & FULL EMP!`, 'emp');
    unlockAchievement('BOSS_SLAYER');

    if (DOM.bossHudWrap) DOM.bossHudWrap.style.display = 'none';
    state.activeBoss = null;
    updateHUD();
  }

  // -------------------------------------------------------------------
  // 5. GAME LOOP
  // -------------------------------------------------------------------

  function loop(ts) {
    if (!state.running || state.screen !== 'PLAYING') return;

    const dt = Math.min(0.05, (ts - lastTs) / 1000);
    lastTs = ts;

    // Real-Time Analytics WPM & Accuracy calculation
    const elapsedMin = (performance.now() - state.startTime) / 60000;
    if (elapsedMin > 0.05) {
      state.currentWPM = Math.round((state.purgedChars / 5) / elapsedMin);
    }
    state.currentAccuracy = state.totalKeyHits > 0
      ? Math.round((state.correctKeyHits / state.totalKeyHits) * 100)
      : 100;

    // Survival Countdown Handling
    if (state.mode === 'survival') {
      state.timeRemaining -= dt;
      state.totalTimeSurvived += dt;
      if (DOM.timerVal) {
        DOM.timerVal.textContent = Math.max(0, state.timeRemaining).toFixed(1) + 's';
        if (state.timeRemaining <= 10.0) {
          DOM.timerVal.classList.add('critical');
          if (performance.now() - state.lastLowTimeBeep > 950) {
            state.lastLowTimeBeep = performance.now();
            SoundFX.playLowTimeWarning();
          }
        } else {
          DOM.timerVal.classList.remove('critical');
        }
      }

      if (state.timeRemaining <= 0) {
        endGame(false, 'TIMEOUT');
        return;
      }
    }

    checkBossEncounter();
    checkAchievements();
    updateHUD();

    const isFrozen = performance.now() < state.freezeUntil;
    const criticalY = state.fieldH - 70;

    for (let i = state.words.length - 1; i >= 0; i--) {
      const w = state.words[i];
      if (!isFrozen) {
        w.y += w.speed * dt;
        w.el.style.top = w.y + 'px';
      }

      if (w.y > criticalY && !w.critical && !w.isBoss) {
        w.critical = true;
        w.el.classList.add('critical');
        toast('CRITICAL THREAT — CORE BREACH IMMINENT', 'danger');
      }

      if (w.y >= state.fieldH - 24) {
        if (state.mode !== 'zen') {
          loseLife(w);
        } else if (w.el && w.el.parentNode) {
          w.el.remove();
        }
        if (!w.isBoss) {
          state.words.splice(i, 1);
        }
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

  function flashTimer(type) {
    if (!DOM.timerVal) return;
    DOM.timerVal.classList.remove('bonus', 'penalty');
    void DOM.timerVal.offsetWidth;
    DOM.timerVal.classList.add(type);
    setTimeout(() => {
      if (DOM.timerVal) DOM.timerVal.classList.remove(type);
    }, 400);
  }

  function loseLife(w) {
    if (w.isBoss) {
      w.y = 20;
      if (w.el) w.el.style.top = '20px';
    } else {
      if (w.el && w.el.parentNode) w.el.parentNode.removeChild(w.el);
    }
    state.lives--;
    state.combo = 0;
    SoundFX.playDamage();

    // Time Attack Penalty for dropped / breached word (-1s)
    if (state.mode === 'survival') {
      const penalty = (CONFIG.MODES.survival && CONFIG.MODES.survival.missPenaltyTime) || 1.0;
      state.timeRemaining = Math.max(0, state.timeRemaining - penalty);
      flashTimer('penalty');
      toast(`-${penalty.toFixed(1)}S TIME PENALTY (MISSED WORD)!`, 'danger');
      if (state.timeRemaining <= 0) {
        endGame(false, 'TIMEOUT');
        return;
      }
    }

    updateHUD();
    toast('CORE DAMAGE DETECTED', 'danger');
    if (state.lives <= 0 && state.mode !== 'zen' && state.mode !== 'survival') {
      endGame(false, 'BREACH');
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
  // 7. INPUT & TARGETING (AUTO-PURGE & POWER-UPS)
  // -------------------------------------------------------------------

  DOM.input.addEventListener('input', () => {
    if (!state.running || state.screen !== 'PLAYING') return;
    const typed = DOM.input.value.toUpperCase();
    DOM.input.value = typed;

    if (!typed) {
      for (const w of state.words) {
        w.el.classList.remove('targeted');
        w.el.textContent = w.text;
      }
      return;
    }

    // Keystroke Analytics Tracking
    const lastChar = typed[typed.length - 1];
    const isMatchingPrefix = state.words.some(w => w.text.startsWith(typed));
    state.totalKeyHits++;
    if (isMatchingPrefix) {
      state.correctKeyHits++;
      recordKeyAttempt(lastChar, true);
    } else {
      recordKeyAttempt(lastChar, false);
    }

    // Trigger EMP if typed
    if (typed === CONFIG.EMP_COMMAND && state.empCharge >= CONFIG.EMP_MAX_CHARGE) {
      if (triggerEMP()) return;
    }

    // Instant word demolish on exact match (pick word lowest on screen if duplicates)
    let matchedIdx = -1;
    let maxY = -Infinity;
    for (let i = 0; i < state.words.length; i++) {
      if (state.words[i].text === typed) {
        if (state.words[i].y > maxY) {
          maxY = state.words[i].y;
          matchedIdx = i;
        }
      }
    }

    if (matchedIdx >= 0) {
      const targetWord = state.words[matchedIdx];
      state.totalEnters++;
      fireLaser(targetWord);

      // Handle power-up effects if array was not reset by BOMB
      if (state.words.includes(targetWord)) {
        const idx = state.words.indexOf(targetWord);
        if (idx >= 0) state.words.splice(idx, 1);
      }

      DOM.input.value = '';

      for (const w of state.words) {
        w.el.classList.remove('targeted');
        w.el.textContent = w.text;
      }
      return;
    }

    // Dynamic prefix highlighting
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
      e.preventDefault();
      if (!state.running || state.screen !== 'PLAYING') {
        DOM.input.value = '';
        return;
      }
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

    // Clear dynamic prefix highlights on all words
    for (const w of state.words) {
      if (w.el) {
        w.el.classList.remove('targeted');
        w.el.textContent = w.text;
      }
    }

    if (!typed) return;

    if (typed === CONFIG.EMP_COMMAND) {
      if (triggerEMP()) return;
    }

    state.totalEnters++;
    const idx = state.words.findIndex(w => w.text === typed);
    if (idx >= 0) {
      const targetWord = state.words[idx];
      fireLaser(targetWord);
      if (state.words.includes(targetWord)) {
        const i = state.words.indexOf(targetWord);
        if (i >= 0) state.words.splice(i, 1);
      }
    } else {
      state.missedTypes++;
      recordWordMiss(typed);
      SoundFX.playError();
      DOM.input.classList.remove('miss');
      void DOM.input.offsetWidth;
      DOM.input.classList.add('miss');

      // Time Attack Penalty for mistyped submission (-1s)
      if (state.mode === 'survival') {
        const penalty = (CONFIG.MODES.survival && CONFIG.MODES.survival.missPenaltyTime) || 1.0;
        state.timeRemaining = Math.max(0, state.timeRemaining - penalty);
        flashTimer('penalty');
        toast(`-${penalty.toFixed(1)}S TIME PENALTY (MISTYPE)!`, 'danger');
        if (state.timeRemaining <= 0) {
          endGame(false, 'TIMEOUT');
          return;
        }
      }
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

    if (w.isBoss) {
      damageBoss();
    } else {
      spawnPurgeBurst(w, cx, cy, color);
      if (w.el && w.el.parentNode) w.el.parentNode.removeChild(w.el);

      // Power-up Triggers
      if (w.powerup === 'FREEZE') {
        state.freezeUntil = performance.now() + 5000;
        SoundFX.playFreeze();
        toast('❄️ TIME FREEZE ACTIVATED (5S)!', 'emp');
      } else if (w.powerup === 'REPAIR') {
        if (state.mode !== 'zen' && state.mode !== 'survival') {
          state.lives = Math.min(3, state.lives + 1);
        }
        SoundFX.playRepair();
        toast('💚 CORE INTEGRITY RESTORED!', 'core');
      } else if (w.powerup === 'BOMB') {
        SoundFX.playBomb();
        toast('💣 FULL SCREEN NUKE ACTIVATED!', 'warn');
        // Full screen wipe of all active falling words
        const wordsToWipe = [...state.words];
        wordsToWipe.forEach(target => {
          if (target !== w && !target.isBoss) {
            spawnPurgeBurst(target);
            if (target.el && target.el.parentNode) target.el.remove();
            state.purged++;
            state.purgedChars += target.text.length;
            state.score += 15;
          }
        });
        state.words = state.words.filter(target => target.isBoss);
      } else {
        SoundFX.playLaser();
        SoundFX.playPurge();
      }
    }

    // Time Attack Survival Bonus (+2s base)
    if (state.mode === 'survival') {
      const bonus = (CONFIG.MODES.survival.killBonusTime || 2.0) + (state.combo > 0 && state.combo % 5 === 0 ? (CONFIG.MODES.survival.comboBonusTime || 0.5) : 0);
      state.timeRemaining += bonus;
      flashTimer('bonus');
      SoundFX.playTimeBonus();
      toast(`+${bonus.toFixed(1)}S TIME BONUS!`, 'core');
    }

    state.score += 10 + w.text.length * 2 + state.combo * 3;
    state.purged++;
    state.purgedChars += w.text.length;
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

    if (CodeRain && CodeRain.spawnBurst) {
      CodeRain.spawnBurst(cx, cy + 70, color || '#6de8ff', 18);
    }
  }

  function updateHUD() {
    DOM.scoreVal.textContent = state.score.toLocaleString();
    DOM.comboVal.textContent = state.combo > 1 ? ('COMBO x' + state.combo) : '';
    if (DOM.wpmVal) DOM.wpmVal.textContent = state.currentWPM;
    if (DOM.accuracyVal) DOM.accuracyVal.textContent = `${state.currentAccuracy}%`;

    if (state.mode === 'zen') {
      DOM.integrity.innerHTML = '♥ ∞';
    } else {
      let hearts = '';
      for (let i = 0; i < 3; i++) {
        hearts += '<span class="heart' + (i < state.lives ? '' : ' lost') + '">♥</span> ';
      }
      DOM.integrity.innerHTML = hearts.trim();
    }

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

  function endGame(win, reason) {
    state.running = false;
    cancelAnimationFrame(rafId);
    clearTimeout(spawnTimeout);
    DOM.terminal.classList.remove('show');
    if (DOM.bossHudWrap) DOM.bossHudWrap.style.display = 'none';

    const elapsedSec = state.mode === 'survival'
      ? Math.round(state.totalTimeSurvived)
      : Math.max(1, Math.round((performance.now() - state.startTime) / 1000));

    let grade = 'C';
    if (state.currentWPM >= 60) grade = 'S';
    else if (state.currentWPM >= 45) grade = 'A';
    else if (state.currentWPM >= 30) grade = 'B';

    if (state.mode === 'survival' && state.totalTimeSurvived >= 90) {
      unlockAchievement('SURVIVOR');
    }

    // Update Lifetime Career Stats & Keystrokes for Active Profile
    const currentProfile = state.playerProfiles[state.activePlayer];
    if (currentProfile) {
      if (!currentProfile.stats) {
        currentProfile.stats = { gamesPlayed: 0, gamesWon: 0, totalPurged: 0, bestWPM: 0, totalKeyHits: 0, correctKeyHits: 0, empTriggered: 0, playTimeSec: 0 };
      }
      const st = currentProfile.stats;
      st.gamesPlayed = (st.gamesPlayed || 0) + 1;
      if (win) st.gamesWon = (st.gamesWon || 0) + 1;
      st.totalPurged = (st.totalPurged || 0) + state.purged;
      st.bestWPM = Math.max(st.bestWPM || 0, state.currentWPM);
      st.totalKeyHits = (st.totalKeyHits || 0) + state.totalKeyHits;
      st.correctKeyHits = (st.correctKeyHits || 0) + state.correctKeyHits;
      st.empTriggered = (st.empTriggered || 0) + state.empCount;
      st.playTimeSec = (st.playTimeSec || 0) + elapsedSec;

      if (!currentProfile.lifetimeKeyStats) {
        currentProfile.lifetimeKeyStats = {};
      }
      Object.keys(state.keyStats).forEach(k => {
        if (!currentProfile.lifetimeKeyStats[k]) {
          currentProfile.lifetimeKeyStats[k] = { hits: 0, misses: 0 };
        }
        currentProfile.lifetimeKeyStats[k].hits += state.keyStats[k].hits || 0;
        currentProfile.lifetimeKeyStats[k].misses += state.keyStats[k].misses || 0;
      });

      try {
        localStorage.setItem(CONFIG.STORAGE_KEYS.PLAYER_PROFILES, JSON.stringify(state.playerProfiles));
      } catch (e) {}
    }

    const scoreToSave = state.mode === 'survival' ? Math.round(state.totalTimeSurvived * 10) / 10 : state.score;
    const isNewHighScore = saveHighScore(state.mode, scoreToSave);
    if (isNewHighScore) {
      if (DOM.goHsBanner) DOM.goHsBanner.style.display = 'block';
      SoundFX.playHighScore();
    } else {
      if (DOM.goHsBanner) DOM.goHsBanner.style.display = 'none';
    }

    let titleText = win ? 'SYSTEM RESTORED' : (reason === 'TIMEOUT' ? 'TIME EXPIRED' : 'CORE BREACHED');
    DOM.endTitle.textContent = titleText;
    DOM.endTitle.className = win ? '' : 'fail';

    DOM.endStats.innerHTML = `
      <div>OPERATOR<b>${state.activeAvatar} ${state.activePlayer}</b></div>
      <div>FINAL SCORE<b>${state.score.toLocaleString()}</b></div>
      <div>SPEED WPM<b>${state.currentWPM} WPM (GRADE ${grade})</b></div>
      <div>ACCURACY<b>${state.currentAccuracy}%</b></div>
      <div>TARGETS PURGED<b>${state.purged}</b></div>
      <div>BEST COMBO<b>x${state.bestCombo}</b></div>
      <div>DEPTH REACHED<b>${state.wave}</b></div>
      <div>TIME SURVIVED<b>${state.mode === 'survival' ? state.totalTimeSurvived.toFixed(1) + 's' : elapsedSec + 's'}</b></div>
    `;

    // Render Game Over Keyboard Heatmap & Diagnostics
    if (DOM.endKeyboardHeatmap) {
      renderKeyboardHeatmap(DOM.endKeyboardHeatmap, state.keyStats);
    }

    state.weakestKeys = analyzeWeakestKeys(state.keyStats);
    if (DOM.endWeakKeysBanner) {
      if (state.weakestKeys.length > 0) {
        const keyBadges = state.weakestKeys.map(k => `<span class="weak-key-badge" style="display:inline-block;padding:2px 6px;margin:2px 3px;background:rgba(255,77,109,0.3);border:1px solid #ff4d6d;border-radius:4px;color:#ff4d6d;font-weight:800;">${k.key} (${k.acc}%)</span>`).join(' ');
        DOM.endWeakKeysBanner.innerHTML = `⚠️ <b>PROBLEM KEYS DETECTED:</b> ${keyBadges}`;
        DOM.endWeakKeysBanner.style.display = 'block';
        if (DOM.btnHeatmapDrill) DOM.btnHeatmapDrill.style.display = 'inline-block';
      } else {
        DOM.endWeakKeysBanner.innerHTML = `✨ <b>FLAWLESS TYPING:</b> Zero critical key bottlenecks detected!`;
        DOM.endWeakKeysBanner.style.display = 'block';
        if (DOM.btnHeatmapDrill) DOM.btnHeatmapDrill.style.display = 'none';
      }
    }

    setTimeout(() => {
      DOM.endScreen.classList.add('show');
      state.screen = 'GAME_OVER';
    }, win ? 200 : 800);

    if (!win) toast(reason === 'TIMEOUT' ? 'TIME HAS RUN OUT!' : 'THE CORE HAS FALLEN.', 'danger');
  }

  // -------------------------------------------------------------------
  // 9. EVENT LISTENERS
  // -------------------------------------------------------------------

  document.addEventListener('keydown', (e) => {
    if (state.screen === 'BOOT' || state.screen === 'MODE_SELECT') {
      if (e.key === '1') selectMode('easy');
      if (e.key === '2') selectMode('normal');
      if (e.key === '3') selectMode('hard');
      if (e.key === '4') selectMode('survival');
      if (e.key === '5') selectMode('zen');
    } else if (state.screen === 'GAME_OVER' && e.key === 'Enter') {
      runBoot();
    } else if (e.key === 'Escape') {
      if (state.screen === 'PLAYING' || state.screen === 'PAUSED') {
        togglePause();
      }
    } else if (state.screen === 'PLAYING') {
      if (e.key === 'Enter') {
        e.preventDefault();
        DOM.input.focus();
        handleEnterPress();
      } else if (document.activeElement !== DOM.input && e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        DOM.input.focus();
      }
    }
  });

  DOM.retryBtn.addEventListener('click', () => {
    runBoot();
  });

  if (DOM.btnHeatmapDrill) {
    DOM.btnHeatmapDrill.addEventListener('click', () => {
      startTargetedDrill(state.weakestKeys);
    });
  }

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

  if (DOM.btnMute) {
    DOM.btnMute.addEventListener('click', () => {
      const muted = SoundFX.toggleMute();
      DOM.btnMute.textContent = muted ? 'SOUND: OFF' : 'SOUND: ON';
      DOM.btnMute.classList.toggle('muted', muted);
    });
  }

  if (DOM.btnCrt) {
    DOM.btnCrt.addEventListener('click', () => {
      toggleCRT();
    });
  }

  // Theme, Pack, Trophy, Profile & Settings Event Listeners
  if (DOM.themeButtons) {
    DOM.themeButtons.forEach(btn => {
      btn.addEventListener('click', () => setTheme(btn.dataset.theme));
    });
  }

  if (DOM.btnCustomPackModal) {
    DOM.btnCustomPackModal.addEventListener('click', openCustomPackModal);
  }

  if (DOM.btnCloseCustomPackModal) {
    DOM.btnCloseCustomPackModal.addEventListener('click', closeCustomPackModal);
  }

  if (DOM.btnParseCustomCode) {
    DOM.btnParseCustomCode.addEventListener('click', handleParseCustomCode);
  }

  if (DOM.btnSaveCustomPack) {
    DOM.btnSaveCustomPack.addEventListener('click', handleSaveCustomPack);
  }

  if (DOM.btnTrophies) DOM.btnTrophies.addEventListener('click', openTrophyModal);
  if (DOM.btnCloseTrophies) DOM.btnCloseTrophies.addEventListener('click', closeTrophyModal);
  if (DOM.btnStats) DOM.btnStats.addEventListener('click', openStatsModal);
  if (DOM.btnCloseStats) DOM.btnCloseStats.addEventListener('click', closeStatsModal);

  if (DOM.btnSwitchPlayer) {
    DOM.btnSwitchPlayer.addEventListener('click', openPlayerModal);
  }

  if (DOM.btnClosePlayerModal) {
    DOM.btnClosePlayerModal.addEventListener('click', closePlayerModal);
  }

  if (DOM.btnRandomName) {
    DOM.btnRandomName.addEventListener('click', generateRandomName);
  }

  if (DOM.btnCreatePlayer) {
    DOM.btnCreatePlayer.addEventListener('click', () => {
      if (DOM.playerHandleInput) createPlayerProfile(DOM.playerHandleInput.value);
    });
  }

  if (DOM.playerHandleInput) {
    DOM.playerHandleInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') createPlayerProfile(DOM.playerHandleInput.value);
    });
  }

  if (DOM.btnSettings) DOM.btnSettings.addEventListener('click', openSettingsModal);
  if (DOM.btnBootSettings) DOM.btnBootSettings.addEventListener('click', openSettingsModal);
  if (DOM.btnCloseSettings) DOM.btnCloseSettings.addEventListener('click', closeSettingsModal);

  if (DOM.btnToggleSfx) {
    DOM.btnToggleSfx.addEventListener('click', () => {
      SoundFX.toggleMute();
      updateSettingsUI();
    });
  }

  if (DOM.btnToggleMusic) {
    DOM.btnToggleMusic.addEventListener('click', () => {
      SoundFX.toggleMusic();
      updateSettingsUI();
    });
  }

  if (DOM.musicVolumeSlider) {
    DOM.musicVolumeSlider.addEventListener('input', (e) => {
      SoundFX.setMusicVolume(parseFloat(e.target.value));
    });
  }

  if (DOM.btnToggleCrtModal) {
    DOM.btnToggleCrtModal.addEventListener('click', () => {
      toggleCRT();
      updateSettingsUI();
    });
  }

  document.addEventListener('click', (e) => {
    if (state && state.running && !e.target.classList.contains('btn-ctrl')) {
      DOM.input.focus();
    }
  });

  // Initial Load
  window.addEventListener('DOMContentLoaded', () => {
    loadPlayerProfiles();
    loadTheme();
    loadWordPack();
    loadAchievements();
    loadPreferences();
    CodeRain.init('codeRain');
    runBoot();
  });

})();

/**
 * CODE INVADERS — Web Audio Synthesizer
 * Zero external audio files required. Uses Web Audio API oscillator nodes.
 */

const SoundFX = (function () {
  let ctx = null;
  let muted = false;

  function initCtx() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        ctx = new AudioCtx();
      }
    }
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
  }

  // Restore mute setting from localStorage
  try {
    muted = localStorage.getItem('code_invaders_muted') === 'true';
  } catch (e) {}

  function isEnabled() {
    return !muted && ctx !== null;
  }

  let musicMuted = false;
  let musicVolume = 0.35;
  let musicTimer = null;
  let musicStep = 0;

  try {
    musicMuted = localStorage.getItem('code_invaders_music_muted') === 'true';
    const savedVol = localStorage.getItem('code_invaders_music_volume');
    if (savedVol !== null) musicVolume = parseFloat(savedVol);
  } catch (e) {}

  const synthChords = [
    [130.81, 164.81, 196.00],
    [110.00, 130.81, 164.81],
    [146.83, 174.61, 220.00],
    [98.00,  123.47, 146.83]
  ];

  function playSynthChordStep() {
    if (musicMuted || !ctx || muted) return;
    try {
      const now = ctx.currentTime;
      const chord = synthChords[musicStep % synthChords.length];
      musicStep++;

      chord.forEach(freq => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * 2, now);
        gain.gain.setValueAtTime(musicVolume * 0.08, now);
        gain.gain.linearRampToValueAtTime(0, now + 1.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.8);
      });
    } catch (e) {}
  }

  function startAmbientMusic() {
    if (musicTimer) clearInterval(musicTimer);
    musicTimer = setInterval(playSynthChordStep, 1900);
  }

  return {
    init() {
      initCtx();
      startAmbientMusic();
    },

    toggleMute() {
      muted = !muted;
      try {
        localStorage.setItem('code_invaders_muted', muted);
      } catch (e) {}
      return muted;
    },

    isMuted() {
      return muted;
    },

    toggleMusic() {
      musicMuted = !musicMuted;
      try {
        localStorage.setItem('code_invaders_music_muted', musicMuted);
      } catch (e) {}
      return musicMuted;
    },

    isMusicMuted() {
      return musicMuted;
    },

    setMusicVolume(vol) {
      musicVolume = Math.max(0, Math.min(1, vol));
      try {
        localStorage.setItem('code_invaders_music_volume', musicVolume);
      } catch (e) {}
    },

    getMusicVolume() {
      return musicVolume;
    },

    // Satisfying mechanical typing pop SFX
    playKeyPop() {
      initCtx();
      if (!isEnabled()) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(820 + Math.random() * 120, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.04);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.04);
      } catch (e) {}
    },

    // 1. Cyber Laser Beam Sound (Dual pitch resonant sweep)
    playLaser() {
      initCtx();
      if (!isEnabled()) return;
      try {
        const now = ctx.currentTime;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sawtooth';
        osc2.type = 'square';

        osc1.frequency.setValueAtTime(1400, now);
        osc1.frequency.exponentialRampToValueAtTime(180, now + 0.11);

        osc2.frequency.setValueAtTime(960, now);
        osc2.frequency.exponentialRampToValueAtTime(120, now + 0.11);

        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.11);
        osc2.stop(now + 0.11);
      } catch (e) {}
    },

    // 2. Word Demolition Explosion (Punchy sub bass impact + resonant plasma shatter burst)
    playPurge() {
      initCtx();
      if (!isEnabled()) return;
      try {
        const now = ctx.currentTime;
        
        // Layer 1: Sub-bass impact thud
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(260, now);
        subOsc.frequency.exponentialRampToValueAtTime(42, now + 0.18);
        subGain.gain.setValueAtTime(0.38, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        subOsc.connect(subGain);
        subGain.connect(ctx.destination);
        subOsc.start(now);
        subOsc.stop(now + 0.18);

        // Layer 2: Resonant noise crackle / plasma burst
        const bufferSize = ctx.sampleRate * 0.18;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.Q.value = 2.5;
        filter.frequency.setValueAtTime(3200, now);
        filter.frequency.exponentialRampToValueAtTime(250, now + 0.18);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.32, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.005, now + 0.18);

        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(ctx.destination);

        noise.start(now);
        noise.stop(now + 0.18);
      } catch (e) {}
    },

    // Freeze Powerup SFX
    playFreeze() {
      initCtx();
      if (!isEnabled()) return;
      try {
        const now = ctx.currentTime;
        [880, 1174.66, 1760, 2349.32].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          const t = now + idx * 0.04;
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.2, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.2);
        });
      } catch (e) {}
    },

    // Repair Life SFX
    playRepair() {
      initCtx();
      if (!isEnabled()) return;
      try {
        const now = ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          const t = now + idx * 0.05;
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.2, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.25);
        });
      } catch (e) {}
    },

    // Nuke Bomb Blast SFX (Full screen wipe)
    playBomb() {
      initCtx();
      if (!isEnabled()) return;
      try {
        const now = ctx.currentTime;
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.type = 'sawtooth';
        subOsc.frequency.setValueAtTime(200, now);
        subOsc.frequency.exponentialRampToValueAtTime(22, now + 0.55);
        subGain.gain.setValueAtTime(0.48, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
        subOsc.connect(subGain);
        subGain.connect(ctx.destination);
        subOsc.start(now);
        subOsc.stop(now + 0.55);
      } catch (e) {}
    },

    // 3. Typo / Missed Match Error (Dissonant buzz)
    playError() {
      initCtx();
      if (!isEnabled()) return;
      try {
        const now = ctx.currentTime;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sawtooth';
        osc2.type = 'sawtooth';
        osc1.frequency.setValueAtTime(150, now);
        osc2.frequency.setValueAtTime(157, now); // Dissonant beating interval

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.18);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.18);
        osc2.stop(now + 0.18);
      } catch (e) {}
    },

    // 4. Combo Milestone Chime (Ascending notes)
    playCombo(multiplier = 3) {
      initCtx();
      if (!isEnabled()) return;
      try {
        const now = ctx.currentTime;
        const baseFreq = 440; // A4
        const notes = [0, 4, 7, 12]; // Major arpeggio
        
        notes.forEach((semitone, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          const freq = baseFreq * Math.pow(2, semitone / 12);
          const noteTime = now + idx * 0.05;

          osc.frequency.setValueAtTime(freq, noteTime);

          gain.gain.setValueAtTime(0.2, noteTime);
          gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.12);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(noteTime);
          osc.stop(noteTime + 0.12);
        });
      } catch (e) {}
    },

    // 5. Core Damage / Life Loss (Alarm burst)
    playDamage() {
      initCtx();
      if (!isEnabled()) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(80, now + 0.35);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.35);
      } catch (e) {}
    },

    // 6. Terminal Boot Tick (Short click)
    playBoot() {
      initCtx();
      if (!isEnabled()) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200, now);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.03);
      } catch (e) {}
    },

    // 7. Wave Level Up Synth
    playWaveUp() {
      initCtx();
      if (!isEnabled()) return;
      try {
        const now = ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          const t = now + i * 0.06;
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.18, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.15);
        });
      } catch (e) {}
    },

    // 8. EMP Nuke Blast (Powerful noise + low sub frequency impact)
    playEMP() {
      initCtx();
      if (!isEnabled()) return;
      try {
        const now = ctx.currentTime;
        // Sub bass drop
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(220, now);
        subOsc.frequency.exponentialRampToValueAtTime(30, now + 0.45);
        subGain.gain.setValueAtTime(0.4, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        subOsc.connect(subGain);
        subGain.connect(ctx.destination);
        subOsc.start(now);
        subOsc.stop(now + 0.45);

        // Sweeping noise
        const bufferSize = ctx.sampleRate * 0.4;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(3000, now);
        filter.frequency.exponentialRampToValueAtTime(200, now + 0.4);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(now);
        noise.stop(now + 0.4);
      } catch (e) {}
    },

    // 9. Pause Beep
    playPause() {
      initCtx();
      if (!isEnabled()) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } catch (e) {}
    },

    // 10. High Score Celebration Fanfare
    playHighScore() {
      initCtx();
      if (!isEnabled()) return;
      try {
        const now = ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 987.77, 1046.50];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          const t = now + idx * 0.08;
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.2, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t);
          osc.stop(t + 0.25);
        });
      } catch (e) {}
    },

    // 11. Boss Alert Siren (Ominous low-pitch dual oscillator sweep)
    playBossAlert() {
      initCtx();
      if (!isEnabled()) return;
      try {
        const now = ctx.currentTime;
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sawtooth';
        osc2.type = 'sine';

        osc1.frequency.setValueAtTime(110, now);
        osc1.frequency.linearRampToValueAtTime(75, now + 0.5);
        osc1.frequency.linearRampToValueAtTime(110, now + 1.0);

        osc2.frequency.setValueAtTime(113, now);
        osc2.frequency.linearRampToValueAtTime(78, now + 0.5);
        osc2.frequency.linearRampToValueAtTime(113, now + 1.0);

        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 1.2);
        osc2.stop(now + 1.2);
      } catch (e) {}
    },

    // 12. Boss Damage Impact (Heavy metallic hit)
    playBossDamage() {
      initCtx();
      if (!isEnabled()) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.18);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.22);
      } catch (e) {}
    },

    // 13. Boss Defeated Victory Chord
    playBossDefeated() {
      initCtx();
      if (!isEnabled()) return;
      try {
        const now = ctx.currentTime;
        const chords = [
          [261.63, 329.63, 392.00, 523.25], // C Major
          [349.23, 440.00, 523.25, 698.46], // F Major
          [392.00, 493.88, 587.33, 783.99], // G Major
          [523.25, 659.25, 783.99, 1046.50] // C High Octave
        ];

        chords.forEach((chord, chordIdx) => {
          const t = now + chordIdx * 0.15;
          chord.forEach(freq => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, t);
            gain.gain.setValueAtTime(0.2, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(t);
            osc.stop(t + 0.45);
          });
        });
      } catch (e) {}
    },

    // 14. Time Bonus Chime (+Seconds added)
    playTimeBonus() {
      initCtx();
      if (!isEnabled()) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1760, now + 0.12);

        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.15);
      } catch (e) {}
    },

    // 15. Low Time Warning Beep
    playLowTimeWarning() {
      initCtx();
      if (!isEnabled()) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(950, now);
        osc.frequency.setValueAtTime(750, now + 0.05);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.1);
      } catch (e) {}
    }
  };
})();

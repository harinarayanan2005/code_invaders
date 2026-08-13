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

  return {
    init() {
      initCtx();
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

    // 1. Laser Beam sound (High frequency downward sweep)
    playLaser() {
      initCtx();
      if (!isEnabled()) return;
      try {
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.12);
      } catch (e) {}
    },

    // 2. Token Purge Explosion (Filtered noise burst)
    playPurge() {
      initCtx();
      if (!isEnabled()) return;
      try {
        const now = ctx.currentTime;
        
        // Noise buffer
        const bufferSize = ctx.sampleRate * 0.15;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1200, now);
        filter.frequency.exponentialRampToValueAtTime(100, now + 0.15);

        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        noise.start(now);
        noise.stop(now + 0.15);
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
    }
  };
})();

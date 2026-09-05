/**
 * CODE INVADERS — Subtle Cyber Constellation Starfield Canvas Engine
 * Eye-friendly, ultra-smooth background visuals with soft drifting nodes and particle bursts.
 */

const CodeRain = (function () {
  let canvas = null;
  let ctx = null;
  let stars = [];
  let glyphParticles = [];
  let colors = ['#7ee6c4', '#6de8ff', '#c9a6ff', '#ffc857', '#8fb2ff', '#35ffa0'];
  let glyphs = '01{}[]<>/=+#$_%&*'.split('');
  let animationId = null;
  let particles = [];
  const maxParticles = 120;

  function resize() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 1. Subtle Drifting Constellation Stars
    stars = [];
    const starCount = Math.floor((canvas.width * canvas.height) / 22000);
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: 1.2 + Math.random() * 1.8,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    // 2. Slow Drifting Code Glyph Dust
    glyphParticles = [];
    const dustCount = Math.floor(canvas.width / 160);
    for (let j = 0; j < dustCount; j++) {
      glyphParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vy: 0.15 + Math.random() * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        char: glyphs[Math.floor(Math.random() * glyphs.length)]
      });
    }
  }

  function render() {
    if (!ctx || !canvas) return;

    // Clear with semi-transparent background fade for smooth motion trails
    ctx.fillStyle = 'rgba(6, 8, 16, 0.25)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 1. Render Constellation Web Connections (Subtle faint lines)
    ctx.save();
    for (let i = 0; i < stars.length; i++) {
      const s1 = stars[i];
      s1.x += s1.vx;
      s1.y += s1.vy;

      if (s1.x < 0) s1.x = canvas.width;
      if (s1.x > canvas.width) s1.x = 0;
      if (s1.y < 0) s1.y = canvas.height;
      if (s1.y > canvas.height) s1.y = 0;

      // Draw Star Node
      ctx.fillStyle = s1.color;
      ctx.globalAlpha = 0.45;
      ctx.beginPath();
      ctx.arc(s1.x, s1.y, s1.radius, 0, Math.PI * 2);
      ctx.fill();

      // Connect nearby stars with ultra-faint lines
      for (let j = i + 1; j < stars.length; j++) {
        const s2 = stars[j];
        const dx = s1.x - s2.x;
        const dy = s1.y - s2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.strokeStyle = s1.color;
          ctx.globalAlpha = (1 - dist / 110) * 0.12; // Ultra low opacity for visual comfort
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(s1.x, s1.y);
          ctx.lineTo(s2.x, s2.y);
          ctx.stroke();
        }
      }
    }
    ctx.restore();

    // 2. Render Soft Drifting Glyph Dust
    ctx.save();
    ctx.font = '13px "JetBrains Mono", monospace';
    for (let k = 0; k < glyphParticles.length; k++) {
      const g = glyphParticles[k];
      g.y += g.vy;
      if (g.y > canvas.height) {
        g.y = -20;
        g.x = Math.random() * canvas.width;
      }
      ctx.fillStyle = g.color;
      ctx.globalAlpha = 0.18; // Super faint ambient code dust
      ctx.fillText(g.char, g.x, g.y);
    }
    ctx.restore();

    // 3. Dynamic Purge & EMP Burst Layer
    if (particles.length > 0) {
      ctx.save();
      ctx.font = '12px "JetBrains Mono", monospace';
      for (let p = particles.length - 1; p >= 0; p--) {
        const pt = particles[p];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vy += 0.05;
        pt.life -= pt.decay;

        if (pt.life <= 0) {
          particles.splice(p, 1);
          continue;
        }

        ctx.fillStyle = pt.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = pt.color;
        ctx.globalAlpha = pt.life;
        ctx.fillText(pt.char, pt.x, pt.y);
      }
      ctx.restore();
    }

    ctx.shadowBlur = 0;
    animationId = requestAnimationFrame(render);
  }

  return {
    init(canvasId = 'codeRain') {
      canvas = document.getElementById(canvasId);
      if (!canvas) return;
      ctx = canvas.getContext('2d');

      window.addEventListener('resize', resize);
      resize();

      if (animationId) cancelAnimationFrame(animationId);
      render();
    },

    setThemeColors(newColors) {
      if (Array.isArray(newColors) && newColors.length > 0) {
        colors = newColors;
        for (let i = 0; i < stars.length; i++) {
          stars[i].color = colors[Math.floor(Math.random() * colors.length)];
        }
        for (let j = 0; j < glyphParticles.length; j++) {
          glyphParticles[j].color = colors[Math.floor(Math.random() * colors.length)];
        }
      }
    },

    spawnBurst(x, y, color = '#6de8ff', count = 18) {
      if (particles.length > maxParticles) {
        particles.splice(0, count);
      }
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.5 + Math.random() * 4.5;
        const g = glyphs[Math.floor(Math.random() * glyphs.length)];
        particles.push({
          x: x,
          y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1.0,
          decay: 0.02 + Math.random() * 0.03,
          color: color,
          char: g
        });
      }
    }
  };
})();

/**
 * CODE INVADERS — Canvas Ambient Matrix Code Rain
 */

const CodeRain = (function () {
  let canvas = null;
  let ctx = null;
  let columns = [];
  let fontSize = 15;
  let glyphs = '01{}[]<>/=+-;()#$_%&*'.split('');
  let colors = ['#7ee6c4', '#6de8ff', '#c9a6ff', '#ffc857', '#8fb2ff'];
  let animationId = null;

  function resize() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colCount = Math.floor(canvas.width / fontSize);
    
    columns = [];
    for (let i = 0; i < colCount; i++) {
      columns.push({
        x: i * fontSize,
        y: Math.random() * -40,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  function render() {
    if (!ctx || !canvas) return;

    ctx.fillStyle = 'rgba(6, 8, 16, 0.16)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      const g = glyphs[Math.floor(Math.random() * glyphs.length)];
      ctx.fillStyle = col.color;
      ctx.globalAlpha = 0.5;
      ctx.fillText(g, col.x, col.y * fontSize);
      ctx.globalAlpha = 1;

      if (col.y * fontSize > canvas.height && Math.random() > 0.975) {
        col.y = 0;
        col.color = colors[Math.floor(Math.random() * colors.length)];
      }
      col.y++;
    }

    animationId = requestAnimationFrame(render);
  }

  return {
    init(canvasId = 'bg-canvas') {
      canvas = document.getElementById(canvasId);
      if (!canvas) return;
      ctx = canvas.getContext('2d');

      window.addEventListener('resize', resize);
      resize();

      if (animationId) cancelAnimationFrame(animationId);
      render();
    }
  };
})();


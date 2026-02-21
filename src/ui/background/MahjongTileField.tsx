import React, { useEffect, useRef } from 'react';

const TILE_SYMBOLS = [
  { text: '東', color: '#1a1a1a' },
  { text: '南', color: '#1a1a1a' },
  { text: '西', color: '#1a1a1a' },
  { text: '北', color: '#1a1a1a' },
  { text: '中', color: '#ff3366' }, // Red dragon
  { text: '發', color: '#33ffaa' }, // Green dragon
  { text: '', color: '#aaaaaa' },   // White dragon
  { text: '一', color: '#1a1a1a' },
  { text: '二', color: '#1a1a1a' },
  { text: '三', color: '#1a1a1a' },
  { text: '四', color: '#1a1a1a' },
  { text: '五', color: '#ff3366' },
  { text: '六', color: '#1a1a1a' },
  { text: '七', color: '#1a1a1a' },
  { text: '八', color: '#1a1a1a' },
  { text: '九', color: '#1a1a1a' },
];

let preRenderedSprites: HTMLCanvasElement[] = [];
let spritesGenerated = false;

function generateSprites(dpr: number) {
  if (spritesGenerated) return;
  const w = 32 * dpr;
  const h = 44 * dpr;
  const r = 4 * dpr;

  TILE_SYMBOLS.forEach(sym => {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw rounded rect base
    ctx.fillStyle = 'rgba(250, 245, 235, 1)'; // Off-white tile base
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(w - r, 0);
    ctx.quadraticCurveTo(w, 0, w, r);
    ctx.lineTo(w, h - r);
    ctx.quadraticCurveTo(w, h, w - r, h);
    ctx.lineTo(r, h);
    ctx.quadraticCurveTo(0, h, 0, h - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.fill();

    // Border
    ctx.lineWidth = 1 * dpr;
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)';
    ctx.stroke();

    // Inner Border for White Dragon
    if (sym.text === '') {
      ctx.strokeStyle = '#2a9df4';
      ctx.lineWidth = 2 * dpr;
      ctx.strokeRect(6 * dpr, 6 * dpr, w - 12 * dpr, h - 12 * dpr);
    }

    // Text Symbol
    if (sym.text) {
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `bold ${20 * dpr}px sans-serif`;
      ctx.fillStyle = sym.color;
      ctx.fillText(sym.text, w / 2, h / 2 + 1 * dpr);
    }

    preRenderedSprites.push(canvas);
  });
  spritesGenerated = true;
}

interface TileParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  rotSpeed: number;
  scale: number;
  baseOpacity: number;
  opacityOffset: number;
  spriteIdx: number;
  blur: number;
  twinkleTimer: number;
}

const MahjongTileField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    generateSprites(dpr);

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    const tiles: TileParticle[] = [];
    const numTiles = 60; // Max 90

    for (let i = 0; i < numTiles; i++) {
        tiles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 20, // 10 to 35 px/sec roughly handled in loop
            vy: (Math.random() * 25 + 10) * (Math.random() > 0.5 ? 1 : -1), // diagonal drift
            rot: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.5,
            scale: 0.5 + Math.random() * 0.7,
            baseOpacity: 0.08 + Math.random() * 0.1, // 0.08 to 0.18
            opacityOffset: 0,
            spriteIdx: Math.floor(Math.random() * preRenderedSprites.length),
            blur: Math.floor(2 + Math.random() * 4), // 2px to 6px
            twinkleTimer: Math.random() * 5000
        });
    }

    let animationId: number;
    let lastTime = performance.now();
    let mouseX = 0;
    let mouseY = 0;
    const targetParallax = { x: 0, y: 0 };
    const currentParallax = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
        mouseX = (e.clientX / width) * 2 - 1;
        mouseY = (e.clientY / height) * 2 - 1;
        targetParallax.x = -mouseX * 12; // Max 12px parallax
        targetParallax.y = -mouseY * 12;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
    };
    window.addEventListener('resize', handleResize);

    const animate = (time: number) => {
        animationId = requestAnimationFrame(animate);

        // Pause on tab hidden
        if (document.hidden) {
            lastTime = time;
            return;
        }

        const dt = (time - lastTime) / 1000;
        lastTime = time;
        if (dt > 0.1) return; // Prevent huge jumps after tab backgrounded

        ctx.filter = 'none'; // Reset filter to prevent blurring the clear area
        ctx.clearRect(0, 0, width * dpr, height * dpr);

        // Update parallax interpolation
        currentParallax.x += (targetParallax.x - currentParallax.x) * 5 * dt;
        currentParallax.y += (targetParallax.y - currentParallax.y) * 5 * dt;

        // Group tiles by blur to minimize context state changes
        for (let blurLevel = 2; blurLevel <= 6; blurLevel++) {
            let hasBlurGroup = false;

            for (let i = 0; i < numTiles; i++) {
                const p = tiles[i];
                if (p.blur !== blurLevel) continue;
                
                if (!hasBlurGroup) {
                    ctx.filter = `blur(${blurLevel * dpr}px)`;
                    hasBlurGroup = true;
                }

                // Update physics
                p.x += p.vx * dt;
                p.y += p.vy * dt;
                p.rot += p.rotSpeed * dt;

                // Screen wraps
                if (p.x < -100) p.x = width + 50;
                else if (p.x > width + 100) p.x = -50;
                if (p.y < -100) p.y = height + 50;
                else if (p.y > height + 100) p.y = -50;

                // Twinkle Logic
                p.twinkleTimer -= dt * 1000;
                if (p.twinkleTimer < 0) {
                    p.opacityOffset = 0.05;
                    p.twinkleTimer = 3000 + Math.random() * 5000;
                }
                if (p.opacityOffset > 0) {
                    p.opacityOffset -= 0.05 * dt; // fade out twinkle
                    if (p.opacityOffset < 0) p.opacityOffset = 0;
                }

                const finalOpacity = Math.min(p.baseOpacity + p.opacityOffset, 1);
                
                // Render Transform
                ctx.save();
                ctx.globalAlpha = finalOpacity;
                
                // Add parallax based on scale (depth)
                const px = p.x + currentParallax.x * p.scale;
                const py = p.y + currentParallax.y * p.scale;
                
                ctx.translate(px * dpr, py * dpr);
                ctx.rotate(p.rot);
                ctx.scale(p.scale, p.scale);
                
                const sprite = preRenderedSprites[p.spriteIdx];
                // Draw centered
                ctx.drawImage(sprite, -sprite.width / 2, -sprite.height / 2);
                
                ctx.restore();
            }
        }
    };

    animationId = requestAnimationFrame(animate);

    return () => {
        cancelAnimationFrame(animationId);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="mahjong-tile-field" 
      data-testid="mahjong-bg-canvas"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      }}
    />
  );
};

export default MahjongTileField;

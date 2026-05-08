import { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    let animationFrameId;
    let streakTimeoutId;

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (!isDark) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const focalLength = 350;
    const cameraZ = -700;
    const cameraY = -350;

    const dotCanvas = document.createElement('canvas');
    dotCanvas.width = 24;
    dotCanvas.height = 24;
    const dctx = dotCanvas.getContext('2d');
    const gradient = dctx.createRadialGradient(12, 12, 0, 12, 12, 12);
    gradient.addColorStop(0, 'rgba(240, 171, 252, 1)');
    gradient.addColorStop(0.2, 'rgba(192, 132, 252, 0.8)');
    gradient.addColorStop(0.5, 'rgba(147, 51, 234, 0.4)');
    gradient.addColorStop(1, 'rgba(147, 51, 234, 0)');
    dctx.fillStyle = gradient;
    dctx.fillRect(0, 0, 24, 24);

    const cols = 60;
    const rows = 50;
    const spacing = 50;

    let waveParticles = [];
    let skyDust = [];
    let embers = [];
    let streaks = [];
    let moonParticles = [];
    let moonRings = [];

    let mouseX = 0, mouseY = 0;
    const handleMouseMove = (e) => {
      mouseX = (e.clientX / width - 0.5) * 300;
      mouseY = (e.clientY / height - 0.5) * 150;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const init = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      waveParticles = [];
      for (let z = 0; z < rows; z++) {
        for (let x = 0; x < cols; x++) {
          waveParticles.push({
            ox: (x - cols / 2) * spacing,
            oz: (z - rows / 2) * spacing,
            y: 0
          });
        }
      }

      skyDust = [];
      for (let i = 0; i < 150; i++) {
        skyDust.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.8),
          radius: Math.random() * 1.5 + 0.3,
          alphaPhase: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.02 + 0.005
        });
      }

      embers = [];
      for (let i = 0; i < 35; i++) {
        embers.push({
          x: Math.random() * width,
          y: height - Math.random() * 300,
          vx: (Math.random() - 0.5) * 0.8,
          vy: -(Math.random() * 1.5 + 0.5),
          radius: Math.random() * 2 + 1.5,
          alpha: Math.random()
        });
      }

      moonParticles = [];
      const craters = [
        { x: 0.5, y: 0.2, z: 0.8, r: 0.3 },
        { x: -0.4, y: 0.5, z: 0.6, r: 0.4 },
        { x: -0.7, y: -0.3, z: 0.5, r: 0.2 },
        { x: 0.1, y: -0.6, z: 0.7, r: 0.35 },
        { x: 0.8, y: -0.4, z: 0.2, r: 0.25 },
        { x: -0.2, y: 0.1, z: -0.9, r: 0.3 },
        { x: 0.6, y: -0.5, z: -0.6, r: 0.4 }
      ];

      for (let i = 0; i < 1500; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        let px = Math.sin(phi) * Math.cos(theta);
        let py = Math.sin(phi) * Math.sin(theta);
        let pz = Math.cos(phi);

        let inCrater = false;
        for (let c of craters) {
          const dist = Math.sqrt((px - c.x) ** 2 + (py - c.y) ** 2 + (pz - c.z) ** 2);
          if (dist < c.r) {
            inCrater = true;
            break;
          }
        }

        if (inCrater) {
          moonParticles.push({ x: px * 0.92, y: py * 0.92, z: pz * 0.92, isCrater: true });
        } else {
          moonParticles.push({ x: px, y: py, z: pz, isCrater: false });
        }
      }
    };

    const spawnStreak = () => {
      if (!document.hidden) {
        const isLeftToRight = Math.random() > 0.5;
        const startY = Math.random() * (height * 0.5);
        const angle = (Math.random() * 0.5 - 0.25);

        streaks.push({
          x: isLeftToRight ? -200 : width + 200,
          y: startY,
          length: Math.random() * 150 + 50,
          speedX: (Math.random() * 8 + 8) * (isLeftToRight ? 1 : -1),
          speedY: angle * 10,
          alpha: Math.random() * 0.5 + 0.5
        });
      }
      streakTimeoutId = setTimeout(spawnStreak, Math.random() * 4000 + 1000);
    };

    spawnStreak();

    const drawInteractiveMoon = (t) => {
      const moonX = width * 0.75 - mouseX * 0.05;
      const moonY = height * 0.25 - mouseY * 0.05;
      const moonRadius = Math.min(width, height) * 0.15;

      const pGrad = ctx.createRadialGradient(
        moonX - moonRadius * 0.3,
        moonY - moonRadius * 0.3,
        0,
        moonX,
        moonY,
        moonRadius
      );
      pGrad.addColorStop(0, 'rgba(232, 121, 249, 0.15)');
      pGrad.addColorStop(0.5, 'rgba(147, 51, 234, 0.05)');
      pGrad.addColorStop(0.8, 'rgba(17, 24, 39, 0.8)');
      pGrad.addColorStop(1, 'rgba(9, 10, 15, 1)');

      ctx.beginPath();
      ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
      ctx.fillStyle = pGrad;
      ctx.fill();


      const rotY = t * 0.15 + mouseX * 0.003;
      const rotX = mouseY * 0.003 - 0.2;

      moonParticles.forEach(p => {
        let y1 = p.y * Math.cos(rotX) - p.z * Math.sin(rotX);
        let z1 = p.y * Math.sin(rotX) + p.z * Math.cos(rotX);
        let x2 = p.x * Math.cos(rotY) + z1 * Math.sin(rotY);
        let z2 = -p.x * Math.sin(rotY) + z1 * Math.cos(rotY);

        if (z2 > 0) {
          const px = moonX + x2 * moonRadius;
          const py = moonY + y1 * moonRadius;
          const zScale = (z2 + 1) / 2;
          
          ctx.globalAlpha = Math.max(0.05, zScale * (p.isCrater ? 0.3 : 0.8));
          ctx.fillStyle = p.isCrater ? '#a855f7' : '#f0abfc';
          ctx.beginPath();
          ctx.arc(px, py, (p.isCrater ? 0.8 : 1.5) * zScale, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1.0;
    };

    const animate = (time) => {
      const t = time * 0.0012;

      ctx.fillStyle = '#090a0f';
      ctx.fillRect(0, 0, width, height);

      drawInteractiveMoon(t);

      ctx.fillStyle = '#f0abfc';
      skyDust.forEach(d => {
        d.alphaPhase += d.speed;
        let currentAlpha = (Math.sin(d.alphaPhase) + 1) * 0.25;
        ctx.globalAlpha = currentAlpha;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.lineWidth = 2;
      for (let i = streaks.length - 1; i >= 0; i--) {
        let s = streaks[i];
        s.x += s.speedX;
        s.y += s.speedY;
        s.alpha -= 0.005;

        if (s.alpha <= 0 || s.x < -300 || s.x > width + 300) {
          streaks.splice(i, 1);
        } else {
          ctx.globalAlpha = Math.max(0, s.alpha * 0.6);
          let endX = s.x - (s.speedX > 0 ? s.length : -s.length);
          let endY = s.y - (s.speedY > 0 ? s.length * (s.speedY / s.speedX) : -s.length * (s.speedY / s.speedX));

          let grad = ctx.createLinearGradient(s.x, s.y, endX, endY);
          grad.addColorStop(0, 'rgba(232, 121, 249, 1)');
          grad.addColorStop(1, 'rgba(232, 121, 249, 0)');
          ctx.strokeStyle = grad;

          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(endX, endY);
          ctx.stroke();
        }
      }

      const camXOffset = mouseX;
      const camYOffset = mouseY;

      waveParticles.forEach(p => {
        const nx = p.ox * 0.002;
        const nz = p.oz * 0.002;

        p.y = Math.sin(nx * 2 + t) * 180
          + Math.cos(nz * 2.5 - t * 0.8) * 120
          + Math.sin((nx + nz) * 4 + t * 1.5) * 60;

        const relX = p.ox - camXOffset;
        const relY = p.y - (cameraY + camYOffset);
        const relZ = p.oz - cameraZ;

        if (relZ <= 0) return;

        const scale = focalLength / relZ;
        const projectedX = relX * scale + width / 2;
        const projectedY = relY * scale + height / 2 + 100;

        let alpha = 1.5 - (relZ / (rows * spacing * 0.8));
        if (alpha <= 0.05) return;

        const radius = Math.max(0.5, 8 * scale);

        ctx.globalAlpha = Math.min(1, alpha);
        ctx.drawImage(dotCanvas, projectedX - radius, projectedY - radius, radius * 2, radius * 2);
      });

      embers.forEach(e => {
        e.x += e.vx + Math.sin(t * 3 + e.y * 0.02) * 0.5;
        e.y += e.vy;
        e.alpha -= 0.0015;

        if (e.alpha <= 0 || e.y < -50) {
          e.y = height - Math.random() * 100;
          e.x = Math.random() * width;
          e.alpha = 1;
        }

        ctx.globalAlpha = Math.max(0, e.alpha * 0.8);
        ctx.drawImage(dotCanvas, e.x - e.radius, e.y - e.radius, e.radius * 2, e.radius * 2);
      });

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate(0);

    const handleResize = () => {
      init();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(streakTimeoutId);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: -10,
        display: document.documentElement.getAttribute('data-theme') === 'dark' ? 'block' : 'none'
      }}
    />
  );
}

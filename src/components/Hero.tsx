import { motion } from 'motion/react';
import { ChevronDown, Github, Linkedin, Mail } from 'lucide-react';
import { useEffect, useRef } from 'react';

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    const handleResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      initColumns();
    };
    window.addEventListener('resize', handleResize);

    // ── Matrix rain ──────────────────────────────────────────
    const FONT_SIZE = 14;
    const CHARS = '01アイウエオカキクケコサシスセソタチツテトナニヌネノABCDEF';
    let columns: number[] = [];

    const initColumns = () => {
      const count = Math.floor(W / FONT_SIZE);
      columns = Array.from({ length: count }, () => Math.random() * -H);
    };
    initColumns();

    // ── Hex particles ─────────────────────────────────────────
    interface Hex {
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      alpha: number;
      fadeSpeed: number;
      rotSpeed: number;
      rot: number;
      color: string;
    }

    const HEX_COLORS = [
      'rgba(6,182,212,',   // cyan
      'rgba(16,185,129,',  // emerald
      'rgba(139,92,246,',  // violet
    ];

    const hexes: Hex[] = Array.from({ length: 28 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      size: 12 + Math.random() * 28,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: 0.03 + Math.random() * 0.08,
      fadeSpeed: 0.001 + Math.random() * 0.002,
      rotSpeed: (Math.random() - 0.5) * 0.01,
      rot: Math.random() * Math.PI,
      color: HEX_COLORS[Math.floor(Math.random() * HEX_COLORS.length)],
    }));

    const drawHexagon = (x: number, y: number, size: number, rot: number, color: string, alpha: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i;
        const px = size * Math.cos(angle);
        const py = size * Math.sin(angle);
        i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.strokeStyle = `${color}${alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();
    };

    // ── Floating binary orbs ──────────────────────────────────
    interface Orb {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      color: string;
      pulse: number;
      pulseSpeed: number;
    }

    const orbs: Orb[] = Array.from({ length: 6 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 60 + Math.random() * 80,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      color: Math.random() > 0.5 ? '6,182,212' : '16,185,129',
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.01 + Math.random() * 0.02,
    }));

    // ── Scan lines ────────────────────────────────────────────
    let scanY = 0;

    // ── Connection lines between orbs ─────────────────────────
    const drawConnections = () => {
      for (let i = 0; i < orbs.length; i++) {
        for (let j = i + 1; j < orbs.length; j++) {
          const dx = orbs[i].x - orbs[j].x;
          const dy = orbs[i].y - orbs[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 350) {
            const alpha = (1 - dist / 350) * 0.15;
            ctx.beginPath();
            ctx.moveTo(orbs[i].x, orbs[i].y);
            ctx.lineTo(orbs[j].x, orbs[j].y);
            ctx.strokeStyle = `rgba(6,182,212,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
    };

    let frame = 0;

    const draw = () => {
      frame++;

      // ── Background ───────────────────────────────────────────
      ctx.fillStyle = 'rgba(2, 8, 20, 0.85)';
      ctx.fillRect(0, 0, W, H);

      // ── Orbs ─────────────────────────────────────────────────
      orbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;
        orb.pulse += orb.pulseSpeed;
        if (orb.x < -orb.r) orb.x = W + orb.r;
        if (orb.x > W + orb.r) orb.x = -orb.r;
        if (orb.y < -orb.r) orb.y = H + orb.r;
        if (orb.y > H + orb.r) orb.y = -orb.r;

        const pulsedR = orb.r + Math.sin(orb.pulse) * 10;
        const g = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, pulsedR);
        g.addColorStop(0, `rgba(${orb.color},0.06)`);
        g.addColorStop(0.5, `rgba(${orb.color},0.03)`);
        g.addColorStop(1, `rgba(${orb.color},0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, pulsedR, 0, Math.PI * 2);
        ctx.fill();
      });

      drawConnections();

      // ── Matrix rain ───────────────────────────────────────────
      ctx.font = `${FONT_SIZE}px monospace`;
      columns.forEach((y, i) => {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
        const x = i * FONT_SIZE;

        // Head character — bright white/cyan
        ctx.fillStyle = `rgba(180, 255, 255, ${0.9})`;
        ctx.fillText(char, x, y);

        // Trail characters
        const trailChar = CHARS[Math.floor(Math.random() * CHARS.length)];
        const trailAlpha = 0.08 + Math.random() * 0.12;
        ctx.fillStyle = `rgba(6, 182, 212, ${trailAlpha})`;
        ctx.fillText(trailChar, x, y - FONT_SIZE);

        // Advance column
        if (y > H + FONT_SIZE * 5 && Math.random() > 0.975) {
          columns[i] = -FONT_SIZE * (5 + Math.random() * 20);
        } else {
          columns[i] = y + FONT_SIZE;
        }
      });

      // ── Hex particles ─────────────────────────────────────────
      hexes.forEach((hex) => {
        hex.x += hex.vx;
        hex.y += hex.vy;
        hex.rot += hex.rotSpeed;
        if (hex.x < -hex.size) hex.x = W + hex.size;
        if (hex.x > W + hex.size) hex.x = -hex.size;
        if (hex.y < -hex.size) hex.y = H + hex.size;
        if (hex.y > H + hex.size) hex.y = -hex.size;
        drawHexagon(hex.x, hex.y, hex.size, hex.rot, hex.color, hex.alpha);
      });

      // ── Horizontal scan line ──────────────────────────────────
      scanY = (scanY + 1.5) % H;
      const scanGrad = ctx.createLinearGradient(0, scanY - 40, 0, scanY + 40);
      scanGrad.addColorStop(0, 'rgba(6,182,212,0)');
      scanGrad.addColorStop(0.5, 'rgba(6,182,212,0.04)');
      scanGrad.addColorStop(1, 'rgba(6,182,212,0)');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanY - 40, W, 80);

      // ── Corner brackets ───────────────────────────────────────
      const bSize = 30;
      const bAlpha = 0.3 + 0.1 * Math.sin(frame * 0.02);
      ctx.strokeStyle = `rgba(6,182,212,${bAlpha})`;
      ctx.lineWidth = 1.5;
      // TL
      ctx.beginPath(); ctx.moveTo(20, 20 + bSize); ctx.lineTo(20, 20); ctx.lineTo(20 + bSize, 20); ctx.stroke();
      // TR
      ctx.beginPath(); ctx.moveTo(W - 20 - bSize, 20); ctx.lineTo(W - 20, 20); ctx.lineTo(W - 20, 20 + bSize); ctx.stroke();
      // BL
      ctx.beginPath(); ctx.moveTo(20, H - 20 - bSize); ctx.lineTo(20, H - 20); ctx.lineTo(20 + bSize, H - 20); ctx.stroke();
      // BR
      ctx.beginPath(); ctx.moveTo(W - 20 - bSize, H - 20); ctx.lineTo(W - 20, H - 20); ctx.lineTo(W - 20, H - 20 - bSize); ctx.stroke();

      // ── Vignette ─────────────────────────────────────────────
      const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.9);
      vig.addColorStop(0, 'rgba(0,0,0,0)');
      vig.addColorStop(1, 'rgba(0,0,0,0.6)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="inline-block">
            <span className="px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-mono">
              &gt; Security Professional
            </span>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl sm:text-6xl lg:text-8xl tracking-tight"
          >
            <span className="block text-slate-400 text-3xl sm:text-4xl lg:text-5xl mb-4">Hello, I'm</span>
            <span className="block bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
              Mba Nonna
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="max-w-3xl mx-auto">
            <p className="text-xl sm:text-2xl text-slate-300 font-mono">
              Cybersecurity | Cloud Security | Security Engineering
            </p>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="max-w-2xl mx-auto text-lg text-slate-400"
          >
            Designing secure systems at scale where threat detection, cloud security engineering and risk converge.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
          >
            <button
              onClick={() => scrollToSection('projects')}
              className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-lg overflow-hidden transition-all hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/50"
            >
              <span className="relative z-10 flex items-center gap-2 text-white font-medium">
                View My Work
                <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <button
              onClick={() => scrollToSection('contact')}
              className="group px-8 py-4 bg-slate-800/50 border-2 border-slate-700 rounded-lg hover:border-cyan-500/50 hover:bg-slate-800 transition-all hover:scale-105"
            >
              <span className="text-slate-300 group-hover:text-cyan-400 transition-colors font-medium">
                Contact Me
              </span>
            </button>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="flex items-center justify-center gap-6 pt-8"
          >
            <a href="https://github.com/Mba205" target="_blank" rel="noopener noreferrer"
              className="group p-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800 transition-all">
              <Github className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            </a>
            <a href="https://linkedin.com/in/mbanonna" target="_blank" rel="noopener noreferrer"
              className="group p-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800 transition-all">
              <Linkedin className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            </a>
            <a href="mailto:mbanonna@gmail.com"
              className="group p-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800 transition-all">
              <Mail className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, repeat: Infinity, repeatType: 'reverse', duration: 1.5 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown className="w-6 h-6 text-cyan-400" />
        </motion.div>
      </div>
    </section>
  );
}

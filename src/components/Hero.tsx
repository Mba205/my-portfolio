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
    let mouse = { x: W / 2, y: H / 2 };

    const handleResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      init();
    };

    const handleMouse = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouse);

    // ── CONFIG ────────────────────────────────────────────
    const COUNT       = Math.floor((W * H) / 10000);
    const MAX_DIST    = 140;
    const MOUSE_DIST  = 180;
    const MOUSE_FORCE = 0.012;

    interface Particle {
      x: number; y: number;
      vx: number; vy: number;
      r: number;
      alpha: number;
      pulse: number;
      pulseSpeed: number;
      color: string;
    }

    interface Spark {
      fromIdx: number;
      toIdx: number;
      t: number;
      speed: number;
    }

    let particles: Particle[] = [];
    let sparks: Spark[] = [];
    let sparkTimer = 0;

    const COLORS = ['6,182,212', '16,185,129', '139,92,246'];

    const init = () => {
      particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 0.8 + Math.random() * 1.4,
        alpha: 0.3 + Math.random() * 0.5,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.008 + Math.random() * 0.015,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
      sparks = [];
    };

    const spawnSpark = () => {
      const a = Math.floor(Math.random() * particles.length);
      let b = -1;
      let best = Infinity;
      for (let i = 0; i < particles.length; i++) {
        if (i === a) continue;
        const dx = particles[i].x - particles[a].x;
        const dy = particles[i].y - particles[a].y;
        const d = dx * dx + dy * dy;
        if (d < best && d < MAX_DIST * MAX_DIST) { best = d; b = i; }
      }
      if (b === -1) return;
      sparks.push({ fromIdx: a, toIdx: b, t: 0, speed: 0.012 + Math.random() * 0.018 });
    };

    init();

    const draw = () => {
      // Fade trail
      ctx.fillStyle = 'rgba(3, 8, 22, 0.2)';
      ctx.fillRect(0, 0, W, H);

      // Update + draw particles
      particles.forEach((p, idx) => {
        // Mouse repulsion
        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const md  = Math.sqrt(mdx * mdx + mdy * mdy);
        if (md < MOUSE_DIST && md > 0) {
          const force = (1 - md / MOUSE_DIST) * MOUSE_FORCE;
          p.vx += (mdx / md) * force;
          p.vy += (mdy / md) * force;
        }

        // Gentle friction
        p.vx *= 0.995;
        p.vy *= 0.995;

        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;

        // Soft boundary wrap
        if (p.x < -20) p.x = W + 20;
        if (p.x > W + 20) p.x = -20;
        if (p.y < -20) p.y = H + 20;
        if (p.y > H + 20) p.y = -20;

        // Draw connections
        for (let j = idx + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.18;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${p.color},${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }

        // Draw mouse connections
        const mDist = Math.sqrt((p.x - mouse.x) ** 2 + (p.y - mouse.y) ** 2);
        if (mDist < MOUSE_DIST) {
          const alpha = (1 - mDist / MOUSE_DIST) * 0.25;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(6,182,212,${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }

        // Draw dot
        const pAlpha = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        glow.addColorStop(0, `rgba(${p.color},${pAlpha * 0.4})`);
        glow.addColorStop(1, `rgba(${p.color},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${pAlpha})`;
        ctx.fill();
      });

      // Draw mouse dot
      const mglow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 20);
      mglow.addColorStop(0, 'rgba(6,182,212,0.15)');
      mglow.addColorStop(1, 'rgba(6,182,212,0)');
      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 20, 0, Math.PI * 2);
      ctx.fillStyle = mglow;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(mouse.x, mouse.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(6,182,212,0.6)';
      ctx.fill();

      // Draw sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.t += s.speed;
        if (s.t >= 1) { sparks.splice(i, 1); continue; }

        const from = particles[s.fromIdx];
        const to   = particles[s.toIdx];
        const sx   = from.x + (to.x - from.x) * s.t;
        const sy   = from.y + (to.y - from.y) * s.t;

        // Trail
        const trailT = Math.max(0, s.t - 0.18);
        const tx = from.x + (to.x - from.x) * trailT;
        const ty = from.y + (to.y - from.y) * trailT;

        const grad = ctx.createLinearGradient(tx, ty, sx, sy);
        grad.addColorStop(0, 'rgba(6,182,212,0)');
        grad.addColorStop(1, 'rgba(6,182,212,0.9)');
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Head
        const hg = ctx.createRadialGradient(sx, sy, 0, sx, sy, 6);
        hg.addColorStop(0, 'rgba(6,182,212,0.9)');
        hg.addColorStop(1, 'rgba(6,182,212,0)');
        ctx.beginPath();
        ctx.arc(sx, sy, 6, 0, Math.PI * 2);
        ctx.fillStyle = hg;
        ctx.fill();
      }

      // Subtle vignette
      const vig = ctx.createRadialGradient(W/2, H/2, H*0.25, W/2, H/2, H*0.85);
      vig.addColorStop(0, 'rgba(3,8,22,0)');
      vig.addColorStop(1, 'rgba(3,8,22,0.65)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      // Spawn sparks
      sparkTimer++;
      if (sparkTimer % 35 === 0 && sparks.length < 8) spawnSpark();

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouse);
    };
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'rgb(3, 8, 22)' }}
      />

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="inline-block">
            <span className="px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-mono">
              &gt; Security Professional
            </span>
          </motion.div>

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

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="max-w-3xl mx-auto">
            <p className="text-xl sm:text-2xl text-slate-300 font-mono">
              Cybersecurity | Cloud Security | Security Engineering
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="max-w-2xl mx-auto text-lg text-slate-400"
          >
            Designing secure systems at scale where threat detection, cloud security engineering and risk converge.
          </motion.p>

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

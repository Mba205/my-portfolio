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
    };
    window.addEventListener('resize', handleResize);

    // ── MESH POINTS ───────────────────────────────────────
    // A small grid of gradient control points that drift slowly
    interface MeshPoint {
      x: number; y: number;    // current position
      tx: number; ty: number;  // target position
      ox: number; oy: number;  // origin position
      vx: number; vy: number;  // velocity
      hue: number;
      hueSpeed: number;
      radius: number;
      opacity: number;
      opacityTarget: number;
      opacitySpeed: number;
    }

    const points: MeshPoint[] = [
      // Scattered across screen at different depths
      { x: W*0.15, y: H*0.20, tx:0, ty:0, ox:W*0.15, oy:H*0.20, vx:0, vy:0, hue:195, hueSpeed:0.04, radius:W*0.35, opacity:0, opacityTarget:0.55, opacitySpeed:0.003 },
      { x: W*0.80, y: H*0.15, tx:0, ty:0, ox:W*0.80, oy:H*0.15, vx:0, vy:0, hue:260, hueSpeed:0.03, radius:W*0.30, opacity:0, opacityTarget:0.40, opacitySpeed:0.002 },
      { x: W*0.50, y: H*0.75, tx:0, ty:0, ox:W*0.50, oy:H*0.75, vx:0, vy:0, hue:170, hueSpeed:0.05, radius:W*0.32, opacity:0, opacityTarget:0.45, opacitySpeed:0.004 },
      { x: W*0.85, y: H*0.80, tx:0, ty:0, ox:W*0.85, oy:H*0.80, vx:0, vy:0, hue:220, hueSpeed:0.035, radius:W*0.28, opacity:0, opacityTarget:0.35, opacitySpeed:0.003 },
      { x: W*0.10, y: H*0.70, tx:0, ty:0, ox:W*0.10, oy:H*0.70, vx:0, vy:0, hue:280, hueSpeed:0.045, radius:W*0.25, opacity:0, opacityTarget:0.30, opacitySpeed:0.002 },
      { x: W*0.60, y: H*0.40, tx:0, ty:0, ox:W*0.60, oy:H*0.40, vx:0, vy:0, hue:185, hueSpeed:0.025, radius:W*0.22, opacity:0, opacityTarget:0.25, opacitySpeed:0.003 },
    ];

    // Randomize targets for each point (they wander within bounds)
    const newTarget = (p: MeshPoint) => {
      p.tx = p.ox + (Math.random() - 0.5) * W * 0.25;
      p.ty = p.oy + (Math.random() - 0.5) * H * 0.25;
    };
    points.forEach(p => newTarget(p));

    // ── NOISE GRID for organic texture ───────────────────
    // Simple pseudo-noise using layered sin waves
    const noise = (x: number, y: number, t: number) =>
      Math.sin(x * 0.008 + t * 0.4) * Math.cos(y * 0.006 + t * 0.3) * 0.5 +
      Math.sin(x * 0.015 + y * 0.01 + t * 0.6) * 0.3 +
      Math.cos(x * 0.005 - y * 0.012 + t * 0.2) * 0.2;

    let time = 0;

    const draw = () => {
      time += 0.004;

      // Deep base
      ctx.fillStyle = 'rgb(3, 7, 20)';
      ctx.fillRect(0, 0, W, H);

      // ── DRAW MESH GRADIENT BLOBS ──────────────────────
      points.forEach((p) => {
        // Drift toward target
        const dx = p.tx - p.x;
        const dy = p.ty - p.y;
        p.vx += dx * 0.0004;
        p.vy += dy * 0.0004;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.x  += p.vx;
        p.y  += p.vy;

        // If close to target, pick a new one
        if (Math.abs(dx) < 5 && Math.abs(dy) < 5) newTarget(p);

        // Hue drift
        p.hue += p.hueSpeed;

        // Opacity breathe
        p.opacity += (p.opacityTarget - p.opacity) * p.opacitySpeed;
        if (Math.abs(p.opacity - p.opacityTarget) < 0.005) {
          p.opacityTarget = 0.15 + Math.random() * 0.45;
        }

        // Draw radial gradient blob
        const r = p.radius * (1 + 0.12 * noise(p.x, p.y, time));
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        grad.addColorStop(0,   `hsla(${p.hue}, 85%, 60%, ${p.opacity})`);
        grad.addColorStop(0.4, `hsla(${p.hue + 20}, 80%, 50%, ${p.opacity * 0.5})`);
        grad.addColorStop(1,   `hsla(${p.hue + 40}, 70%, 40%, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();
      });

      // ── NOISE DISPLACEMENT OVERLAY ────────────────────
      // Scan a coarse grid and paint tiny noise-displaced dots
      // to give a subtle organic grain to the gradient
      const step = 80;
      for (let gx = 0; gx < W; gx += step) {
        for (let gy = 0; gy < H; gy += step) {
          const n = noise(gx, gy, time);
          if (n > 0.55) {
            const nx = gx + n * 30;
            const ny = gy + n * 30;
            ctx.beginPath();
            ctx.arc(nx, ny, 1, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(6,182,212,${(n - 0.55) * 0.15})`;
            ctx.fill();
          }
        }
      }

      // ── THIN SCANLINE EFFECT ──────────────────────────
      // Very subtle horizontal lines for a screen-like feel
      ctx.fillStyle = 'rgba(0,0,0,0.03)';
      for (let y = 0; y < H; y += 3) {
        ctx.fillRect(0, y, W, 1);
      }

      // ── CENTER DARKENING ──────────────────────────────
      // Make text area more readable without killing the effect
      const centerDark = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, H*0.55);
      centerDark.addColorStop(0,   'rgba(3,7,20,0.45)');
      centerDark.addColorStop(0.6, 'rgba(3,7,20,0.20)');
      centerDark.addColorStop(1,   'rgba(3,7,20,0)');
      ctx.fillStyle = centerDark;
      ctx.fillRect(0, 0, W, H);

      // ── EDGE VIGNETTE ─────────────────────────────────
      const vig = ctx.createRadialGradient(W/2, H/2, H*0.2, W/2, H/2, H*0.9);
      vig.addColorStop(0, 'rgba(3,7,20,0)');
      vig.addColorStop(1, 'rgba(3,7,20,0.75)');
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
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'rgb(3, 7, 20)' }}
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

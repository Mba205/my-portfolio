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
      buildCircuit();
    };
    window.addEventListener('resize', handleResize);

    // ── GRID CONFIG ──────────────────────────────────────
    const CELL = 48;
    const COLS = Math.ceil(W / CELL) + 1;
    const ROWS = Math.ceil(H / CELL) + 1;

    // ── CIRCUIT PATHS ────────────────────────────────────
    interface Segment {
      x1: number; y1: number;
      x2: number; y2: number;
      horizontal: boolean;
    }

    interface Node {
      x: number; y: number;
      type: 'via' | 'chip' | 'junction';
      size: number;
      pulse: number;
      pulseSpeed: number;
    }

    interface Pulse {
      segIdx: number;
      t: number;
      speed: number;
      color: string;
      size: number;
      reverse: boolean;
    }

    let segments: Segment[] = [];
    let nodes: Node[] = [];
    let pulses: Pulse[] = [];

    const COLORS = {
      trace:    'rgba(6,182,212,',
      traceAlt: 'rgba(16,185,129,',
      pulse:    'rgba(6,182,212,',
      pulseAlt: 'rgba(16,185,129,',
      via:      '#0891B2',
      chip:     '#0F766E',
      bg:       'rgb(2, 6, 16)',
    };

    const buildCircuit = () => {
      segments = [];
      nodes = [];
      pulses = [];

      // Build horizontal traces on grid rows
      for (let row = 0; row < ROWS; row++) {
        const y = row * CELL;
        if (Math.random() > 0.45) continue;

        let x = 0;
        while (x < W) {
          const len = (2 + Math.floor(Math.random() * 6)) * CELL;
          const gap = (1 + Math.floor(Math.random() * 3)) * CELL;
          if (x + len > W) break;

          segments.push({ x1: x, y1: y, x2: x + len, y2: y, horizontal: true });

          // Add junction node at corners
          if (Math.random() > 0.6) {
            nodes.push({
              x: x, y,
              type: Math.random() > 0.7 ? 'chip' : 'via',
              size: Math.random() > 0.7 ? 6 : 3,
              pulse: Math.random() * Math.PI * 2,
              pulseSpeed: 0.02 + Math.random() * 0.03,
            });
          }
          if (Math.random() > 0.6) {
            nodes.push({
              x: x + len, y,
              type: 'junction',
              size: 2.5,
              pulse: Math.random() * Math.PI * 2,
              pulseSpeed: 0.02 + Math.random() * 0.03,
            });
          }

          x += len + gap;
        }
      }

      // Build vertical traces on grid columns
      for (let col = 0; col < COLS; col++) {
        const x = col * CELL;
        if (Math.random() > 0.45) continue;

        let y = 0;
        while (y < H) {
          const len = (2 + Math.floor(Math.random() * 5)) * CELL;
          const gap = (1 + Math.floor(Math.random() * 3)) * CELL;
          if (y + len > H) break;

          segments.push({ x1: x, y1: y, x2: x, y2: y + len, horizontal: false });

          if (Math.random() > 0.65) {
            nodes.push({
              x, y: y + len,
              type: Math.random() > 0.8 ? 'chip' : 'via',
              size: Math.random() > 0.8 ? 5 : 3,
              pulse: Math.random() * Math.PI * 2,
              pulseSpeed: 0.02 + Math.random() * 0.04,
            });
          }

          y += len + gap;
        }
      }

      // Add some chip blocks at intersections
      for (let i = 0; i < 8; i++) {
        const col = 1 + Math.floor(Math.random() * (COLS - 2));
        const row = 1 + Math.floor(Math.random() * (ROWS - 2));
        nodes.push({
          x: col * CELL,
          y: row * CELL,
          type: 'chip',
          size: 8 + Math.random() * 6,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.015 + Math.random() * 0.02,
        });
      }

      // Seed initial pulses
      for (let i = 0; i < 18; i++) spawnPulse();
    };

    const spawnPulse = () => {
      if (segments.length === 0) return;
      const idx = Math.floor(Math.random() * segments.length);
      pulses.push({
        segIdx: idx,
        t: Math.random(),
        speed: 0.003 + Math.random() * 0.005,
        color: Math.random() > 0.4 ? COLORS.pulse : COLORS.pulseAlt,
        size: 2 + Math.random() * 2,
        reverse: Math.random() > 0.5,
      });
    };

    buildCircuit();

    let frame = 0;

    const draw = () => {
      frame++;

      // Deep dark base
      ctx.fillStyle = COLORS.bg;
      ctx.fillRect(0, 0, W, H);

      // Subtle radial glow at center
      const centerGlow = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W, H) * 0.6);
      centerGlow.addColorStop(0, 'rgba(6,182,212,0.04)');
      centerGlow.addColorStop(0.5, 'rgba(15,118,110,0.02)');
      centerGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = centerGlow;
      ctx.fillRect(0, 0, W, H);

      // ── DRAW TRACES ────────────────────────────────────
      segments.forEach((seg, i) => {
        const alpha = 0.12 + 0.05 * Math.sin(frame * 0.008 + i * 0.3);
        const isAlt = i % 3 === 0;
        ctx.beginPath();
        ctx.moveTo(seg.x1, seg.y1);
        ctx.lineTo(seg.x2, seg.y2);
        ctx.strokeStyle = isAlt
          ? `${COLORS.traceAlt}${alpha})`
          : `${COLORS.trace}${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // ── DRAW NODES ─────────────────────────────────────
      nodes.forEach((node) => {
        node.pulse += node.pulseSpeed;
        const p = Math.sin(node.pulse) * 0.4 + 0.6;

        if (node.type === 'chip') {
          // Square chip block
          const s = node.size;
          ctx.fillStyle = `rgba(15,118,110,${0.15 * p})`;
          ctx.fillRect(node.x - s, node.y - s, s * 2, s * 2);
          ctx.strokeStyle = `rgba(6,182,212,${0.4 * p})`;
          ctx.lineWidth = 1;
          ctx.strokeRect(node.x - s, node.y - s, s * 2, s * 2);

          // Inner cross lines on chip
          ctx.strokeStyle = `rgba(6,182,212,${0.15 * p})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(node.x - s, node.y);
          ctx.lineTo(node.x + s, node.y);
          ctx.moveTo(node.x, node.y - s);
          ctx.lineTo(node.x, node.y + s);
          ctx.stroke();

        } else if (node.type === 'via') {
          // Round via hole
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(6,182,212,${0.5 * p})`;
          ctx.fill();
          ctx.strokeStyle = `rgba(6,182,212,${0.8 * p})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Glow ring
          const g = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.size * 4);
          g.addColorStop(0, `rgba(6,182,212,${0.12 * p})`);
          g.addColorStop(1, 'rgba(6,182,212,0)');
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.size * 4, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();

        } else {
          // Junction dot
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(16,185,129,${0.6 * p})`;
          ctx.fill();
        }
      });

      // ── DRAW PULSES ────────────────────────────────────
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        const seg = segments[pulse.segIdx];
        if (!seg) { pulses.splice(i, 1); continue; }

        pulse.t += pulse.reverse ? -pulse.speed : pulse.speed;

        if (pulse.t > 1 || pulse.t < 0) {
          pulses.splice(i, 1);
          spawnPulse();
          continue;
        }

        const px = seg.x1 + (seg.x2 - seg.x1) * pulse.t;
        const py = seg.y1 + (seg.y2 - seg.y1) * pulse.t;

        // Trail
        const trailT = Math.max(0, Math.min(1, pulse.t - (pulse.reverse ? -0.12 : 0.12)));
        const tx = seg.x1 + (seg.x2 - seg.x1) * trailT;
        const ty = seg.y1 + (seg.y2 - seg.y1) * trailT;

        const trail = ctx.createLinearGradient(tx, ty, px, py);
        trail.addColorStop(0, `${pulse.color}0)`);
        trail.addColorStop(1, `${pulse.color}1)`);
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(px, py);
        ctx.strokeStyle = trail;
        ctx.lineWidth = pulse.size;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Head glow
        const hg = ctx.createRadialGradient(px, py, 0, px, py, pulse.size * 4);
        hg.addColorStop(0, `${pulse.color}1)`);
        hg.addColorStop(1, `${pulse.color}0)`);
        ctx.beginPath();
        ctx.arc(px, py, pulse.size * 4, 0, Math.PI * 2);
        ctx.fillStyle = hg;
        ctx.fill();

        // Bright head dot
        ctx.beginPath();
        ctx.arc(px, py, pulse.size, 0, Math.PI * 2);
        ctx.fillStyle = `${pulse.color}1)`;
        ctx.fill();
      }

      // Vignette to focus center
      const vig = ctx.createRadialGradient(W/2, H/2, H * 0.2, W/2, H/2, H * 0.85);
      vig.addColorStop(0, 'rgba(2,6,16,0)');
      vig.addColorStop(1, 'rgba(2,6,16,0.75)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      // Spawn more pulses if needed
      if (pulses.length < 20 && frame % 40 === 0) spawnPulse();

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
        style={{ background: 'rgb(2, 6, 16)' }}
      />

      {/* Bottom fade */}
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

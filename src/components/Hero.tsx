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
      init();
    };
    window.addEventListener('resize', handleResize);

    // ── TYPES ─────────────────────────────────────────────
    interface Point { x: number; y: number; }

    interface Trace {
      points: Point[];   // polyline points (L/Z shaped segments)
      color: string;
      alpha: number;
      alphaSpeed: number;
      alphaPhase: number;
    }

    interface Chip {
      x: number; y: number;
      w: number; h: number;
      label: string;
      pulse: number;
      pulseSpeed: number;
      color: string;
      central: boolean;
    }

    interface Via {
      x: number; y: number;
      r: number;
      pulse: number;
      pulseSpeed: number;
    }

    interface Pulse {
      trace: Trace;
      t: number;
      speed: number;
      color: string;
      reverse: boolean;
      totalLen: number;
      segLens: number[];
    }

    let traces: Trace[] = [];
    let chips: Chip[] = [];
    let vias: Via[] = [];
    let pulses: Pulse[] = [];

    const CYAN  = '6,182,212';
    const GREEN = '16,185,129';
    const TEAL  = '15,118,110';

    // ── HELPERS ───────────────────────────────────────────
    const snap = (v: number, g: number) => Math.round(v / g) * g;
    const rnd  = (a: number, b: number) => a + Math.random() * (b - a);
    const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

    // Build an L or Z shaped trace from start to end on a grid
    const buildTrace = (x1: number, y1: number, x2: number, y2: number): Point[] => {
      const style = Math.random();
      if (style < 0.4) {
        // L-shape: go horizontal first then vertical
        return [{ x: x1, y: y1 }, { x: x2, y: y1 }, { x: x2, y: y2 }];
      } else if (style < 0.7) {
        // L-shape: go vertical first then horizontal
        return [{ x: x1, y: y1 }, { x: x1, y: y2 }, { x: x2, y: y2 }];
      } else {
        // Z/S-shape: mid-point dogleg
        const midX = snap((x1 + x2) / 2, 24);
        return [
          { x: x1,   y: y1 },
          { x: midX, y: y1 },
          { x: midX, y: y2 },
          { x: x2,   y: y2 },
        ];
      }
    };

    // Total length of a polyline
    const polyLen = (pts: Point[]) => {
      let total = 0;
      for (let i = 1; i < pts.length; i++) {
        const dx = pts[i].x - pts[i-1].x;
        const dy = pts[i].y - pts[i-1].y;
        total += Math.sqrt(dx*dx + dy*dy);
      }
      return total;
    };

    // Segment lengths of a polyline
    const segLengths = (pts: Point[]) => {
      const lens: number[] = [];
      for (let i = 1; i < pts.length; i++) {
        const dx = pts[i].x - pts[i-1].x;
        const dy = pts[i].y - pts[i-1].y;
        lens.push(Math.sqrt(dx*dx + dy*dy));
      }
      return lens;
    };

    // Point along polyline at distance d from start
    const pointOnPoly = (pts: Point[], segLens: number[], d: number): Point => {
      let remaining = d;
      for (let i = 0; i < segLens.length; i++) {
        if (remaining <= segLens[i]) {
          const t = remaining / segLens[i];
          return {
            x: pts[i].x + (pts[i+1].x - pts[i].x) * t,
            y: pts[i].y + (pts[i+1].y - pts[i].y) * t,
          };
        }
        remaining -= segLens[i];
      }
      return pts[pts.length - 1];
    };

    // ── INIT ──────────────────────────────────────────────
    const init = () => {
      traces = [];
      chips  = [];
      vias   = [];
      pulses = [];

      const cx = W / 2;
      const cy = H / 2;
      const GRID = 40;

      // ── CENTRAL CPU ──────────────────────────────────────
      const cpuW = Math.min(180, W * 0.18);
      const cpuH = Math.min(180, H * 0.22);
      chips.push({
        x: cx, y: cy,
        w: cpuW, h: cpuH,
        label: 'CPU',
        pulse: 0,
        pulseSpeed: 0.02,
        color: CYAN,
        central: true,
      });

      // ── SATELLITE CHIPS ──────────────────────────────────
      const satellites: { dx: number; dy: number; w: number; h: number; label: string }[] = [
        { dx: -W * 0.30, dy: -H * 0.25, w: 70, h: 50, label: 'MEM' },
        { dx:  W * 0.30, dy: -H * 0.25, w: 70, h: 50, label: 'GPU' },
        { dx: -W * 0.30, dy:  H * 0.25, w: 60, h: 45, label: 'I/O' },
        { dx:  W * 0.30, dy:  H * 0.25, w: 60, h: 45, label: 'NET' },
        { dx: -W * 0.42, dy:  0,        w: 50, h: 40, label: 'DMA' },
        { dx:  W * 0.42, dy:  0,        w: 50, h: 40, label: 'PCIe' },
        { dx:  0,        dy: -H * 0.35, w: 55, h: 38, label: 'CLK' },
        { dx:  0,        dy:  H * 0.35, w: 55, h: 38, label: 'PWR' },
      ];

      satellites.forEach(s => {
        const sx = snap(cx + s.dx, GRID);
        const sy = snap(cy + s.dy, GRID);
        chips.push({
          x: sx, y: sy,
          w: s.w, h: s.h,
          label: s.label,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.015 + Math.random() * 0.025,
          color: pick([CYAN, GREEN, TEAL]),
          central: false,
        });
      });

      // ── TRACES from CPU to each satellite ────────────────
      chips.slice(1).forEach(chip => {
        // 1-3 traces per satellite
        const count = 1 + Math.floor(Math.random() * 3);
        for (let i = 0; i < count; i++) {
          // Start: edge of central CPU
          const startX = snap(cx + rnd(-cpuW/2, cpuW/2), GRID);
          const startY = snap(cy + rnd(-cpuH/2, cpuH/2), GRID);
          // End: edge of satellite chip
          const endX   = snap(chip.x + rnd(-chip.w/2, chip.w/2), GRID);
          const endY   = snap(chip.y + rnd(-chip.h/2, chip.h/2), GRID);

          const points = buildTrace(startX, startY, endX, endY);
          traces.push({
            points,
            color: pick([CYAN, GREEN, TEAL]),
            alpha: 0.1 + Math.random() * 0.1,
            alphaSpeed: 0.008 + Math.random() * 0.01,
            alphaPhase: Math.random() * Math.PI * 2,
          });

          // Via at each bend point
          for (let p = 1; p < points.length - 1; p++) {
            vias.push({
              x: points[p].x,
              y: points[p].y,
              r: 3 + Math.random() * 2,
              pulse: Math.random() * Math.PI * 2,
              pulseSpeed: 0.02 + Math.random() * 0.03,
            });
          }
        }
      });

      // ── BACKGROUND fill traces (random routed lines) ─────
      for (let i = 0; i < 35; i++) {
        const x1 = snap(rnd(0, W), GRID);
        const y1 = snap(rnd(0, H), GRID);
        const x2 = snap(x1 + rnd(-W*0.3, W*0.3), GRID);
        const y2 = snap(y1 + rnd(-H*0.3, H*0.3), GRID);
        const pts = buildTrace(x1, y1, x2, y2);
        traces.push({
          points: pts,
          color: pick([CYAN, GREEN, TEAL]),
          alpha: 0.05 + Math.random() * 0.07,
          alphaSpeed: 0.005 + Math.random() * 0.01,
          alphaPhase: Math.random() * Math.PI * 2,
        });

        // Background vias
        if (Math.random() > 0.5) {
          vias.push({
            x: pts[Math.floor(pts.length / 2)].x,
            y: pts[Math.floor(pts.length / 2)].y,
            r: 2,
            pulse: Math.random() * Math.PI * 2,
            pulseSpeed: 0.015 + Math.random() * 0.02,
          });
        }
      }

      // ── SEED PULSES ───────────────────────────────────────
      // Prioritize main traces (chip-to-chip)
      for (let i = 0; i < 22; i++) spawnPulse();
    };

    const spawnPulse = () => {
      if (traces.length === 0) return;
      // Weight toward first traces (chip-to-chip routes)
      const maxIdx = Math.min(traces.length - 1, Math.floor(traces.length * 0.6));
      const idx = Math.floor(Math.random() * maxIdx);
      const trace = traces[idx];
      const sLens = segLengths(trace.points);
      const tLen  = sLens.reduce((a, b) => a + b, 0);
      if (tLen < 10) return;
      pulses.push({
        trace,
        t: Math.random() * tLen,
        speed: 0.8 + Math.random() * 1.2,
        color: pick([CYAN, GREEN]),
        reverse: Math.random() > 0.5,
        totalLen: tLen,
        segLens: sLens,
      });
    };

    let frame = 0;

    const draw = () => {
      frame++;

      // Background
      ctx.fillStyle = 'rgb(2, 6, 16)';
      ctx.fillRect(0, 0, W, H);

      // Subtle center glow
      const cg = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W,H)*0.5);
      cg.addColorStop(0, 'rgba(6,182,212,0.05)');
      cg.addColorStop(0.4, 'rgba(15,118,110,0.02)');
      cg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = cg;
      ctx.fillRect(0, 0, W, H);

      // ── DRAW TRACES ──────────────────────────────────────
      traces.forEach((trace) => {
        trace.alphaPhase += trace.alphaSpeed;
        const a = trace.alpha + 0.04 * Math.sin(trace.alphaPhase);
        ctx.beginPath();
        ctx.moveTo(trace.points[0].x, trace.points[0].y);
        for (let i = 1; i < trace.points.length; i++) {
          ctx.lineTo(trace.points[i].x, trace.points[i].y);
        }
        ctx.strokeStyle = `rgba(${trace.color},${a})`;
        ctx.lineWidth = 1;
        ctx.lineJoin = 'miter';
        ctx.stroke();
      });

      // ── DRAW VIAS ─────────────────────────────────────────
      vias.forEach((via) => {
        via.pulse += via.pulseSpeed;
        const p = 0.5 + 0.5 * Math.sin(via.pulse);

        // Glow
        const g = ctx.createRadialGradient(via.x, via.y, 0, via.x, via.y, via.r * 5);
        g.addColorStop(0, `rgba(${CYAN},${0.15 * p})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(via.x, via.y, via.r * 5, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(via.x, via.y, via.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${CYAN},${0.7 * p})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(${CYAN},${0.9 * p})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });

      // ── DRAW CHIPS ────────────────────────────────────────
      chips.forEach((chip) => {
        chip.pulse += chip.pulseSpeed;
        const p = 0.5 + 0.5 * Math.sin(chip.pulse);
        const hw = chip.w / 2;
        const hh = chip.h / 2;

        if (chip.central) {
          // Central CPU — more elaborate
          // Outer glow
          const og = ctx.createRadialGradient(chip.x, chip.y, 0, chip.x, chip.y, hw * 2.5);
          og.addColorStop(0, `rgba(${CYAN},${0.15 * p})`);
          og.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = og;
          ctx.fillRect(chip.x - hw*2.5, chip.y - hh*2.5, hw*5, hh*5);

          // Outer ring
          ctx.strokeStyle = `rgba(${CYAN},${0.15 * p})`;
          ctx.lineWidth = 1;
          ctx.strokeRect(chip.x - hw - 10, chip.y - hh - 10, chip.w + 20, chip.h + 20);

          // Main body fill
          ctx.fillStyle = `rgba(${TEAL},0.12)`;
          ctx.fillRect(chip.x - hw, chip.y - hh, chip.w, chip.h);

          // Main body border
          ctx.strokeStyle = `rgba(${CYAN},${0.5 + 0.3 * p})`;
          ctx.lineWidth = 1.5;
          ctx.strokeRect(chip.x - hw, chip.y - hh, chip.w, chip.h);

          // Inner grid lines (die shot look)
          const gridStep = chip.w / 4;
          ctx.strokeStyle = `rgba(${CYAN},${0.08 * p})`;
          ctx.lineWidth = 0.5;
          for (let gx = 1; gx < 4; gx++) {
            ctx.beginPath();
            ctx.moveTo(chip.x - hw + gx * gridStep, chip.y - hh);
            ctx.lineTo(chip.x - hw + gx * gridStep, chip.y + hh);
            ctx.stroke();
          }
          const gridStepY = chip.h / 4;
          for (let gy = 1; gy < 4; gy++) {
            ctx.beginPath();
            ctx.moveTo(chip.x - hw, chip.y - hh + gy * gridStepY);
            ctx.lineTo(chip.x + hw, chip.y - hh + gy * gridStepY);
            ctx.stroke();
          }

          // Center core glow
          const core = ctx.createRadialGradient(chip.x, chip.y, 0, chip.x, chip.y, hw * 0.4);
          core.addColorStop(0, `rgba(${CYAN},${0.25 * p})`);
          core.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = core;
          ctx.fillRect(chip.x - hw*0.4, chip.y - hh*0.4, hw*0.8, hh*0.8);

          // Label
          ctx.fillStyle = `rgba(${CYAN},${0.6 * p})`;
          ctx.font = `bold ${Math.floor(hw * 0.22)}px monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('CPU', chip.x, chip.y);

          // Corner brackets
          const bLen = 12;
          ctx.strokeStyle = `rgba(${CYAN},${0.7 * p})`;
          ctx.lineWidth = 1.5;
          [[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([sx,sy]) => {
            const bx = chip.x + sx * hw;
            const by = chip.y + sy * hh;
            ctx.beginPath();
            ctx.moveTo(bx, by + sy * bLen);
            ctx.lineTo(bx, by);
            ctx.lineTo(bx + sx * bLen, by);
            ctx.stroke();
          });

        } else {
          // Satellite chip
          ctx.fillStyle = `rgba(${chip.color},0.08)`;
          ctx.fillRect(chip.x - hw, chip.y - hh, chip.w, chip.h);
          ctx.strokeStyle = `rgba(${chip.color},${0.35 + 0.2 * p})`;
          ctx.lineWidth = 1;
          ctx.strokeRect(chip.x - hw, chip.y - hh, chip.w, chip.h);

          // Inner divider line
          ctx.strokeStyle = `rgba(${chip.color},${0.08 * p})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(chip.x - hw, chip.y);
          ctx.lineTo(chip.x + hw, chip.y);
          ctx.stroke();

          // Label
          ctx.fillStyle = `rgba(${chip.color},${0.5 * p})`;
          ctx.font = `bold ${Math.floor(Math.min(hw, hh) * 0.35)}px monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(chip.label, chip.x, chip.y);
        }
      });

      // ── DRAW PULSES ───────────────────────────────────────
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        pulse.t += pulse.reverse ? -pulse.speed : pulse.speed;

        if (pulse.t > pulse.totalLen) {
          if (pulse.reverse) pulse.t = pulse.totalLen;
          else pulse.t = 0;
          // small chance to respawn on a different trace
          if (Math.random() > 0.7) {
            pulses.splice(i, 1);
            spawnPulse();
            continue;
          }
          pulse.reverse = !pulse.reverse;
        }
        if (pulse.t < 0) {
          pulse.t = 0;
          pulse.reverse = !pulse.reverse;
        }

        const pos  = pointOnPoly(pulse.trace.points, pulse.segLens, pulse.t);
        const trailDist = Math.min(pulse.totalLen * 0.15, 60);
        const trailT = Math.max(0, Math.min(pulse.totalLen, pulse.t - (pulse.reverse ? -trailDist : trailDist)));
        const trailPos = pointOnPoly(pulse.trace.points, pulse.segLens, trailT);

        // Trail
        const tr = ctx.createLinearGradient(trailPos.x, trailPos.y, pos.x, pos.y);
        tr.addColorStop(0, `rgba(${pulse.color},0)`);
        tr.addColorStop(1, `rgba(${pulse.color},0.9)`);
        ctx.beginPath();
        ctx.moveTo(trailPos.x, trailPos.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = tr;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Head glow
        const hg = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, 10);
        hg.addColorStop(0, `rgba(${pulse.color},0.8)`);
        hg.addColorStop(1, `rgba(${pulse.color},0)`);
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = hg;
        ctx.fill();

        // Head dot
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${pulse.color},1)`;
        ctx.fill();
      }

      // Vignette
      const vig = ctx.createRadialGradient(W/2, H/2, H*0.15, W/2, H/2, H*0.9);
      vig.addColorStop(0, 'rgba(2,6,16,0)');
      vig.addColorStop(1, 'rgba(2,6,16,0.8)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, W, H);

      if (pulses.length < 22 && frame % 50 === 0) spawnPulse();

      animationId = requestAnimationFrame(draw);
    };

    init();
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

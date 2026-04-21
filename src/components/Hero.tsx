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

    // Aurora orbs — slow drifting gradient blobs
    interface Orb {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      hue: number;
      hueSpeed: number;
      opacity: number;
    }

    const orbs: Orb[] = [
      { x: W * 0.2,  y: H * 0.3,  r: W * 0.38, vx: 0.18,  vy: 0.12,  hue: 185, hueSpeed: 0.04,  opacity: 0.28 },
      { x: W * 0.75, y: H * 0.6,  r: W * 0.32, vx: -0.14, vy: -0.10, hue: 260, hueSpeed: 0.035, opacity: 0.22 },
      { x: W * 0.5,  y: H * 0.85, r: W * 0.28, vx: 0.10,  vy: -0.15, hue: 160, hueSpeed: 0.05,  opacity: 0.20 },
      { x: W * 0.85, y: H * 0.15, r: W * 0.25, vx: -0.12, vy: 0.18,  hue: 210, hueSpeed: 0.03,  opacity: 0.18 },
      { x: W * 0.1,  y: H * 0.75, r: W * 0.22, vx: 0.16,  vy: -0.08, hue: 290, hueSpeed: 0.045, opacity: 0.16 },
    ];

    // Stars / deep space particles
    interface Star {
      x: number;
      y: number;
      r: number;
      alpha: number;
      twinkleSpeed: number;
      twinklePhase: number;
    }

    const stars: Star[] = Array.from({ length: 180 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.2,
      alpha: 0.2 + Math.random() * 0.6,
      twinkleSpeed: 0.005 + Math.random() * 0.015,
      twinklePhase: Math.random() * Math.PI * 2,
    }));

    let time = 0;

    const draw = () => {
      time += 0.005;

      // Deep space base
      ctx.fillStyle = 'rgb(4, 6, 18)';
      ctx.fillRect(0, 0, W, H);

      // Draw aurora orbs
      orbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;
        orb.hue += orb.hueSpeed;

        // Soft bounce
        if (orb.x < -orb.r * 0.5) orb.vx = Math.abs(orb.vx);
        if (orb.x > W + orb.r * 0.5) orb.vx = -Math.abs(orb.vx);
        if (orb.y < -orb.r * 0.5) orb.vy = Math.abs(orb.vy);
        if (orb.y > H + orb.r * 0.5) orb.vy = -Math.abs(orb.vy);

        const pulse = 1 + 0.08 * Math.sin(time * 1.2 + orb.hue);
        const r = orb.r * pulse;

        const g = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, r);
        g.addColorStop(0,   `hsla(${orb.hue}, 85%, 65%, ${orb.opacity})`);
        g.addColorStop(0.4, `hsla(${orb.hue + 30}, 80%, 55%, ${orb.opacity * 0.6})`);
        g.addColorStop(1,   `hsla(${orb.hue + 60}, 70%, 40%, 0)`);

        ctx.beginPath();
        ctx.arc(orb.x, orb.y, r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      });

      // Noise overlay to blend orbs (multiple semi-transparent passes)
      ctx.globalCompositeOperation = 'source-over';

      // Draw stars
      stars.forEach((star) => {
        star.twinklePhase += star.twinkleSpeed;
        const alpha = star.alpha * (0.5 + 0.5 * Math.sin(star.twinklePhase));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();
      });

      // Subtle dark vignette to make text readable
      const vignette = ctx.createRadialGradient(W / 2, H / 2, H * 0.1, W / 2, H / 2, H * 0.85);
      vignette.addColorStop(0, 'rgba(4, 6, 18, 0)');
      vignette.addColorStop(1, 'rgba(4, 6, 18, 0.65)');
      ctx.fillStyle = vignette;
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
        style={{ background: 'rgb(4, 6, 18)' }}
      />

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-950 to-transparent" />

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

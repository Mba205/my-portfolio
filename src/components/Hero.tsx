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
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Node types: hub (major city/server), node (minor), attacker (red threat)
    const NODE_COUNT = 60;
    const ATTACKER_COUNT = 8;
    const CONNECTION_DISTANCE = 160;

    interface Node {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      type: 'hub' | 'node' | 'attacker';
      radius: number;
      pulsePhase: number;
      pulseSpeed: number;
    }

    interface Packet {
      fromIdx: number;
      toIdx: number;
      progress: number;
      speed: number;
      isAttack: boolean;
    }

    const nodes: Node[] = [];
    const packets: Packet[] = [];

    // Create normal nodes
    for (let i = 0; i < NODE_COUNT; i++) {
      const isHub = i < 8;
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 400 - 200,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        vz: (Math.random() - 0.5) * 0.3,
        type: isHub ? 'hub' : 'node',
        radius: isHub ? 5 : 2.5,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
      });
    }

    // Create attacker nodes
    for (let i = 0; i < ATTACKER_COUNT; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 400 - 200,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        vz: (Math.random() - 0.5) * 0.5,
        type: 'attacker',
        radius: 4,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.05 + Math.random() * 0.05,
      });
    }

    // Spawn packets periodically
    let packetTimer = 0;
    const spawnPacket = () => {
      const attackerIndices = nodes
        .map((n, i) => ({ n, i }))
        .filter(({ n }) => n.type === 'attacker')
        .map(({ i }) => i);

      const hubIndices = nodes
        .map((n, i) => ({ n, i }))
        .filter(({ n }) => n.type === 'hub')
        .map(({ i }) => i);

      const normalIndices = nodes
        .map((n, i) => ({ n, i }))
        .filter(({ n }) => n.type === 'node')
        .map(({ i }) => i);

      // Attack packet: attacker → hub
      if (attackerIndices.length > 0 && hubIndices.length > 0) {
        packets.push({
          fromIdx: attackerIndices[Math.floor(Math.random() * attackerIndices.length)],
          toIdx: hubIndices[Math.floor(Math.random() * hubIndices.length)],
          progress: 0,
          speed: 0.008 + Math.random() * 0.006,
          isAttack: true,
        });
      }

      // Normal traffic packet: node → node
      if (normalIndices.length > 1) {
        const from = Math.floor(Math.random() * normalIndices.length);
        let to = Math.floor(Math.random() * normalIndices.length);
        while (to === from) to = Math.floor(Math.random() * normalIndices.length);
        packets.push({
          fromIdx: normalIndices[from],
          toIdx: normalIndices[to],
          progress: 0,
          speed: 0.004 + Math.random() * 0.004,
          isAttack: false,
        });
      }
    };

    // Project 3D → 2D with perspective
    const project = (x: number, y: number, z: number) => {
      const fov = 500;
      const scale = fov / (fov + z);
      return {
        px: x * scale + (width * (1 - scale)) / 2,
        py: y * scale + (height * (1 - scale)) / 2,
        scale,
      };
    };

    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep dark background
      ctx.fillStyle = 'rgba(2, 8, 20, 1)';
      ctx.fillRect(0, 0, width, height);

      // Subtle radial glow center
      const grad = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.6);
      grad.addColorStop(0, 'rgba(6, 182, 212, 0.04)');
      grad.addColorStop(0.5, 'rgba(16, 185, 129, 0.02)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      time += 0.005;

      // Update nodes
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        node.z += node.vz;
        node.pulsePhase += node.pulseSpeed;

        // Bounce off boundaries
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
        if (node.z < -200 || node.z > 200) node.vz *= -1;
      });

      // Draw connections between nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DISTANCE) {
            const pA = project(a.x, a.y, a.z);
            const pB = project(b.x, b.y, b.z);
            const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.3;

            const isAttackConnection = a.type === 'attacker' || b.type === 'attacker';
            const isHubConnection = a.type === 'hub' || b.type === 'hub';

            let strokeColor: string;
            if (isAttackConnection) {
              strokeColor = `rgba(239, 68, 68, ${alpha * 0.6})`;
            } else if (isHubConnection) {
              strokeColor = `rgba(6, 182, 212, ${alpha * 0.8})`;
            } else {
              strokeColor = `rgba(16, 185, 129, ${alpha * 0.5})`;
            }

            ctx.beginPath();
            ctx.moveTo(pA.px, pA.py);
            ctx.lineTo(pB.px, pB.py);
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = isHubConnection ? 0.8 : 0.4;
            ctx.stroke();
          }
        }
      }

      // Draw packets
      for (let i = packets.length - 1; i >= 0; i--) {
        const packet = packets[i];
        packet.progress += packet.speed;

        if (packet.progress >= 1) {
          packets.splice(i, 1);
          continue;
        }

        const from = nodes[packet.fromIdx];
        const to = nodes[packet.toIdx];
        const pFrom = project(from.x, from.y, from.z);
        const pTo = project(to.x, to.y, to.z);

        const px = pFrom.px + (pTo.px - pFrom.px) * packet.progress;
        const py = pFrom.py + (pTo.py - pFrom.py) * packet.progress;

        // Draw packet trail
        const trailLength = 0.15;
        const trailStart = Math.max(0, packet.progress - trailLength);
        const trailX = pFrom.px + (pTo.px - pFrom.px) * trailStart;
        const trailY = pFrom.py + (pTo.py - pFrom.py) * trailStart;

        const trailGrad = ctx.createLinearGradient(trailX, trailY, px, py);
        if (packet.isAttack) {
          trailGrad.addColorStop(0, 'rgba(239, 68, 68, 0)');
          trailGrad.addColorStop(1, 'rgba(239, 68, 68, 0.9)');
        } else {
          trailGrad.addColorStop(0, 'rgba(6, 182, 212, 0)');
          trailGrad.addColorStop(1, 'rgba(6, 182, 212, 0.9)');
        }

        ctx.beginPath();
        ctx.moveTo(trailX, trailY);
        ctx.lineTo(px, py);
        ctx.strokeStyle = trailGrad;
        ctx.lineWidth = packet.isAttack ? 2 : 1.5;
        ctx.stroke();

        // Packet head glow
        const glowColor = packet.isAttack ? '239, 68, 68' : '6, 182, 212';
        const glowGrad = ctx.createRadialGradient(px, py, 0, px, py, 6);
        glowGrad.addColorStop(0, `rgba(${glowColor}, 1)`);
        glowGrad.addColorStop(1, `rgba(${glowColor}, 0)`);
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();
      }

      // Draw nodes
      nodes.forEach((node) => {
        const p = project(node.x, node.y, node.z);
        const pulse = Math.sin(node.pulsePhase) * 0.4 + 0.6;
        const r = node.radius * p.scale;

        let coreColor: string;
        let glowColor: string;

        if (node.type === 'attacker') {
          coreColor = `rgba(239, 68, 68, ${pulse})`;
          glowColor = '239, 68, 68';
        } else if (node.type === 'hub') {
          coreColor = `rgba(6, 182, 212, ${pulse})`;
          glowColor = '6, 182, 212';
        } else {
          coreColor = `rgba(16, 185, 129, ${pulse * 0.8})`;
          glowColor = '16, 185, 129';
        }

        // Outer glow
        const glow = ctx.createRadialGradient(p.px, p.py, 0, p.px, p.py, r * 4);
        glow.addColorStop(0, `rgba(${glowColor}, ${0.3 * pulse})`);
        glow.addColorStop(1, `rgba(${glowColor}, 0)`);
        ctx.beginPath();
        ctx.arc(p.px, p.py, r * 4, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(p.px, p.py, Math.max(r, 1), 0, Math.PI * 2);
        ctx.fillStyle = coreColor;
        ctx.fill();

        // Hub ring
        if (node.type === 'hub') {
          ctx.beginPath();
          ctx.arc(p.px, p.py, r * 2.5 + pulse * 2, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(6, 182, 212, ${0.2 * pulse})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // Spawn packets every ~60 frames
      packetTimer++;
      if (packetTimer % 30 === 0) spawnPacket();

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
      {/* 3D Cyber Network Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'rgb(2, 8, 20)' }}
      />

      {/* Subtle vignette overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,transparent_40%,rgba(2,8,20,0.7)_100%)]" />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-950 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Greeting badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block"
          >
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="max-w-3xl mx-auto"
          >
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
            Designing secure systems at scale where threat detection, cloud security engineering and risk
            converge.
          </motion.p>

          {/* Legend */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center gap-6 text-xs font-mono"
          >
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
              <span className="text-slate-500">Network Node</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
              <span className="text-slate-500">Threat Actor</span>
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-red-400 inline-block" />
              <span className="text-slate-500">Active Attack</span>
            </span>
          </motion.div>

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
            <a
              href="https://github.com/Mba205"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800 transition-all"
            >
              <Github className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            </a>
            <a
              href="https://linkedin.com/in/mbanonna"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800 transition-all"
            >
              <Linkedin className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            </a>
            <a
              href="mailto:mbanonna@gmail.com"
              className="group p-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800 transition-all"
            >
              <Mail className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            </a>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
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

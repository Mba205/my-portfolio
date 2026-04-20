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
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const handleResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const R = Math.min(W, H) * 0.32; // globe radius
    const CX = W * 0.62; // globe center x — offset right to leave text space
    const CY = H * 0.5;
    let rotY = 0; // auto rotation angle

    // Convert lat/lon to 3D sphere coords
    const latLonTo3D = (lat: number, lon: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      return {
        x: -R * Math.sin(phi) * Math.cos(theta),
        y: R * Math.cos(phi),
        z: R * Math.sin(phi) * Math.sin(theta),
      };
    };

    // Project 3D point to 2D canvas with rotation
    const project = (x: number, y: number, z: number) => {
      // Rotate around Y axis
      const cosR = Math.cos(rotY);
      const sinR = Math.sin(rotY);
      const rx = x * cosR + z * sinR;
      const ry = y;
      const rz = -x * sinR + z * cosR;
      // Perspective
      const fov = 900;
      const scale = fov / (fov + rz);
      return {
        px: CX + rx * scale,
        py: CY + ry * scale,
        scale,
        rz,
      };
    };

    // Major city nodes (lat, lon)
    const cities = [
      { lat: 40.7, lon: -74.0, name: 'New York' },
      { lat: 51.5, lon: -0.1, name: 'London' },
      { lat: 48.8, lon: 2.3, name: 'Paris' },
      { lat: 52.5, lon: 13.4, name: 'Berlin' },
      { lat: 55.7, lon: 37.6, name: 'Moscow' },
      { lat: 35.6, lon: 139.6, name: 'Tokyo' },
      { lat: 31.2, lon: 121.4, name: 'Shanghai' },
      { lat: 22.3, lon: 114.2, name: 'Hong Kong' },
      { lat: 1.3, lon: 103.8, name: 'Singapore' },
      { lat: -33.8, lon: 151.2, name: 'Sydney' },
      { lat: 37.5, lon: 127.0, name: 'Seoul' },
      { lat: 28.6, lon: 77.2, name: 'Delhi' },
      { lat: 19.0, lon: 72.8, name: 'Mumbai' },
      { lat: -23.5, lon: -46.6, name: 'Sao Paulo' },
      { lat: 43.6, lon: -79.3, name: 'Toronto' },
      { lat: 34.0, lon: -118.2, name: 'Los Angeles' },
      { lat: 37.7, lon: -122.4, name: 'San Francisco' },
      { lat: 41.8, lon: -87.6, name: 'Chicago' },
      { lat: 25.2, lon: 55.2, name: 'Dubai' },
      { lat: -26.2, lon: 28.0, name: 'Johannesburg' },
      { lat: 5.6, lon: -0.2, name: 'Accra' }, // Ghana 🇬🇭
      { lat: 6.5, lon: 3.3, name: 'Lagos' },
      { lat: -1.2, lon: 36.8, name: 'Nairobi' },
      { lat: 59.9, lon: 10.7, name: 'Oslo' },
      { lat: 45.4, lon: -75.7, name: 'Ottawa' },
    ];

    // Attack arcs: from → to (attacker index → target index)
    interface Arc {
      fromIdx: number;
      toIdx: number;
      progress: number;
      speed: number;
      active: boolean;
      color: string;
      trailPoints: { x: number; y: number; alpha: number }[];
    }

    const arcs: Arc[] = [];
    let arcTimer = 0;

    // Attacker cities (suspicious origins)
    const attackerCities = [0, 5, 6, 13, 19]; // NY, Tokyo, Shanghai, Sao Paulo, Joburg as "attackers"
    // Target cities (critical infrastructure hubs)
    const targetCities = [1, 2, 3, 9, 16, 20]; // London, Paris, Berlin, Sydney, SF, Accra

    const spawnArc = () => {
      const from = attackerCities[Math.floor(Math.random() * attackerCities.length)];
      let to = targetCities[Math.floor(Math.random() * targetCities.length)];
      while (to === from) to = targetCities[Math.floor(Math.random() * targetCities.length)];
      arcs.push({
        fromIdx: from,
        toIdx: to,
        progress: 0,
        speed: 0.003 + Math.random() * 0.003,
        active: true,
        color: Math.random() > 0.3 ? '#ef4444' : '#f97316',
        trailPoints: [],
      });
    };

    // Draw globe grid (latitude/longitude lines)
    const drawGlobe = () => {
      // Draw latitude lines
      for (let lat = -80; lat <= 80; lat += 20) {
        ctx.beginPath();
        let first = true;
        for (let lon = -180; lon <= 180; lon += 3) {
          const p3 = latLonTo3D(lat, lon);
          const { px, py, rz } = project(p3.x, p3.y, p3.z);
          const alpha = rz > 0 ? 0.08 : 0.03;
          if (first) {
            ctx.moveTo(px, py);
            first = false;
          } else {
            ctx.lineTo(px, py);
          }
        }
        ctx.strokeStyle = `rgba(6, 182, 212, 0.12)`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Draw longitude lines
      for (let lon = -180; lon < 180; lon += 20) {
        ctx.beginPath();
        let first = true;
        for (let lat = -90; lat <= 90; lat += 3) {
          const p3 = latLonTo3D(lat, lon);
          const { px, py, rz } = project(p3.x, p3.y, p3.z);
          if (first) {
            ctx.moveTo(px, py);
            first = false;
          } else {
            ctx.lineTo(px, py);
          }
        }
        ctx.strokeStyle = `rgba(6, 182, 212, 0.12)`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }

      // Globe outline glow
      const globeGrad = ctx.createRadialGradient(CX - R * 0.3, CY - R * 0.3, R * 0.1, CX, CY, R * 1.1);
      globeGrad.addColorStop(0, 'rgba(6, 182, 212, 0.05)');
      globeGrad.addColorStop(0.7, 'rgba(6, 182, 212, 0.02)');
      globeGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.beginPath();
      ctx.arc(CX, CY, R, 0, Math.PI * 2);
      ctx.fillStyle = globeGrad;
      ctx.fill();

      // Globe rim
      ctx.beginPath();
      ctx.arc(CX, CY, R, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Atmosphere glow
      const atmGrad = ctx.createRadialGradient(CX, CY, R * 0.9, CX, CY, R * 1.15);
      atmGrad.addColorStop(0, 'rgba(6, 182, 212, 0.0)');
      atmGrad.addColorStop(0.5, 'rgba(6, 182, 212, 0.06)');
      atmGrad.addColorStop(1, 'rgba(6, 182, 212, 0.0)');
      ctx.beginPath();
      ctx.arc(CX, CY, R * 1.15, 0, Math.PI * 2);
      ctx.fillStyle = atmGrad;
      ctx.fill();
    };

    // Draw city nodes
    const drawCities = () => {
      cities.forEach((city, idx) => {
        const p3 = latLonTo3D(city.lat, city.lon);
        const { px, py, rz, scale } = project(p3.x, p3.y, p3.z);

        const isVisible = rz < R * 0.3; // only draw on front face
        if (!isVisible) return;

        const isAttacker = attackerCities.includes(idx);
        const isTarget = targetCities.includes(idx);
        const isAccra = city.name === 'Accra';

        const color = isAttacker ? '#ef4444' : isAccra ? '#f59e0b' : '#06b6d4';
        const dotR = (isAccra ? 5 : isAttacker || isTarget ? 4 : 2.5) * scale;
        const alpha = 0.7 + 0.3 * (1 - rz / R);

        // Glow
        const glow = ctx.createRadialGradient(px, py, 0, px, py, dotR * 4);
        glow.addColorStop(0, `${color}55`);
        glow.addColorStop(1, `${color}00`);
        ctx.beginPath();
        ctx.arc(px, py, dotR * 4, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Dot
        ctx.beginPath();
        ctx.arc(px, py, dotR, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = alpha;
        ctx.fill();
        ctx.globalAlpha = 1;

        // Pulse ring for targets and Accra
        if (isTarget || isAttacker || isAccra) {
          const pulseR = dotR * 3 + Math.sin(Date.now() * 0.005 + idx) * dotR;
          ctx.beginPath();
          ctx.arc(px, py, pulseR, 0, Math.PI * 2);
          ctx.strokeStyle = `${color}44`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });
    };

    // Draw attack arcs using great circle interpolation
    const drawArcs = () => {
      arcs.forEach((arc, i) => {
        const from = cities[arc.fromIdx];
        const to = cities[arc.toIdx];

        const p3From = latLonTo3D(from.lat, from.lon);
        const p3To = latLonTo3D(to.lat, to.lon);

        // Great circle: interpolate via slerp
        const steps = 80;
        const drawUpTo = Math.floor(arc.progress * steps);

        if (drawUpTo < 2) return;

        // Dot product for slerp
        const dot = (p3From.x * p3To.x + p3From.y * p3To.y + p3From.z * p3To.z) / (R * R);
        const omega = Math.acos(Math.max(-1, Math.min(1, dot)));

        ctx.beginPath();
        let started = false;

        for (let s = 0; s <= drawUpTo; s++) {
          const t = s / steps;
          let ix: number, iy: number, iz: number;

          if (Math.abs(omega) < 0.001) {
            ix = p3From.x;
            iy = p3From.y;
            iz = p3From.z;
          } else {
            const sinOmega = Math.sin(omega);
            const w1 = Math.sin((1 - t) * omega) / sinOmega;
            const w2 = Math.sin(t * omega) / sinOmega;
            ix = w1 * p3From.x + w2 * p3To.x;
            iy = w1 * p3From.y + w2 * p3To.y;
            iz = w1 * p3From.z + w2 * p3To.z;
          }

          // Arc elevation — lift arc off globe surface
          const elevation = 1 + 0.35 * Math.sin(t * Math.PI);
          ix *= elevation;
          iy *= elevation;
          iz *= elevation;

          const { px, py, rz } = project(ix, iy, iz);

          // Fade if behind globe
          if (rz > R * 0.5) continue;

          if (!started) {
            ctx.moveTo(px, py);
            started = true;
          } else {
            ctx.lineTo(px, py);
          }
        }

        // Trail gradient: fade from transparent to bright at head
        const progress = arc.progress;
        ctx.strokeStyle = arc.color;
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.7;
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Bright head dot
        const headT = drawUpTo / steps;
        if (headT > 0) {
          const sinOmega2 = Math.sin(omega);
          const w1h = sinOmega2 > 0.001 ? Math.sin((1 - headT) * omega) / sinOmega2 : 1;
          const w2h = sinOmega2 > 0.001 ? Math.sin(headT * omega) / sinOmega2 : 0;
          const hx = (w1h * p3From.x + w2h * p3To.x) * (1 + 0.35 * Math.sin(headT * Math.PI));
          const hy = (w1h * p3From.y + w2h * p3To.y) * (1 + 0.35 * Math.sin(headT * Math.PI));
          const hz = (w1h * p3From.z + w2h * p3To.z) * (1 + 0.35 * Math.sin(headT * Math.PI));
          const { px: hpx, py: hpy } = project(hx, hy, hz);

          const headGlow = ctx.createRadialGradient(hpx, hpy, 0, hpx, hpy, 8);
          headGlow.addColorStop(0, arc.color + 'ff');
          headGlow.addColorStop(1, arc.color + '00');
          ctx.beginPath();
          ctx.arc(hpx, hpy, 8, 0, Math.PI * 2);
          ctx.fillStyle = headGlow;
          ctx.fill();
        }

        arc.progress += arc.speed;
        if (arc.progress > 1) arcs.splice(i, 1);
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // Background
      ctx.fillStyle = 'rgb(2, 8, 20)';
      ctx.fillRect(0, 0, W, H);

      // Subtle bg glow left side (behind text)
      const bgGlow = ctx.createRadialGradient(W * 0.2, H * 0.5, 0, W * 0.2, H * 0.5, W * 0.4);
      bgGlow.addColorStop(0, 'rgba(6, 182, 212, 0.03)');
      bgGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, W, H);

      rotY += 0.002;

      drawGlobe();
      drawArcs();
      drawCities();

      // Spawn arcs
      arcTimer++;
      if (arcTimer % 90 === 0 && arcs.length < 12) spawnArc();
      if (arcs.length === 0) spawnArc();

      animationId = requestAnimationFrame(draw);
    };

    // Initial arcs
    for (let i = 0; i < 4; i++) spawnArc();
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
        style={{ background: 'rgb(2, 8, 20)' }}
      />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-950 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <span className="px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-mono">
                &gt; Security Professional
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl sm:text-6xl lg:text-7xl tracking-tight"
            >
              <span className="block text-slate-400 text-2xl sm:text-3xl lg:text-4xl mb-4">Hello, I'm</span>
              <span className="block bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
                Mba Nonna
              </span>
            </motion.h1>

            {/* Tagline */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <p className="text-xl sm:text-2xl text-slate-300 font-mono">
                Cybersecurity | Cloud Security | Security Engineering
              </p>
            </motion.div>

            {/* Description */}
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
              className="text-lg text-slate-400 max-w-xl">
              Designing secure systems at scale where threat detection, cloud security engineering and risk converge.
            </motion.p>

            {/* Legend */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              className="flex items-center gap-5 text-xs font-mono">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                <span className="text-slate-500">Network Hub</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                <span className="text-slate-500">Threat Origin</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                <span className="text-slate-500">Home</span>
              </span>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-col sm:flex-row items-start gap-4 pt-4"
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
              className="flex items-center gap-6"
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
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, repeat: Infinity, repeatType: 'reverse', duration: 1.5 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10"
      >
        <ChevronDown className="w-6 h-6 text-cyan-400" />
      </motion.div>
    </section>
  );
}

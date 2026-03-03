import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import { Shield, Lock, Database, Cloud, Terminal, Network, Download } from 'lucide-react';
import profilePhoto from 'figma:asset/b3329f9417ce87c8988e6b38aac0b2095b41537b.png';

export function About() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const skills = [
    { name: 'Threat Detection & Security Analytics', icon: Shield },
    { name: 'Offensive Security & Adversary Techniques', icon: Terminal },
    { name: 'Network Security Monitoring & Defense', icon: Network },
    { name: 'Cloud Security Engineering (AWS, Azure)', icon: Cloud },
    { name: 'Security Engineering & System Architecture', icon: Database },
    { name: 'Governance, Risk & Compliance (GRC)', icon: Lock },
  ];

  return (
    <section id="about" className="relative py-20 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl text-slate-100">
              About Me
            </h2>
            <div className="mt-4 h-1 w-24 bg-gradient-to-r from-cyan-500 to-emerald-500 mx-auto rounded-full" />
          </div>

          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Left Column - Image, Core Competencies, and Resume Button */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              {/* Image */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-2xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity" />
                <div className="relative rounded-2xl overflow-hidden border border-cyan-500/20 group-hover:border-cyan-500/40 transition-colors">
                  <img
                    src={profilePhoto}
                    alt="Professional headshot"
                    className="w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent opacity-60" />
                </div>
                {/* Decorative corner brackets */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-cyan-400 opacity-60" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-400 opacity-60" />
              </div>

              {/* Core Competencies */}
              <div>
                <h3 className="text-xl text-slate-100 mb-6 font-mono">
                  <span className="text-cyan-400">&gt;</span> Core Competencies
                </h3>
                <div className="space-y-3">
                  {skills.map((skill, index) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={inView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                      className="group flex items-start gap-3 p-4 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all"
                    >
                      <div className="relative mt-1">
                        <skill.icon className="w-5 h-5 text-cyan-400" />
                        <div className="absolute inset-0 bg-cyan-400/20 blur-md group-hover:bg-cyan-400/40 transition-all" />
                      </div>
                      <span className="text-sm text-slate-300 group-hover:text-slate-100 transition-colors">
                        {skill.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Download Resume Button */}
              <motion.a
                href="/Mba_Nonna_Resume.pdf"
                download
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="group flex items-center justify-center gap-2 w-full px-6 py-4 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-600 hover:to-emerald-600 transition-all hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/50"
              >
                <Download className="w-5 h-5 text-white" />
                <span className="text-white font-medium">Download Resume</span>
              </motion.a>
            </motion.div>

            {/* Right Column - About Text */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="space-y-6 text-slate-300">
                <div>
                  <h3 className="text-2xl text-slate-100 mb-4">
                    Small Glitches Today, Big Disasters Tomorrow
                  </h3>
                  <p className="text-lg leading-relaxed">
                    Security fails quietly, until it doesn't. I focus on understanding those failures and designing systems that prevent them.
                  </p>
                </div>

                <p className="text-lg leading-relaxed">
                  I am working toward a career as a cybersecurity analyst and engineer with a strong focus on cloud security. What drives me is analyzing how modern systems are built, where risk is introduced and how security can be intentionally engineered into cloud environments before vulnerabilities become incidents.
                </p>

                <p className="text-lg leading-relaxed">
                  My interest in cybersecurity goes beyond tools and checklists. I am deliberate about building analytical depth by investigating threats, securing infrastructure and thinking critically about how attackers exploit weaknesses at scale. I value security that is practical, resilient and grounded in how real systems operate.
                </p>

                <p className="text-lg leading-relaxed">
                  While my primary focus is technical, I maintain a working understanding of governance and compliance as a supporting layer. This perspective enables me to design and evaluate security controls that are effective, defensible and aligned with real organizational risk.
                </p>

                <p className="text-lg leading-relaxed">
                  Alongside cybersecurity, I have a strong passion for aviation. The discipline, precision and risk awareness it demands closely reflect my approach to security: calm under pressure, detail-oriented and accountable. These principles shape how I learn, build and prepare for high-stakes environments.
                </p>

                <p className="text-lg leading-relaxed">
                  My goal is to grow into a cybersecurity professional who can analyze threats, engineer secure cloud systems and help protect critical digital infrastructure in an increasingly complex threat landscape.
                </p>

                <p className="text-lg leading-relaxed italic text-cyan-400">
                  Every system tells a story. My role is to understand it, question it and secure it.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import { Github, ExternalLink, Shield, FileSearch, Terminal, Network, Lock, FileCheck } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';

export function Projects() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const projects = [
    {
      title: 'SIEM Threat Detection System',
      description: 'Enterprise-grade SIEM implementation with custom correlation rules for advanced threat detection. Integrated log aggregation from 50+ sources with real-time alerting and automated incident triage.',
      image: 'https://images.unsplash.com/photo-1653213096273-4a0ba43fc50a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWN1cml0eSUyMGF1ZGl0JTIwZG9jdW1lbnR8ZW58MXx8fHwxNzY0Njk0MjQyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      tech: ['Splunk', 'ELK Stack', 'Python', 'Threat Intelligence'],
      icon: Shield,
      github: '', // Add your GitHub repo URL here (optional)
      demo: '', // Add link to writeup, demo, or case study
      color: 'from-cyan-500 to-blue-500',
    },
    {
      title: 'Cloud Security Architecture (AWS)',
      description: 'Designed and implemented secure multi-tier cloud architecture on AWS with automated security controls, IAM policies, VPC segmentation, and comprehensive monitoring using AWS Security Hub and GuardDuty.',
      image: 'https://images.unsplash.com/photo-1664526937033-fe2c11f1be25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXR3b3JrJTIwZGlhZ3JhbSUyMGNsb3VkfGVufDF8fHx8MTc2NDY5NDI0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      tech: ['AWS Security', 'CloudFormation', 'GuardDuty', 'IAM'],
      icon: Network,
      github: '', // Add your GitHub repo URL here (optional)
      demo: '', // Add link to architecture diagram or case study
      color: 'from-orange-500 to-red-500',
    },
    {
      title: 'Automated Vulnerability Scanner',
      description: 'Python-based tool for automated vulnerability scanning with integration to CVE databases. Generates detailed reports with risk scoring and remediation recommendations.',
      image: 'https://images.unsplash.com/photo-1613677135043-a2512fbf49fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxweXRob24lMjBjb2RlJTIwdGVybWluYWx8ZW58MXx8fHwxNzY0Njk0MjQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      tech: ['Python', 'Nmap', 'OWASP ZAP', 'Docker'],
      icon: Terminal,
      github: '', // Add your GitHub repo URL here (optional)
      demo: '', // Add link to demo or documentation
      color: 'from-emerald-500 to-teal-500',
    },
    {
      title: 'Security Automation & SOAR Platform',
      description: 'Built automated security orchestration platform for incident response workflows. Integrates with ticketing systems, EDR tools, and threat intelligence feeds for automated threat remediation.',
      image: 'https://images.unsplash.com/photo-1763718528755-4bca23f82ac3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wbGlhbmNlJTIwZGFzaGJvYXJkJTIwYW5hbHl0aWNzfGVufDF8fHx8MTc2NDY5NDI0NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      tech: ['Python', 'REST APIs', 'Ansible', 'Security Orchestration'],
      icon: Network,
      github: '', // Add your GitHub repo URL here (optional)
      demo: '', // Add link to demo or documentation
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Penetration Testing Lab Environment',
      description: 'Comprehensive home lab environment for practicing ethical hacking and red team techniques. Includes vulnerable machines, CTF challenges, and detailed writeups of exploitation methods and security findings.',
      image: 'https://images.unsplash.com/photo-1655036387197-566206c80980?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYWNraW5nJTIwbGFiJTIwY29tcHV0ZXJ8ZW58MXx8fHwxNzY0Njk0MjQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      tech: ['Kali Linux', 'Metasploit', 'Burp Suite', 'HackTheBox'],
      icon: Lock,
      github: '', // Add your GitHub repo URL here (optional)
      demo: '', // Add link to writeups or blog
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Enterprise Security Audit & Compliance',
      description: 'Comprehensive security audit for a financial organization, identifying vulnerabilities and compliance gaps. Delivered detailed risk assessments aligned with NIST, ISO 27001, and SOC 2 frameworks.',
      image: 'https://images.unsplash.com/photo-1764684809022-906c2daa23bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmNpZGVudCUyMHJlc3BvbnNlJTIwc2VjdXJpdHl8ZW58MXx8fHwxNzY0Njk0MjQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      tech: ['NIST Framework', 'ISO 27001', 'Risk Assessment', 'SOC 2'],
      icon: FileCheck,
      github: '', // Leave empty - audit work doesn't have code repos
      demo: '', // Add link to case study or sanitized report (optional)
      color: 'from-indigo-500 to-blue-500',
    },
  ];

  return (
    <section id="projects" className="relative py-20 sm:py-32 bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="mt-4 text-4xl sm:text-5xl text-slate-100">
              Featured Projects
            </h2>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
              A collection of security projects demonstrating my expertise in threat detection, 
              cloud security, security engineering, and compliance auditing.
            </p>
            <div className="mt-4 h-1 w-24 bg-gradient-to-r from-cyan-500 to-emerald-500 mx-auto rounded-full" />
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  transformStyle: 'preserve-3d',
                  perspective: '1000px',
                }}
                whileHover={{
                  scale: 1.05,
                  rotateX: 5,
                  rotateY: 5,
                  z: 50,
                  transition: { duration: 0.3 }
                }}
                className="group relative bg-slate-800/40 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700/50 hover:border-cyan-500/50 transition-all hover:shadow-xl hover:shadow-cyan-500/10"
              >
                {/* Image */}
                <motion.div 
                  className="relative h-48 overflow-hidden"
                  style={{ transformStyle: 'preserve-3d' }}
                  animate={hoveredIndex === index ? { z: 20 } : { z: 0 }}
                >
                  <ImageWithFallback
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
                  
                  {/* Icon Badge */}
                  <motion.div 
                    className={`absolute top-4 right-4 p-3 rounded-lg bg-gradient-to-br ${project.color} shadow-lg`}
                    animate={hoveredIndex === index ? { 
                      scale: 1.2, 
                      rotate: 360,
                      z: 30 
                    } : { 
                      scale: 1, 
                      rotate: 0,
                      z: 0 
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <project.icon className="w-5 h-5 text-white" />
                  </motion.div>
                </motion.div>

                {/* Content */}
                <motion.div 
                  className="p-6 space-y-4"
                  style={{ transformStyle: 'preserve-3d' }}
                  animate={hoveredIndex === index ? { z: 10 } : { z: 0 }}
                >
                  <h3 className="text-xl text-slate-100 group-hover:text-cyan-400 transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-sm text-slate-400 line-clamp-3">
                    {project.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-xs rounded-full bg-slate-900/50 text-cyan-400 border border-cyan-500/30"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-4">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 hover:border-cyan-500/50 transition-all group/btn"
                      >
                        <Github className="w-4 h-4 text-slate-300 group-hover/btn:text-cyan-400 transition-colors" />
                        <span className="text-sm text-slate-300 group-hover/btn:text-cyan-400 transition-colors">Code</span>
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${project.github ? 'flex-1' : 'w-full'} flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 hover:from-cyan-500/20 hover:to-emerald-500/20 border border-cyan-500/30 hover:border-cyan-500/50 transition-all group/btn`}
                      >
                        <ExternalLink className="w-4 h-4 text-cyan-400 transition-colors" />
                        <span className="text-sm text-cyan-400 transition-colors">Learn More</span>
                      </a>
                    )}
                  </div>
                </motion.div>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 border-2 border-cyan-400/0 group-hover:border-cyan-400/20 rounded-xl transition-all pointer-events-none" />
              </motion.div>
            ))}
          </div>

          {/* View More Projects CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-12 p-8 rounded-2xl bg-slate-800/40 border border-slate-700/50"
          >
            <div className="text-center space-y-4">
              <h3 className="text-2xl text-slate-100">Want to See More?</h3>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Explore my complete portfolio of cybersecurity projects, CTF writeups, and security tools on GitHub.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <a
                  href="https://github.com/mbanonna"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-600 transition-all flex items-center gap-2"
                >
                  <Github className="w-5 h-5 text-white" />
                  <span className="text-white">View GitHub Profile</span>
                  <ExternalLink className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </motion.div>

          <div className="text-center mt-12">
            <span className="text-cyan-400 font-mono text-sm">&lt;/projects&gt;</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
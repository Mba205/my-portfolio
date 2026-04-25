import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import { Github, ExternalLink, Shield, FileSearch, Terminal, Cloud, Network, Lock, FileCheck, Code } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useState } from 'react';

export function Projects() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const projects = [
    {
      title: 'SIEM Threat Detection System',
      description: 'Deployed a cloud-based SIEM using Elastic Security to simulate SOC operations. Ingested authentication logs, built KQL brute-force and privilege escalation detection rules, and created investigative daashboards for full alert triage workflows.',
      image: 'https://images.unsplash.com/photo-1653213096273-4a0ba43fc50a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzZWN1cml0eSUyMGF1ZGl0JTIwZG9jdW1lbnR8ZW58MXx8fHwxNzY0Njk0MjQyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      tech: ['Elastic Security', 'Elasticsearch', 'Kibana', 'Python', 'KQL','Detection Engineering'],
      icon: Shield,
      github: 'https://github.com/Mba205/siem-threat-detection-system',
      demo: 'https://drive.google.com/drive/folders/1KlRFmTyGIBf7vuMndxgPS86sSGM2CkTX?usp=sharing',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      title: 'Cloud Security Operations & Governance Lab',
      description: 'Deployed and intentionally misconfigured AWS infrastructure, then identified and remediated security gaps across IAM, S3 and EC2. Implemented CloudTrail logging, GuardDuty monitoring and VPC access controls aligned with AWS security best practices.',
      image: 'https://images.unsplash.com/photo-1664526937033-fe2c11f1be25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXR3b3JrJTIwZGlhZ3JhbSUyMGNsb3VkfGVufDF8fHx8MTc2NDY5NDI0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      tech: ['AWS (IAM, EC2, S3, CloudTrail, GuardDuty, VPC)', 'Cloud Security', 'Risk Analysis', 'Access Control', 'Logging', 'Misconfiguration Remediation'],
      icon: Cloud,
      github: '',
      demo: 'https://drive.google.com/drive/folders/1iO2Lacek5TJ4twnCoW0FVVhtL2QXW14h?usp=sharing',
      color: 'from-orange-500 to-red-500',
    },
    {
      title: 'Security Automation Toolkit',
      description: 'Built a Python toolkit that automates SOC investigation tasks; enriching IP intelligence via threat APIs, performing controlled port checks and generating structured JSON reports to accelerate incident response workflows.',
      image: 'https://images.unsplash.com/photo-1613677135043-a2512fbf49fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxweXRob24lMjBjb2RlJTIwdGVybWluYWx8ZW58MXx8fHwxNzY0Njk0MjQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      tech: ['Python', 'Git', 'JSON', 'Security Automation', 'Threat Intelligence APIs', 'Network Security'],
      icon: Terminal,
      github: 'https://github.com/Mba205/security-automation-toolkit',
      demo: 'https://drive.google.com/drive/folders/1m85JJ4y_ttHowUYmYyyjgti_tQjZkCCn?usp=sharing',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      title: 'IAM Security & Privilege Escalation Lab',
      description: 'Exploited three AWS privilege escalation paths; including PassRole misuse and wildcard policy abuse to achieve admin access from a low-privilege account. Traced the full attack chain via CloudTrail, then remediated using SCPs, permission boundaries and least privilege policies.',
      image: 'https://images.unsplash.com/photo-1763718528755-4bca23f82ac3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wbGlhbmNlJTIwZGFzaGJvYXJkJTIwYW5hbHl0aWNzfGVufDF8fHx8MTc2NDY5NDI0NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      tech: ['AWS IAM', 'IAM Policies & Roles', 'Service Control Policies', 'AWS CLI', 'CloudTrail', 'Privilege Escalation', 'Permission Boundaries'],
      icon: Lock,
      github: 'https://github.com/Mba205/iam-security-and-privilege-escalation-lab',
      demo: 'https://drive.google.com/drive/folders/1wp9SQwtfsMkrZKP3vxOMibajqLOs3d0i?usp=sharing',
      color: 'from-purple-500 to-pink-500',
    },
    {
      title: 'Secure Infrastructure as Code (Terraform)',
      description: 'Provisioned a secure AWS environment using Terraform; including a custom VPC, subnet and security group with SSH restricted to a single IP. Managed the full infrastructure lifecycle: deploy, verify and destroy, applying secure-by-design IaC principles throughout.',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RlJTIwdGVybWluYWwlMjBzY3JlZW58ZW58MXx8fHwxNzY0Njk0MjQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      tech: ['Terraform', 'Infrastructure as Code (IaC)', 'AWS (EC2, VPC, IAM)', 'Access Control', 'Cloud Security', 'Network Security'],
      icon: Code,
      github: 'https://github.com/Mba205/secure-iac-terraform',
      demo: 'https://drive.google.com/drive/folders/1odw8omZ0_1dZRRYNuwyv9MlrvB8_JiGC?usp=sharing',
      color: 'from-green-500 to-emerald-500',
    },
    {
      title: 'Network Security Analysis',
      description: 'Captured and analyzed live network traffic using Wireshark and Zeek to detect C2 communication, port scanning and DNS tunneling. Mapped findings to MITRE ATT&CK techniques and documented detection rules for firewall and IDS hardening',
      image: 'https://images.unsplash.com/photo-1764684809022-906c2daa23bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmNpZGVudCUyMHJlc3BvbnNlJTIwc2VjdXJpdHl8ZW58MXx8fHwxNzY0Njk0MjQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      tech: ['Wireshark', 'Zeek', 'PCAP Analysis', 'TCP/IP', 'DNS Analysis', 'MITRE ATT&CK', 'BPF Filters', 'Intrusion Detection'],
      icon: Network,
      github: 'https://github.com/Mba205/network-traffic-analysis',
      demo: 'https://drive.google.com/drive/folders/1GZ13yEcuQ-n_yq_xDgyWoIa6LsWQeTaX?usp=sharing',
      color: 'from-indigo-500 to-blue-500',
    },
  ];

  const CHAR_LIMIT = 100;

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
            {projects.map((project, index) => {
              const isExpanded = expandedIndex === index;
              const isLong = project.description.length > CHAR_LIMIT;

              return (
                <motion.div
                  key={project.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  whileHover={{
                    scale: 1.05,
                    y: -8,
                    transition: { duration: 0.3 }
                  }}
                  className="group relative bg-slate-800/40 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700/50 hover:border-cyan-500/50 transition-all hover:shadow-xl hover:shadow-cyan-500/10"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
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
                      } : { 
                        scale: 1, 
                        rotate: 0,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <project.icon className="w-5 h-5 text-white" />
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-4">
                    <h3 className="text-xl text-slate-100 group-hover:text-cyan-400 transition-colors">
                      {project.title}
                    </h3>
                    
                    {/* Description with read more */}
                    <p className="text-sm text-slate-400">
                      {isExpanded || !isLong
                        ? project.description
                        : project.description.slice(0, CHAR_LIMIT).trimEnd() + '...'}
                      {isLong && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedIndex(isExpanded ? null : index);
                          }}
                          className="ml-1 text-cyan-400 hover:text-cyan-300 transition-colors font-medium focus:outline-none"
                        >
                          {isExpanded ? ' less' : ' more'}
                        </button>
                      )}
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
                          <span className="text-sm text-cyan-400 transition-colors">View</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 border-2 border-cyan-400/0 group-hover:border-cyan-400/20 rounded-xl transition-all pointer-events-none" />
                </motion.div>
              );
            })}
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
                  href="https://github.com/Mba205"
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

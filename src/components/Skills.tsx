import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import { 
  Shield, 
  Network, 
  AlertTriangle, 
  Cloud, 
  Terminal, 
  FileCheck,
  Lock,
  Database,
  Code,
  Server,
  GitBranch,
  Cpu,
  Eye,
  Layers,
  Zap,
  Search,
  Key,
} from 'lucide-react';

export function Skills() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const skillCategories = [
    {
      title: 'Cloud Security Engineering',
      icon: Cloud,
      color: 'from-cyan-400 to-blue-500',
      skills: [
        'AWS Security Services (GuardDuty, CloudTrail, Config)',
        'IAM — Policies, Roles & Permission Boundaries',
        'Privilege Escalation Detection & Remediation',
        'Infrastructure as Code Security (Terraform)',
        'Cloud Misconfiguration Analysis & Hardening',
        'Zero Trust Architecture & VPC Design',
        'Container & Kubernetes Security',
        'CSPM — Cloud Security Posture Management',
      ],
    },
    {
      title: 'Security Engineering',
      icon: Shield,
      color: 'from-emerald-400 to-teal-600',
      skills: [
        'SIEM Design & Detection Engineering',
        'Threat Detection Rule Development (KQL)',
        'Alert Triage & Incident Response Workflows',
        'Vulnerability Assessment & Remediation',
        'MITRE ATT&CK Framework',
        'Penetration Testing Fundamentals',
        'Security Architecture & Design Reviews',
        'Threat Modeling',
      ],
    },
    {
      title: 'AI Security Engineering (In Progress)',
      icon: Cpu,
      color: 'from-violet-400 to-purple-600',
      skills: [
        'AI/ML System Security Assessment',
        'Prompt Injection Detection & Mitigation',
        'Adversarial Attack Analysis',
        'Model Poisoning & Data Integrity Attacks',
        'LLM Security Research',
        'AI Supply Chain Risk Management',
        'MITRE ATLAS Framework',
      ],
    },
    {
      title: 'Network Security',
      icon: Network,
      color: 'from-orange-400 to-red-500',
      skills: [
        'Packet Capture & Traffic Analysis (Wireshark, Zeek)',
        'Intrusion Detection & Anomaly Detection',
        'TCP/IP & DNS Protocol Analysis',
        'C2 Communication Pattern Detection',
        'Firewall & IDS Rule Development',
        'Network Segmentation & Architecture',
      ],
    },
    {
      title: 'Security Automation & Development',
      icon: Code,
      color: 'from-yellow-400 to-amber-500',
      skills: [
        'Python — Security Tooling & Automation',
        'Threat Intelligence API Integration',
        'Security Pipeline Automation',
        'Bash & PowerShell Scripting',
        'AWS CLI for Security Operations',
      ],
    },
    {
      title: 'Governance, Risk & Compliance',
      icon: FileCheck,
      color: 'from-rose-400 to-pink-600',
      skills: [
        'ISO 27001:2022 (Lead Auditor Certified)',
        'NIST Cybersecurity Framework',
        'SOC 2 & SOX 404 Compliance',
        'HIPAA & GDPR',
        'Third-Party Risk Management',
        'Security Audit Planning & Execution',
      ],
    },
  ];

  const tools = [
    { name: 'Elastic Security', icon: Shield, color: 'text-cyan-400' },
    { name: 'Wireshark', icon: Network, color: 'text-emerald-400' },
    { name: 'Zeek', icon: Eye, color: 'text-violet-400' },
    { name: 'Terraform', icon: Layers, color: 'text-orange-400' },
    { name: 'AWS CLI', icon: Cloud, color: 'text-yellow-400' },
    { name: 'Python', icon: Code, color: 'text-rose-400' },
    { name: 'CloudTrail', icon: Database, color: 'text-cyan-400' },
    { name: 'GuardDuty', icon: AlertTriangle, color: 'text-emerald-400' },
    { name: 'Nmap', icon: Server, color: 'text-orange-400' },
    { name: 'Splunk', icon: Zap, color: 'text-yellow-400' },
    { name: 'Git', icon: GitBranch, color: 'text-rose-400' },
    { name: 'Palo Alto', icon: Shield, color: 'text-cyan-400' },
    { name: 'CrowdStrike', icon: Lock, color: 'text-emerald-400' },
  ];

  return (
    <section id="skills" className="relative py-20 sm:py-32 bg-slate-900/30">
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
              Technical Skills
            </h2>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
              Comprehensive expertise across cybersecurity domains, from security engineering foundations to cloud and AI security.
            </p>
            <div className="mt-4 h-1 w-24 bg-gradient-to-r from-cyan-500 to-emerald-500 mx-auto rounded-full" />
          </div>

          {/* Skills Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {skillCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                className="group p-5 rounded-xl bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 hover:border-cyan-500/50 transition-all"
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`relative p-2.5 rounded-lg bg-gradient-to-br ${category.color}`}>
                    <category.icon className="w-5 h-5 text-white" />
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} blur-lg opacity-50 rounded-lg`} />
                  </div>
                  <h3 className="text-lg text-slate-100 group-hover:text-cyan-400 transition-colors">
                    {category.title}
                  </h3>
                </div>

                {/* Skills List */}
                <ul className="space-y-2">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.li
                      key={skill}
                      initial={{ opacity: 0, x: -20 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.4, delay: categoryIndex * 0.1 + skillIndex * 0.03 }}
                      className="flex items-start gap-2 text-sm text-slate-300"
                    >
                      <span className="text-cyan-400 mt-1">•</span>
                      <span>{skill}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Tools & Technologies */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="p-8 rounded-xl bg-gradient-to-br from-slate-800/60 to-slate-800/40 border border-slate-700/50"
          >
            <h3 className="text-2xl text-slate-100 mb-6 text-center">
              Tools & Technologies
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {tools.map((tool, index) => (
                <motion.div
                  key={tool.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.7 + index * 0.05 }}
                  className="group flex items-center gap-2 px-5 py-3 rounded-lg bg-slate-700/50 border border-slate-600/50 hover:border-cyan-500/50 hover:bg-slate-700 transition-all hover:scale-105"
                >
                  <tool.icon className={`w-5 h-5 ${tool.color}`} />
                  <span className="text-slate-300 group-hover:text-cyan-400 transition-colors">
                    {tool.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="text-center mt-16">
            <span className="text-cyan-400 font-mono text-sm">&lt;/skills&gt;</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import { 
  Shield, 
  Network, 
  AlertTriangle, 
  Cloud, 
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
      color: 'from-cyan-500 to-blue-500',
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
      title: 'Security Engineering & Operations',
      icon: Shield,
      color: 'from-lime-400 to-emerald-500',
      skills: [
        'SIEM Design & Detection Engineering (KQL)',
        'Threat Detection, Alert Triage & Incident Response',
        'Vulnerability Assessment & Remediation',
        'MITRE ATT&CK Framework',
        'Penetration Testing Fundamentals',
        'Security Architecture & Threat Modeling',
        'Python & Bash Security Automation',
        'Threat Intelligence API Integration',
      ],
    },
    {
      title: 'AI Security Engineering',
      icon: Cpu,
      color: 'from-fuchsia-500 to-pink-500',
      skills: [
        'AI/ML System Security Assessment',
        'Prompt Injection Detection & Mitigation',
        'Adversarial Attack Analysis',
        'Model Poisoning & Data Integrity Attacks',
        'LLM Security Research',
        'AI Supply Chain Risk Management',
        'MITRE ATLAS Framework',
        'Secure AI Product Design Reviews',
      ],
    },
    {
      title: 'Network Security',
      icon: Network,
      color: 'from-orange-500 to-red-500',
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
      title: 'Systems & Infrastructure',
      icon: Server,
      color: 'from-violet-500 to-purple-500',
      skills: [
        'Linux System Administration & Hardening',
        'Windows Server & Active Directory Security',
        'Endpoint Security & EDR Concepts',
        'System Logging & Audit Configuration',
        'Bash & PowerShell Scripting',
        'Access Control & Privilege Management',
      ],
    },
    {
      title: 'Governance, Risk & Compliance',
      icon: FileCheck,
      color: 'from-indigo-500 to-blue-600',
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
    { name: 'Zeek', icon: Eye, color: 'text-orange-400' },
    { name: 'Terraform', icon: Layers, color: 'text-orange-400' },
    { name: 'AWS CLI', icon: Cloud, color: 'text-cyan-400' },
    { name: 'Python', icon: Code, color: 'text-violet-400' },
    { name: 'CloudTrail', icon: Database, color: 'text-cyan-400' },
    { name: 'GuardDuty', icon: AlertTriangle, color: 'text-emerald-400' },
    { name: 'Nmap', icon: Server, color: 'text-orange-400' },
    { name: 'Splunk', icon: Zap, color: 'text-violet-400' },
    { name: 'Git', icon: GitBranch, color: 'text-emerald-400' },
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
                {/* Category Header — exact original pattern */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`relative p-2.5 rounded-lg bg-gradient-to-br ${category.color}`}>
                    <category.icon className="w-5 h-5 text-white" />
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} blur-lg opacity-50`} />
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

          {/* Core Competencies */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: Cloud, label: 'Cloud Security Engineering', color: 'text-cyan-400' },
              { icon: Cpu, label: 'AI Security Engineering', color: 'text-fuchsia-800' },
              { icon: Shield, label: 'Threat Detection & Response', color: 'text-emerald-400' },
              { icon: Lock, label: 'Zero Trust & Access Control', color: 'text-orange-400' },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                className="flex flex-col items-center gap-3 p-6 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-cyan-500/30 transition-all text-center"
              >
                <item.icon className={`w-8 h-8 ${item.color}`} />
                <span className="text-sm text-slate-300">{item.label}</span>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-16">
            <span className="text-cyan-400 font-mono text-sm">&lt;/skills&gt;</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

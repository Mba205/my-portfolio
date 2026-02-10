import { motion } from 'motion/react';
import { useInView } from 'react-intersection-observer';
import { Briefcase, Award, Calendar, MapPin, ExternalLink } from 'lucide-react';

export function Experience() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const experiences = [
    {
      title: 'Cybersecurity Analyst Intern',
      organization: 'KPMG',
      location: 'Ghana',
      period: 'Sept 2025 - Nov 2025',
      description: [
        'Monitor security events and investigate potential threats using SIEM platforms (Splunk, ELK)',
        'Perform threat hunting activities and analyze security logs to identify malicious activity',
        'Conduct vulnerability assessments and penetration testing on enterprise systems',
        'Respond to security incidents and coordinate remediation efforts with cross-functional teams',
      ],
      color: 'from-cyan-500 to-blue-500',
      visible: true,
    },
    {
      title: 'Cybersecurity Engineer',
      organization: 'TechDefense Corp',
      location: 'New York, NY',
      period: 'Jan 2025 - May 2025',
      description: ['Hidden for now'],
      color: 'from-emerald-500 to-teal-500',
      visible: false,
    },
    {
      title: 'Cloud Security Specialist',
      organization: 'CloudGuard Technologies',
      location: 'Remote',
      period: 'Sep 2024 - Dec 2024',
      description: ['Hidden for now'],
      color: 'from-orange-500 to-red-500',
      visible: false,
    },
    {
      title: 'GRC & IT Audit Associate',
      organization: 'Yesyoucan Cybersecure LLC',
      location: 'Remote, Dallas',
      period: 'Feb 2025 - Jun 2025',
      description: [
        'Conducted security audits and compliance assessments against NIST, ISO 27001, and SOC 2 frameworks',
        'Performed risk assessments and developed risk remediation plans',
        'Documented policies and audit evidence',
        'Supported remediation initiatives',
      ],
      color: 'from-purple-500 to-pink-500',
      visible: true,
    },
  ];

  const certifications = [
    {
      name: 'ISO/IEC 27001:2022 Lead Auditor',
      issuer: 'Mastermind Assurance',
      status: 'Completed',
      date: 'Jan 2026',
      certificateUrl: 'https://learn.mastermindassurance.com/certificates/onzapcg9q8',
    },
    {
      name: 'ISC2 Certified in Cybersecurity',
      issuer: 'ISC2',
      status: 'Planned',
      date: 'Apr 2026',
      certificateUrl: '',
    },
    {
      name: 'CompTIA Security+',
      issuer: 'CompTIA',
      status: 'Planned',
      date: 'Planned',
      certificateUrl: '',
    },
  ];

  return (
    <section id="experience" className="relative py-20 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl text-slate-100">
              Experience & Credentials
            </h2>
            <p className="mt-4 text-lg text-slate-400">
              Internships, certifications, and hands-on learning.
            </p>
          </div>

          {/* GRID */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">

            {/* EXPERIENCE COLUMN */}
            <div>
              <h3 className="flex items-center gap-2 text-2xl text-slate-100 mb-8">
                <Briefcase className="w-6 h-6 text-cyan-400" />
                Professional Experience
              </h3>

              <div className="space-y-8">
                {experiences.filter(e => e.visible).map((exp, index) => (
                  <motion.div
                    key={exp.title}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="p-6 rounded-xl bg-slate-800/40 border border-slate-700/50"
                  >
                    <h4 className="text-lg text-slate-100">{exp.title}</h4>
                    <p className="text-sm text-slate-400">
                      {exp.organization} • {exp.location}
                    </p>
                    <ul className="mt-3 space-y-2">
                      {exp.description.map((d, i) => (
                        <li key={i} className="text-sm text-slate-300">▹ {d}</li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CERTIFICATIONS COLUMN */}
            <div>
              <h3 className="flex items-center gap-2 text-2xl text-slate-100 mb-8">
                <Award className="w-6 h-6 text-cyan-400" />
                Certifications & Learning
              </h3>

              <div className="space-y-4">
                {certifications.map(cert => (
                  <div
                    key={cert.name}
                    className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50"
                  >
                    <div className="flex justify-between">
                      <div>
                        <h4 className="text-sm text-slate-100">{cert.name}</h4>
                        <p className="text-xs text-slate-400">{cert.issuer}</p>
                      </div>
                      <span className="text-xs text-slate-400">{cert.status}</span>
                    </div>

                    {cert.certificateUrl && (
                      <a
                        href={cert.certificateUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-cyan-400 inline-flex items-center gap-1 mt-2"
                      >
                        View Certificate <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
}


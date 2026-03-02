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
      type: 'work',
      title: 'IT Compliance Analyst',
      organization: 'Astreya',
      location: 'Global • Remote',
      period: 'Jan 2022 - Sept 2025',
      description: [
        'Supported global IT compliance and governance across enterprise cloud and infrastructure environments aligned with ISO 27001, SOC 2, SOX 404, and NIST controls',
        'Performed IT General Controls (ITGC) testing including access management, change management, incident management, and logical security controls to strengthen audit readiness',
        'Coordinated audit evidence collection for internal and external audits, improving documentation quality and timely submissions across distributed teams',
        'Conducted risk assessments and control gap analyses for enterprise applications and cloud platforms (AWS/Azure), providing actionable remediation recommendations',
        'Managed third-party/vendor risk assessments by reviewing security questionnaires, SOC reports, and compliance attestations to evaluate residual risk',
        'Maintained risk registers, compliance trackers, and remediation logs to drive visibility and accountability across business units',
        'Partnered with Security Operations, Engineering, Legal, and Privacy teams to embed compliance controls into system implementations and cloud migrations',
        'Leveraged automation and scripting (Python where applicable) to streamline evidence collection and compliance reporting',
      ],
      color: 'from-cyan-500 to-blue-500',
    },
    {
      type: 'work',
      title: 'GRC Analyst',
      organization: 'Accenture',
      location: 'Global Consulting Environment',
      period: 'Nov 2019 - Dec 2021',
      description: [
        'Supported GRC initiatives for global clients across financial services, healthcare, and technology, aligned to ISO/IEC 27001, NIST 800-53, COBIT, SOX 404, HIPAA, and SOC 2',
        'Conducted enterprise risk assessments and control gap analyses, identifying high-risk exposures and recommending remediation strategies to reduce audit findings',
        'Performed ITGC and application control testing including access management, change management, logical security, and incident management controls',
        'Supported audit readiness by coordinating evidence collection, performing walkthroughs, and assisting internal/external audit engagements',
        'Developed and maintained risk registers, control matrices (RACMs), and compliance dashboards for executive-level visibility',
        'Led third-party risk assessments by evaluating vendor questionnaires, SOC reports, and compliance certifications to determine residual risk',
        'Collaborated with cross-functional stakeholders to embed governance controls into new system implementations and cloud transformations (AWS/Azure)',
        'Used data analytics and automation tools (Excel, Power BI, Python where applicable) to enhance compliance reporting and risk monitoring',
      ],
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const certifications = [
    {
      name: 'ISO/IEC 27001:2022 Lead Auditor',
      issuer: 'Mastermind Assurance',
      status: 'Completed',
      date: 'Jan 2026',
      color: 'emerald',
      certificateUrl: 'https://learn.mastermindassurance.com/certificates/onzapcg9q8',
    },
    {
      name: 'ISC2 Certified in Cybersecurity',
      issuer: 'ISC2',
      status: 'Planned',
      date: 'Apr 2026',
      color: 'cyan',
      certificateUrl: '', // Add your certificate URL here when available
    },
    {
      name: 'Google Cybersecurity Professional Certificate',
      issuer: 'Google / Coursera',
      status: 'Planned',
      date: 'Planned',
      color: 'blue',
      certificateUrl: '', // Add your certificate URL here when available
    },
    {
      name: 'CompTIA A+',
      issuer: 'CompTIA',
      status: 'Planned',
      date: 'Planned',
      color: 'emerald',
      certificateUrl: '', // Add your certificate URL here when available
    },
    {
      name: 'CompTIA Network+',
      issuer: 'CompTIA',
      status: 'Planned',
      date: 'Planned',
      color: 'purple',
      certificateUrl: '', // Add your certificate URL here when available
    },
    {
      name: 'CompTIA Security+',
      issuer: 'CompTIA',
      status: 'Planned',
      date: 'Planned',
      color: 'cyan',
      certificateUrl: '', // Add your certificate URL here when available
    },
    {
      name: 'CompTIA CySA+',
      issuer: 'CompTIA',
      status: 'Planned',
      date: 'Planned',
      color: 'orange',
      certificateUrl: '', // Add your certificate URL here when available
    },
    {
      name: 'Cisco CCNA',
      issuer: 'Cisco',
      status: 'Planned',
      date: 'Planned',
      color: 'blue',
      certificateUrl: '', // Add your certificate URL here when available
    },
    {
      name: 'AWS Certified Security - Specialty',
      issuer: 'Amazon Web Services',
      status: 'Planned',
      date: 'Planned',
      color: 'orange',
      certificateUrl: '', // Add your certificate URL here when available
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
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="mt-4 text-4xl sm:text-5xl text-slate-100">
              Experience & Credentials
            </h2>
            <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
              My journey in cybersecurity through internships, certifications, and continuous learning.
            </p>
            <div className="mt-4 h-1 w-24 bg-gradient-to-r from-cyan-500 to-emerald-500 mx-auto rounded-full" />
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Work Experience */}
            <div>
              <h3 className="flex items-center gap-2 text-2xl text-slate-100 mb-8">
                <Briefcase className="w-6 h-6 text-cyan-400" />
                Professional Experience
              </h3>

              <div className="relative space-y-8">
                {/* Timeline line */}
                <div className="absolute left-0 top-4 bottom-4 w-0.5 bg-gradient-to-b from-cyan-500 via-emerald-500 to-transparent" />

                {experiences.map((exp, index) => (
                  <motion.div
                    key={exp.title}
                    initial={{ opacity: 0, x: -30 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.2 }}
                    className="relative pl-8"
                  >
                    {/* Timeline dot */}
                    <div className={`absolute left-0 top-6 w-3 h-3 rounded-full bg-gradient-to-br ${exp.color} transform -translate-x-[5px]`}>
                      <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${exp.color} animate-ping opacity-75`} />
                    </div>

                    <div className="group p-6 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-cyan-500/50 hover:bg-slate-800/60 transition-all">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                        <h4 className="text-lg text-slate-100 group-hover:text-cyan-400 transition-colors">
                          {exp.title}
                        </h4>
                        <span className="flex items-center gap-1 text-xs text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full">
                          <Calendar className="w-3 h-3" />
                          {exp.period}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 mb-4 text-sm text-slate-400">
                        <span>{exp.organization}</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {exp.location}
                        </span>
                      </div>

                      <ul className="space-y-2">
                        {exp.description.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                            <span className="text-cyan-400 mt-1">▹</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div>
              <h3 className="flex items-center gap-2 text-2xl text-slate-100 mb-8">
                <Award className="w-6 h-6 text-cyan-400" />
                Certifications & Learning
              </h3>

              <div className="space-y-4">
                {certifications.map((cert, index) => {
                  const CertContent = (
                    <motion.div
                      key={cert.name}
                      initial={{ opacity: 0, x: 30 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: index * 0.15 }}
                      className="group p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-cyan-500/50 hover:bg-slate-800/60 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm text-slate-100 group-hover:text-cyan-400 transition-colors mb-1">
                              {cert.name}
                            </h4>
                            {cert.certificateUrl && (
                              <ExternalLink className="w-3 h-3 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mb-2">{cert.issuer}</p>
                          <div className="flex items-center gap-2 text-xs">
                            <Calendar className="w-3 h-3 text-cyan-400" />
                            <span className="text-slate-400">{cert.date}</span>
                          </div>
                        </div>
                        
                        <div>
                          {cert.status === 'Completed' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
                              ✓
                            </span>
                          )}
                          {cert.status === 'In Progress' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs">
                              ⟳
                            </span>
                          )}
                          {cert.status === 'Planned' && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-slate-500/10 border border-slate-500/30 text-slate-400 text-xs">
                              ○
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );

                  // Wrap with link if certificateUrl exists
                  return cert.certificateUrl ? (
                    <a
                      key={cert.name}
                      href={cert.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      {CertContent}
                    </a>
                  ) : (
                    CertContent
                  );
                })}
              </div>

              {/* Achievements Box */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="mt-8 p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 border border-cyan-500/30"
              >
                <h4 className="text-lg text-slate-100 mb-4">Key Achievements</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-cyan-400">★</span>
                    Duke of Edinburgh International Award - Silver Standard
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-cyan-400">★</span>
                    Gold Medalist, Energy Efficient Airport Operation Challenege
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-cyan-400">★</span>
                    N/A
                  </li>
                  <li className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="text-cyan-400">★</span>
                    N/A
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

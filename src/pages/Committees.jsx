import { Link } from 'react-router-dom'
import FadeIn from '../components/FadeIn'
import CommitteeCard from '../components/CommitteeCard'
import CTASection from '../components/CTASection'
import SEO from '../components/SEO'
import { useTranslation } from '../i18n'

const COMMITTEES = [
  {
    number: '01',
    title: 'Public Law and Constitutional Law',
    description:
      'Analyses constitutional frameworks, separation of powers, rule of law principles, and public governance structures. Produces comparative constitutional studies, institutional roadmaps, and legal memoranda on democratic governance.',
  },
  {
    number: '02',
    title: 'International Law and Human Rights',
    description:
      'Researches international human rights standards, humanitarian law, and global legal mechanisms relevant to Iran. Prepares submissions to international bodies and legal briefs on human rights violations and accountability.',
  },
  {
    number: '03',
    title: 'Commercial Law and Arbitration',
    description:
      'Studies international commercial transactions, trade law, cross-border disputes, and arbitration frameworks. Develops proposals for commercial legal reform aligned with international standards.',
  },
  {
    number: '04',
    title: 'Legal Research and Studies',
    description:
      'Conducts comprehensive legal research, comparative studies, and scholarly analysis across all legal domains. Supports evidence-based policy development and maintains institutional knowledge systems.',
  },
  {
    number: '05',
    title: 'Criminal Law and Criminology',
    description:
      'Examines criminal justice systems, penal law reform, and criminological research. Develops proposals for fair, transparent, and rights-respecting criminal justice frameworks.',
  },
  {
    number: '06',
    title: 'Comparative Law and International Banking Law',
    description:
      'Analyses banking regulations, financial law, and international banking standards through comparative legal methodology. Proposes frameworks for transparent and accountable financial governance.',
  },
]

export default function Committees() {
  const t = useTranslation()
  return (
    <div>
      <SEO
        title="Legal Committees | IILA Specialist Working Groups"
        description="Discover IILA's specialist legal committees covering international law, human rights, constitutional design, and institutional reform for Iran."
        path="/committees"
      />
      {/* Page Hero */}
      <section className="page-hero">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950 to-navy-900 hidden dark:block" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gold/15" />
        <div className="relative container-site">
          <FadeIn>
            <span className="text-[10px] text-gold tracking-[0.3em] uppercase font-medium font-sans">
              {t.committees.heroTag}
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-ivory mt-4 leading-tight max-w-3xl">
              {t.committees.heroTitle}
            </h1>
            <div className="gold-line mt-6" />
            <p className="text-ivory/85 text-lg font-sans max-w-2xl leading-relaxed">
              {t.committees.heroSubtitle}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Committee structure note */}
      <section className="section-alt border-b border-gold/10 py-10">
        <div className="container-site">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { num: '6', label: 'Specialised Committees' },
              { num: 'Independent', label: 'Non-partisan operation' },
              { num: 'International', label: 'Legal standards applied' },
              { num: 'Rigorous', label: 'Academic methodology' },
            ].map((item, i) => (
              <FadeIn key={item.label} delay={i * 60}>
                <div className="bg-t-surface border border-gold/15 px-5 py-5 text-center">
                  <div className="font-serif text-gold text-xl font-semibold mb-2">
                    {item.num}
                  </div>
                  <div className="text-ivory text-[10px] tracking-[0.15em] uppercase font-sans">
                    {item.label}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Committees Grid */}
      <section className="section-py section-mid border-t border-gold/10">
        <div className="container-site">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {COMMITTEES.map((committee, i) => (
              <CommitteeCard key={committee.title} {...committee} delay={i * 70} />
            ))}
          </div>
        </div>
      </section>

      {/* How committees work */}
      <section className="section-py section-dark border-t border-gold/10">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <span className="text-[10px] text-gold tracking-[0.25em] uppercase font-semibold font-sans">
                Committee Operations
              </span>
              <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-ivory mt-4 leading-tight">
                How IILA Committees Work
              </h2>
              <div className="gold-line mt-6" />
              <p className="text-ivory/85 text-base lg:text-lg leading-relaxed font-sans">
                Each committee operates with full legal independence, guided by professional
                legal standards and the institutional principles of IILA. Committee members
                are qualified legal professionals, scholars, and researchers with relevant
                expertise in their area.
              </p>
            </FadeIn>
            <FadeIn delay={120}>
              <div className="space-y-4">
                {[
                  'Produce legal research papers and memoranda',
                  'Prepare legal analysis for institutional audiences',
                  'Engage with international legal organisations',
                  'Review and analyse relevant legislation and case law',
                  'Contribute to the IILA Legal Roadmap',
                  'Support expert network development',
                ].map((item, i) => (
                  <div
                    key={item}
                    className="flex items-start gap-4 border border-t-border/10 px-5 py-4 hover:border-gold/30 transition-colors duration-200"
                  >
                    <span className="text-[10px] text-gold font-serif font-semibold tracking-wider flex-shrink-0 mt-0.5">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-ivory/80 text-sm font-sans">{item}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <CTASection
        label={t.committees.ctaTitle}
        title={t.committees.ctaTitle}
        subtitle={t.committees.ctaSubtitle}
        buttons={[
          { label: t.committees.ctaBtn1, to: '/expert-network' },
          { label: t.committees.ctaBtn2, to: '/contact' },
        ]}
      />
    </div>
  )
}

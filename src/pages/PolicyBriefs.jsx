import { useState } from 'react'
import FadeIn from '../components/FadeIn'
import PolicyBriefCard from '../components/PolicyBriefCard'
import CTASection from '../components/CTASection'
import SEO from '../components/SEO'
import { useTranslation } from '../i18n'

const CATEGORIES = [
  'All',
  'Human Rights',
  'Constitutional Transition',
  'International Law',
  'Accountability',
  'Judicial Reform',
  'Minority Protections',
  'Rule of Law',
]

const BRIEFS = [
  {
    title: 'Due Process Violations and International Accountability',
    category: 'Human Rights',
    summary:
      "An analysis of due process violations in Iran's legal system and available international mechanisms for accountability, documentation, and legal redress.",
    pages: '4',
    date: '2025',
  },
  {
    title: 'Sanctions and Human Rights Accountability: Legal Standards',
    category: 'Accountability',
    summary:
      'An examination of targeted sanctions as a legal accountability tool, including Magnitsky-style mechanisms, asset recovery, and compliance with international human rights standards.',
    pages: '5',
    date: '2025',
  },
  {
    title: 'Judicial Independence in a Transitional Framework',
    category: 'Judicial Reform',
    summary:
      'A brief on international standards for judicial independence and their practical application in designing judicial reform frameworks for a transitional Iran.',
    pages: '4',
    date: '2025',
  },
  {
    title: 'Constitutional Principles for a Future Democratic Iran',
    category: 'Constitutional Transition',
    summary:
      'An overview of foundational constitutional principles — separation of powers, fundamental rights, constitutional legitimacy, and democratic accountability — applicable to Iran.',
    pages: '5',
    date: '2025',
  },
  {
    title: 'Protection of Minorities Under International Law',
    category: 'Minority Protections',
    summary:
      "A legal brief on international legal standards for the protection of ethnic, linguistic, and religious minorities and their application to Iran's diverse population.",
    pages: '4',
    date: '2025',
  },
]

export default function PolicyBriefs() {
  const t = useTranslation()
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered =
    activeCategory === 'All'
      ? BRIEFS
      : BRIEFS.filter((b) => b.category === activeCategory)

  return (
    <div>
      <SEO
        title="Policy Briefs | IILA — Legal & Institutional Analysis"
        description="Read IILA's policy briefs on international law, human rights, governance, and legal reform relevant to Iran and the wider international legal community."
        path="/policy-briefs"
      />
      {/* Page Hero */}
      <section className="page-hero">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950 to-navy-900 hidden dark:block" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gold/15" />
        <div className="relative container-site">
          <FadeIn>
            <span className="text-[10px] text-gold tracking-[0.3em] uppercase font-medium font-sans">
              {t.policyBriefs.heroTag}
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-ivory mt-4 leading-tight max-w-3xl">
              {t.policyBriefs.heroTitle}
            </h1>
            <div className="gold-line mt-6" />
            <p className="text-ivory/85 text-lg font-sans max-w-2xl leading-relaxed">
              {t.policyBriefs.heroSubtitle}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* What is a Policy Brief */}
      <section className="section-alt border-b border-gold/10 py-10">
        <div className="container-site">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { num: '2–5', label: 'Pages per brief' },
              { num: 'Executive Summary', label: 'Opening section' },
              { num: 'Key Findings', label: 'Legal analysis' },
              { num: 'Recommendations', label: 'Institutional action' },
            ].map((item, i) => (
              <FadeIn key={item.label} delay={i * 60}>
                <div className="bg-t-surface border border-gold/15 px-5 py-5 text-center">
                  <div className="font-serif text-gold text-base font-semibold mb-2">
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

      {/* Filter Bar */}
      <section className="section-alt border-b border-gold/10 py-6 sticky top-16 lg:top-[68px] z-30">
        <div className="container-site">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 text-[10px] tracking-[0.18em] uppercase font-medium px-4 py-2 border transition-all duration-200 font-sans ${
                  activeCategory === cat
                    ? 'border-gold bg-gold/10 text-gold'
                    : 'border-gold/20 text-t-text/40 hover:border-gold/40 hover:text-t-text/70'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Briefs Grid */}
      <section className="section-py section-mid">
        <div className="container-site">
          <FadeIn className="mb-10">
            <p className="text-ivory/70 text-xs tracking-[0.15em] uppercase font-sans">
              {filtered.length} Brief{filtered.length !== 1 ? 's' : ''}
              {activeCategory !== 'All' && ` · ${activeCategory}`}
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((brief, i) => (
              <PolicyBriefCard key={brief.title} {...brief} delay={i * 80} />
            ))}
          </div>

          {filtered.length === 0 && (
            <FadeIn className="text-center py-20">
              <p className="text-ivory/70 font-sans text-base">
                {t.policyBriefs.noResults}
              </p>
            </FadeIn>
          )}
        </div>
      </section>

      {/* Intended Audiences */}
      <section className="section-py section-dark border-t border-gold/10">
        <div className="container-site max-w-4xl mx-auto">
          <FadeIn className="text-center mb-12">
            <p className="text-[10px] text-gold tracking-[0.22em] uppercase font-medium font-sans mb-5">
              {t.policyBriefs.filterLabel}
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-ivory mt-4 leading-tight">
              Who IILA Policy Briefs Serve
            </h2>
            <div className="gold-line-center" />
          </FadeIn>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              'Policy Institutions & Think Tanks',
              'International Organisations',
              'Bar Associations',
              'Universities & Legal Scholars',
              'Human Rights Organisations',
              'Media & Journalists',
              'Policymakers & Legislators',
              'Iranian Legal Professionals',
              'Civil Society Organisations',
            ].map((item, i) => (
              <FadeIn key={item} delay={i * 50}>
                <div className="bg-t-surface border border-gold/15 px-5 py-4 group hover:border-gold/40 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-6 bg-gold/30 group-hover:bg-gold transition-colors duration-300 flex-shrink-0" />
                    <p className="text-ivory/80 text-xs font-sans leading-relaxed group-hover:text-ivory transition-colors duration-200">
                      {item}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        label={t.policyBriefs.ctaTitle}
        title={t.policyBriefs.ctaTitle}
        subtitle={t.policyBriefs.ctaSubtitle}
        buttons={[
          { label: t.policyBriefs.ctaBtn, to: '/contact' },
          { label: t.ctaShort, to: '/expert-network' },
        ]}
      />
    </div>
  )
}

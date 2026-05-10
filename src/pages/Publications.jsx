import { useState } from 'react'
import FadeIn from '../components/FadeIn'
import SectionTitle from '../components/SectionTitle'
import PublicationCard from '../components/PublicationCard'
import CTASection from '../components/CTASection'
import SEO from '../components/SEO'
import { useTranslation } from '../i18n'

const CATEGORIES = [
  'All',
  'International Policy / EU Policy',
  'Human Rights / Legal Analysis',
  'Institutional Reform / Economic Governance',
  'Publication Cover / Document Design',
  'اصلاحات نهادی / نظام بانکی',
]

const PUBLICATIONS = [
  {
    title: 'EU Policy Dossier on Iran',
    category: 'International Policy / EU Policy',
    abstract:
      'A policy-focused dossier addressing European Union approaches toward Iran, with emphasis on accountability, democratic transition, human rights, and institutional engagement.',
    date: '2025',
    author: 'IILA International Law and Human Rights Committee',
    status: 'Published',
    href: '/Publications/EU POLICY DOSSIER.docx',
    fileType: 'DOCX',
    language: 'English',
  },
  {
    title: 'Transitional Banking Reform Framework for Iran',
    category: 'Institutional Reform / Economic Governance',
    abstract:
      'A proposed framework for reforming Iran\'s banking and financial governance during a democratic transition, focusing on institutional stability, transparency, accountability, and economic recovery.',
    date: '2025',
    author: 'IILA Comparative Law and International Banking Law Committee',
    status: 'Published',
    href: '/Publications/Transitional Banking Reform Framework for Iran.pdf',
    fileType: 'PDF',
    language: 'English',
  },
  {
    title: 'بازنگری و بازنویسی قانون بانک مرکزی ایران نوین',
    category: 'اصلاحات نهادی / نظام بانکی',
    abstract:
      'این سند به بررسی و بازنویسی چارچوب قانونی بانک مرکزی ایران در مسیر گذار به حکمرانی نوین، شفافیت مالی، استقلال نهادی و پاسخگویی اقتصادی می‌پردازد.',
    date: '2025',
    author: 'کمیته حقوق تطبیقی و حقوق بانکداری بین‌الملل IILA',
    status: 'Published',
    href: '/Publications/\u200e\u2068بازنگری_و_بازنویسی_قانون_بانک_مرکزی_ایران_نوین\u2069.pdf',
    fileType: 'PDF',
    language: 'فارسی',
  },
  {
    title: 'Second-Class Citizen',
    category: 'Human Rights / Legal Analysis',
    abstract:
      'A legal and human rights analysis examining the structural conditions that reduce citizens to second-class status, with focus on discrimination, exclusion, and the need for legal restoration.',
    date: '2025',
    author: 'IILA International Law and Human Rights Committee',
    status: 'Published',
    href: '/Publications/Second Class Citizen 2026-05-01.pdf',
    fileType: 'PDF',
    language: 'English',
  },
]

export default function Publications() {
  const t = useTranslation()
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered =
    activeCategory === 'All'
      ? PUBLICATIONS
      : PUBLICATIONS.filter((p) => p.category === activeCategory)

  return (
    <div>
      <SEO
        title="Legal Publications | IILA Research & International Law"
        description="Explore IILA's legal publications and research covering international law, human rights, constitutional frameworks, and institutional development for Iran."
        path="/publications"
      />
      {/* Page Hero */}
      <section className="page-hero">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950 to-navy-900 hidden dark:block" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gold/15" />
        <div className="relative container-site">
          <FadeIn>
            <span className="text-[10px] text-gold tracking-[0.3em] uppercase font-medium font-sans">
              {t.publications.heroTag}
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-ivory mt-4 leading-tight max-w-3xl">
              {t.publications.heroTitle}
            </h1>
            <div className="gold-line mt-6" />
            <p className="text-ivory/85 text-lg font-sans max-w-2xl leading-relaxed">
              {t.publications.heroSubtitle}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="section-alt border-b border-gold/10 py-6 sticky top-16 lg:top-[68px] z-30">
        <div className="container-site">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 text-[10px] tracking-[0.18em] uppercase font-medium px-4 py-2 border transition-all duration-200 font-sans ${
                  activeCategory === cat
                    ? 'border-gold bg-gold/10 text-gold'
                    : 'border-gold/20 text-t-text hover:border-gold/40 hover:text-t-text'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Publications Grid */}
      <section className="section-py section-mid border-t border-gold/10">
        <div className="container-site">
          <FadeIn className="flex items-center justify-between mb-10">
            <p className="text-ivory/70 text-xs tracking-[0.15em] uppercase font-sans">
              {filtered.length} Publication{filtered.length !== 1 ? 's' : ''}
              {activeCategory !== 'All' && ` · ${activeCategory}`}
            </p>
            <span className="text-[10px] text-gold tracking-[0.15em] uppercase font-semibold font-sans">
              IILA Publication Archive
            </span>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((pub, i) => (
              <PublicationCard key={pub.title} {...pub} delay={i * 80} />
            ))}
          </div>

          {filtered.length === 0 && (
            <FadeIn className="text-center py-20">
              <p className="text-ivory/70 font-sans text-base">
                No publications in this category yet.
              </p>
            </FadeIn>
          )}
        </div>
      </section>

      {/* Publication Categories Overview */}
      <section className="section-py section-dark border-t border-gold/10">
        <div className="container-site">
          <SectionTitle
            label={t.publications.categoriesLabel}
            title={t.publications.categoriesTitle}
            subtitle={t.publications.categoriesSubtitle}
            className="mb-14"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              'International Policy / EU Policy',
              'Human Rights / Legal Analysis',
              'Institutional Reform / Economic Governance',
              'Publication Cover / Document Design',
              'اصلاحات نهادی / نظام بانکی',
            ].map((cat, i) => (
              <FadeIn key={cat} delay={i * 40}>
                <button
                  onClick={() => {
                    const match = CATEGORIES.find((c) => c === cat)
                    if (match) setActiveCategory(match)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="w-full border border-t-border/15 bg-t-surface/30 p-5 text-left hover:border-gold/40 hover:bg-t-surface transition-all duration-300 group"
                >
                  <div className="w-5 h-px bg-gold/30 mb-3 group-hover:w-8 group-hover:bg-gold transition-all duration-300" />
                  <p className="text-t-text text-xs tracking-[0.08em] uppercase font-sans leading-relaxed group-hover:text-t-text transition-colors duration-200">
                    {cat}
                  </p>
                </button>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Disclaimer ── */}
      <section className="section-alt section-py border-t border-t-border/10">
        <div className="container-site max-w-3xl mx-auto">
          <div className="border border-t-border/15 rounded-sm p-8 lg:p-10" style={{ background: 'rgb(var(--t-surface-2))' }}>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-4 h-px bg-t-gold" />
              <span className="text-[9.5px] text-t-gold font-bold tracking-[0.26em] uppercase font-sans">
                Disclaimer
              </span>
            </div>
            <p className="text-t-muted text-sm leading-[1.9] font-sans">
              The views, opinions, and content of all publications on this website are solely the responsibility of the individual authors. IILA does not assume any liability for the accuracy, legality, or consequences of these materials. Unless explicitly stated as a collaborative work, all publications are deemed individual contributions, and the association does not bear responsibility for their content or implications.
            </p>
          </div>
        </div>
      </section>

      <CTASection
        label={t.publications.ctaTitle}
        title={t.publications.ctaTitle}
        subtitle={t.publications.ctaSubtitle}
        buttons={[
          { label: t.publications.ctaBtn, to: '/contact' },
          { label: t.ctaShort, to: '/expert-network' },
        ]}
      />
    </div>
  )
}

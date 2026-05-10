import { Link } from 'react-router-dom'
import FadeIn from '../components/FadeIn'
import TimelinePhase from '../components/TimelinePhase'
import SectionTitle from '../components/SectionTitle'
import CTASection from '../components/CTASection'
import SEO from '../components/SEO'
import { useTranslation } from '../i18n'

const PHASES = [
  {
    phase: 1,
    title: 'Documentation and Legal Analysis',
    description:
      'Collect, examine, and structure legal evidence, reports, human rights violations, legal failures, and institutional patterns. Build a rigorous legal documentation framework that meets international evidentiary standards.',
  },
  {
    phase: 2,
    title: 'Legal Research and Institutional Engagement',
    description:
      'Produce rigorous legal research and analysis for policymakers, institutions, universities, media, and partner organisations. Each publication translates complex legal analysis into actionable institutional guidance.',
  },
  {
    phase: 3,
    title: 'International Legal Dialogue',
    description:
      'Engage with international legal organisations, bar associations, academic institutions, and human rights bodies. Establish IILA as a credible legal voice in global legal and policy forums.',
  },
  {
    phase: 4,
    title: 'Transitional Legal Frameworks',
    description:
      'Develop legal frameworks for transitional justice, institutional continuity, temporary governance, judicial reform, and accountability. Provide the legal architecture for a lawful and orderly transition.',
  },
  {
    phase: 5,
    title: 'Constitutional and Judicial Reform Preparation',
    description:
      'Prepare comparative constitutional research, judicial independence models, legal profession reform, legislative modernisation, and rule-of-law standards — the full legal infrastructure for Iran\'s democratic future.',
  },
]

const STEPS_90 = [
  'Publish three flagship legal research papers establishing IILA\'s legal authority.',
  'Build and launch a structured legal publication archive on this platform.',
  'Send institutional briefings to relevant legal and policy organisations.',
  'Offer expert legal commentary to media and policy platforms.',
  'Build a vetted expert network of lawyers, researchers, and legal scholars.',
  'Publish monthly legal analysis on urgent Iran-related legal developments.',
  'Launch a professional institutional newsletter for legal and policy audiences.',
]

export default function Roadmap() {
  const t = useTranslation()
  return (
    <div>
      <SEO
        title="Legal Roadmap | IILA — Institutional Preparation for Iran's Future"
        description="IILA's legal roadmap outlines constitutional design, judicial reform, transitional justice, and institutional accountability frameworks for Iran's democratic future."
        path="/roadmap"
      />
      {/* Page Hero */}
      <section className="page-hero">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950 to-navy-900 hidden dark:block" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gold/15" />
        <div className="relative container-site">
          <FadeIn>
            <span className="text-[10px] text-gold tracking-[0.3em] uppercase font-medium font-sans">
              {t.roadmap.heroTag}
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-ivory mt-4 leading-tight max-w-3xl">
              {t.roadmap.heroTitle}
            </h1>
            <div className="gold-line mt-6" />
            <p className="text-ivory/85 text-lg font-sans max-w-2xl leading-relaxed italic font-display">
              {t.roadmap.heroSubtitle}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Roadmap Intro */}
      <section className="section-py section-mid border-t border-gold/10">
        <div className="container-site max-w-3xl">
          <FadeIn>
            <span className="text-[10px] text-gold tracking-[0.25em] uppercase font-semibold font-sans">
              The Mandate
            </span>
            <div className="gold-line mt-4" />
            <p className="text-ivory text-lg lg:text-xl leading-relaxed font-sans mb-6">
              IILA's Legal Roadmap represents a structured, phased approach to building the
              legal infrastructure necessary for Iran's democratic future. It is designed not
              as a political strategy, but as a legal and institutional preparation framework.
            </p>
            <p className="text-ivory/85 text-base leading-relaxed font-sans">
              Each phase builds upon the previous, creating a cumulative architecture of
              legal knowledge, institutional capacity, and international engagement that will
              be indispensable when Iran's transitional moment arrives.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-py section-dark border-t border-gold/10">
        <div className="container-site">
          <SectionTitle
            label={t.roadmap.frameworkLabel}
            title={t.roadmap.frameworkTitle}
            className="mb-16"
          />
          <div className="max-w-3xl">
            {PHASES.map((phase, i) => (
              <TimelinePhase
                key={phase.phase}
                {...phase}
                isLast={i === PHASES.length - 1}
                delay={i * 100}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 90-Day Plan */}
      <section className="section-py section-mid border-t border-gold/10">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-4">
              <FadeIn>
                <span className="text-[10px] text-gold tracking-[0.25em] uppercase font-semibold font-sans">
                  Immediate Action
                </span>
                <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-ivory mt-4 leading-tight">
                  90-Day Strategic Visibility Plan
                </h2>
                <div className="gold-line mt-6" />
                <p className="text-ivory/85 text-base leading-relaxed font-sans">
                  An initial action framework to establish IILA's credibility, visibility, and
                  institutional presence within the first ninety days of operation.
                </p>
              </FadeIn>
            </div>
            <div className="lg:col-span-8">
              <div className="space-y-0">
                {STEPS_90.map((step, i) => (
                  <FadeIn key={i} delay={i * 60}>
                    <div className="flex gap-6 border-b border-t-border/10 py-6 group hover:border-gold/25 transition-colors duration-300">
                      <span className="text-[11px] text-gold font-serif font-bold tracking-wider flex-shrink-0 mt-0.5">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <p className="text-ivory/80 text-base leading-relaxed font-sans group-hover:text-ivory transition-colors duration-200">
                        {step}
                      </p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statement */}
      <section className="section-py section-dark border-t border-gold/10">
        <div className="container-site max-w-3xl mx-auto text-center">
          <FadeIn>
            <div className="bg-t-surface border border-gold/20 px-10 py-14">
              <p className="font-display text-2xl lg:text-3xl text-ivory/80 italic leading-relaxed mb-6">
                "Legal preparation is not optional — it is the precondition for
                a legitimate, stable, and just democratic transition."
              </p>
              <div className="gold-line-center" />
              <p className="text-ivory/70 text-xs tracking-[0.18em] uppercase font-sans mb-8">
                IILA Legal Roadmap Statement
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/publications" className="btn-solid-gold">
                  View Publications
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <CTASection
        label={t.roadmap.ctaTitle}
        title={t.roadmap.ctaTitle}
        subtitle={t.roadmap.ctaSubtitle}
        buttons={[
          { label: t.roadmap.ctaBtn, to: '/contact' },
          { label: t.ctaShort, to: '/expert-network' },
        ]}
      />
    </div>
  )
}

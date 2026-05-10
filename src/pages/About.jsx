import { Link } from 'react-router-dom'
import FadeIn from '../components/FadeIn'
import SectionTitle from '../components/SectionTitle'
import CTASection from '../components/CTASection'
import SEO from '../components/SEO'
import { useTranslation } from '../i18n'

const PILLARS = [
  {
    title: 'Independent and Non-Partisan',
    text: 'IILA operates free from political affiliation, factional interest, or ideological bias. Our analyses are guided exclusively by legal principles, institutional competence, and established norms of international and comparative law. We do not represent or advance any political movement, party, or faction.',
  },
  {
    title: 'Registered in Switzerland',
    text: 'IILA is formally registered as a non-profit legal association in Switzerland — a jurisdiction recognised globally for institutional neutrality, legal rigour, and the protection of civil society. This registration reflects our commitment to international standards of transparency and accountability.',
  },
  {
    title: 'Legal, Not Factional',
    text: "IILA's work is anchored in law, not politics. We believe that Iran's future cannot be secured through slogans, emotional appeals, or factional competition, but through the patient, disciplined work of building legal knowledge, legal institutions, and legal frameworks capable of enduring.",
  },
  {
    title: 'Professional Legal Standards',
    text: 'All IILA publications and legal memoranda are prepared to professional academic and institutional standards. We engage with primary legal sources, international legal instruments, comparative constitutional models, and the established methodologies of legal scholarship.',
  },
  {
    title: 'A Gateway to the Global Legal Community',
    text: 'IILA serves as a professional bridge between Iranian legal professionals and the global legal community — including international organisations, universities, bar associations, human rights bodies, policy centres, and democratic legal institutions worldwide.',
  },
]

export default function About() {
  const t = useTranslation()
  return (
    <div>
      <SEO
        title="About IILA | Iranian International Lawyers Association"
        description="Learn about IILA — the Iranian International Lawyers Association — its founding principles, legal mission, and institutional structure advancing the rule of law for Iran."
        path="/about"
      />
      {/* Page Hero */}
      <section className="page-hero">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950 to-navy-900 hidden dark:block" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gold/15" />
        <div className="relative container-site">
          <FadeIn>
            <span className="text-[10px] text-gold tracking-[0.3em] uppercase font-medium font-sans">
              {t.about.heroTag}
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-ivory mt-4 leading-tight max-w-3xl">
              {t.about.heroTitle}
            </h1>
            <div className="gold-line mt-6" />
            <p className="text-ivory/85 text-lg font-sans max-w-2xl leading-relaxed">
              {t.about.heroSubtitle}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Founding Statement */}
      <section className="section-py section-mid border-t border-gold/10">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-4">
              <FadeIn>
                <span className="text-[10px] text-gold tracking-[0.25em] uppercase font-semibold font-sans">
                  {t.about.foundingLabel}
                </span>
                <div className="gold-line mt-4 mb-0" />
              </FadeIn>
            </div>
            <div className="lg:col-span-8">
              <FadeIn delay={100}>
                <blockquote className="font-display text-xl lg:text-2xl text-ivory/80 leading-relaxed italic border-l-2 border-gold/40 pl-8">
                  {t.about.foundingQuote}
                </blockquote>
              </FadeIn>
              <FadeIn delay={200} className="mt-8">
                <p className="text-ivory/85 text-base lg:text-lg leading-relaxed font-sans mb-6">
                  {t.about.foundingText1}
                </p>
                <p className="text-ivory/85 text-base lg:text-lg leading-relaxed font-sans">
                  {t.about.foundingText2}
                </p>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="section-py section-dark border-t border-gold/10">
        <div className="container-site">
          <SectionTitle
            label={t.about.principlesLabel}
            title={t.about.principlesTitle}
            className="mb-16"
          />
          <div className="space-y-0">
            {(t.about.pillars || []).map((pillar, i) => (
              <FadeIn key={pillar.title} delay={i * 80}>
                <div className="border-b border-t-border/10 py-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 group hover:border-gold/25 transition-colors duration-300">
                  <div className="lg:col-span-4 flex items-start gap-5">
                    <span className="text-[10px] text-gold tracking-[0.18em] font-semibold font-sans mt-1 flex-shrink-0">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-serif text-ivory text-xl font-semibold group-hover:text-gold transition-colors duration-200">
                      {pillar.title}
                    </h3>
                  </div>
                  <div className="lg:col-span-8">
                    <p className="text-ivory/80 text-base leading-relaxed font-sans">
                      {pillar.text}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Registration note */}
      <section className="section-py section-mid border-t border-gold/10">
        <div className="container-site max-w-3xl mx-auto text-center">
          <FadeIn>
            <div className="bg-t-surface border border-gold/20 p-10 lg:p-14">
              <span className="text-[10px] text-gold tracking-[0.25em] uppercase font-semibold font-sans">
                {t.about.regLabel}
              </span>
              <div className="gold-line-center" />
              <p className="font-display text-2xl lg:text-3xl text-ivory/80 leading-relaxed italic mb-6">
                {t.about.regQuote}
              </p>
              <p className="text-ivory/80 text-sm font-sans leading-relaxed">
                {t.about.regText}
              </p>
              <div className="mt-8 flex flex-wrap gap-4 justify-center">
                <Link to="/mission" className="btn-outline-gold">
                  {t.about.regBtn1}
                </Link>
                <Link to="/committees" className="btn-ghost">
                  {t.about.regBtn2}
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <CTASection
        label={t.about.ctaLabel}
        title={t.about.ctaTitle}
        subtitle={t.about.ctaSubtitle}
        buttons={[
          { label: t.about.ctaBtn1, to: '/contact' },
          { label: t.about.ctaBtn2, to: '/expert-network' },
        ]}
      />
    </div>
  )
}

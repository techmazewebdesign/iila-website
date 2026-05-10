import { Link } from 'react-router-dom'
import FadeIn from '../components/FadeIn'
import SectionTitle from '../components/SectionTitle'
import SEO from '../components/SEO'
import { useTranslation } from '../i18n'

const PRINCIPLES = [
  {
    title: 'Rule of Law',
    text: 'All state authority must be exercised in accordance with established legal norms, subject to judicial oversight, and constrained by constitutional and international legal standards.',
  },
  {
    title: 'Legal Independence',
    text: 'IILA operates without political affiliation or factional interest. Our legal analysis is guided solely by legal standards, scholarly rigour, and institutional competence.',
  },
  {
    title: 'Human Rights',
    text: 'The universally recognised rights of every individual must be protected, upheld, and guaranteed under domestic and international law, without exception or discrimination.',
  },
  {
    title: 'Institutional Integrity',
    text: 'Legal and governmental institutions must operate with transparency, accountability, and adherence to their constitutional mandates, free from corruption or partisan capture.',
  },
  {
    title: 'Judicial Independence',
    text: 'An independent judiciary, free from executive interference and political pressure, is a foundational requirement of any legitimate legal system.',
  },
  {
    title: 'National Unity',
    text: "Iran's legal and institutional future must be built upon a framework of national unity that respects the diversity of Iran's people while ensuring equal citizenship and equal protection under law.",
  },
  {
    title: 'Secular Democratic Governance',
    text: 'IILA supports legal frameworks grounded in secular democratic governance, separation of powers, and the protection of fundamental freedoms from arbitrary state or religious authority.',
  },
  {
    title: 'Equal Protection',
    text: 'Every person — regardless of ethnicity, religion, language, gender, or political belief — must be entitled to equal protection under the law and equal access to justice.',
  },
  {
    title: 'Accountability',
    text: 'Those responsible for violations of law, human rights abuses, and institutional corruption must be held accountable through legal mechanisms, both domestic and international.',
  },
  {
    title: 'International Legal Standards',
    text: 'Iran must be guided by and held to the standards of international law, including international human rights law, humanitarian law, and the rule of law principles recognised by the international community.',
  },
]

export default function Mission() {
  const t = useTranslation()
  return (
    <div>
      <SEO
        title="Our Mission & Principles | IILA — Iranian International Lawyers Association"
        description="IILA's mission is to advance rule of law, human rights, and institutional legal preparation for Iran through independent research, international engagement, and legal expertise."
        path="/mission"
      />
      {/* Page Hero */}
      <section className="page-hero">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950 to-navy-900 hidden dark:block" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gold/15" />
        <div className="relative container-site">
          <FadeIn>
            <span className="text-[10px] text-gold tracking-[0.3em] uppercase font-medium font-sans">
              {t.mission.heroTag}
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-ivory mt-4 leading-tight max-w-3xl">
              {t.mission.heroTitle}
            </h1>
            <div className="gold-line mt-6" />
            <p className="text-ivory/85 text-lg font-sans max-w-2xl leading-relaxed">
              {t.mission.heroSubtitle}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="section-py section-mid border-t border-gold/10">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-4">
              <FadeIn>
                <span className="text-[10px] text-gold/70 tracking-[0.28em] uppercase font-medium font-sans">
                  {t.mission.mandateLabel}
                </span>
                <div className="gold-line mt-4" />
                <p className="font-display text-4xl text-gold/90 italic leading-tight">
                  {t.mission.quote}
                </p>
              </FadeIn>
            </div>
            <div className="lg:col-span-8">
              <FadeIn delay={120}>
                <p className="text-ivory text-lg lg:text-xl leading-relaxed font-sans mb-6">
                  {t.mission.statementText1}
                </p>
                <p className="text-ivory/85 text-base lg:text-lg leading-relaxed font-sans mb-6">
                  {t.mission.statementText2}
                </p>
                <p className="text-ivory/85 text-base lg:text-lg leading-relaxed font-sans">
                  {t.mission.statementText3}
                </p>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Guiding Statement */}
      <section className="section-dark border-t border-gold/10 py-16 lg:py-20">
        <div className="container-site max-w-3xl mx-auto text-center">
          <FadeIn>
            <div className="bg-t-surface border border-gold/20 px-10 py-12">
              <p className="font-display text-2xl lg:text-4xl text-ivory leading-relaxed italic">
                {t.mission.quote}
              </p>
              <div className="gold-line-center mt-6" />
              <p className="text-ivory/70 text-xs tracking-[0.18em] uppercase font-sans">
                {t.mission.quoteAuthor}
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Principles */}
      <section className="section-py section-mid border-t border-gold/10">
        <div className="container-site">
          <SectionTitle
            label={t.mission.principlesLabel}
            title={t.mission.principlesTitle}
            subtitle={t.mission.principlesSubtitle}
            className="mb-16"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {(t.mission.principles || []).map((p, i) => (
              <FadeIn key={p.title} delay={i * 60}>
                <div className="border-b border-r-0 md:border-r border-t-border/10 p-8 lg:p-10 hover:bg-t-surface/60 transition-colors duration-300 group">
                  <div className="flex items-start gap-5">
                    <span className="text-[11px] text-gold tracking-[0.18em] font-sans pt-1 flex-shrink-0 font-semibold">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="font-serif text-ivory text-lg font-semibold mb-3 group-hover:text-gold transition-colors duration-200">
                        {p.title}
                      </h3>
                      <div className="w-6 h-px bg-gold/30 mb-3 group-hover:w-10 group-hover:bg-gold transition-all duration-300" />
                      <p className="text-ivory/85 text-sm leading-relaxed font-sans">
                        {p.text}
                      </p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section-py section-dark border-t border-gold/10">
        <div className="container-site max-w-2xl mx-auto text-center">
          <FadeIn>
            <span className="text-[10px] text-gold tracking-[0.25em] uppercase font-semibold font-sans">
              {t.mission.bottomLabel}
            </span>
            <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-ivory mt-4 leading-tight">
              {t.mission.bottomTitle}
            </h2>
            <div className="gold-line-center" />
            <p className="text-ivory/85 text-base leading-relaxed font-sans mb-10">
              {t.mission.bottomText}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/publications" className="btn-solid-gold">
                {t.mission.bottomBtn1}
              </Link>
              <Link to="/committees" className="btn-outline-gold">
                {t.mission.bottomBtn2}
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}

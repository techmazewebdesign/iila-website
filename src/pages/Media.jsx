import { Link } from 'react-router-dom'
import FadeIn from '../components/FadeIn'
import SectionTitle from '../components/SectionTitle'
import CTASection from '../components/CTASection'
import SEO from '../components/SEO'
import { useTranslation } from '../i18n'

const COMMENTARY_AREAS = [
  'Human Rights Violations & International Accountability',
  'Constitutional Crisis & Legal Legitimacy',
  'International Sanctions & Legal Mechanisms',
  'Rule of Law & Judicial Independence',
  'Transitional Justice & Accountability Frameworks',
  'Constitutional Design for a Democratic Iran',
  'Minority Rights & Equal Protection',
  'Iran and International Human Rights Law',
  'Legal Analysis of UN & International Mechanisms',
  'Comparative Constitutional Law',
]

const PLACEHOLDER_STATEMENTS = [
  {
    type: 'Press Statement',
    title: 'IILA Welcomes UN Fact-Finding Mission Mandate on Iran',
    date: 'Forthcoming',
    summary: 'The Iranian International Lawyers Association welcomes the renewal and expansion of the UN Human Rights Council Fact-Finding Mission on Iran and calls for full legal accountability.',
  },
  {
    type: 'Legal Commentary',
    title: 'Legal Analysis: The Arrest and Trial of Iranian Lawyers',
    date: 'Forthcoming',
    summary: 'A legal analysis of recent proceedings against members of the Iranian legal profession and the international legal obligations violated by these proceedings.',
  },
  {
    type: 'Institutional Statement',
    title: 'IILA Statement on the Protection of Due Process in Iran',
    date: 'Forthcoming',
    summary: 'A formal legal statement on systematic due process violations in Iran and the applicable obligations under international human rights law.',
  },
]

export default function Media() {
  const t = useTranslation()
  return (
    <div>
      <SEO
        title="Media & Press | IILA — Iranian International Lawyers Association"
        description="IILA media resources, press releases, and institutional statements on international law, human rights, and legal developments relevant to Iran."
        path="/media"
      />
      {/* Page Hero */}
      <section className="page-hero">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950 to-navy-900 hidden dark:block" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gold/15" />
        <div className="relative container-site">
          <FadeIn>
            <span className="text-[10px] text-gold tracking-[0.3em] uppercase font-medium font-sans">
              {t.media.heroTag}
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-ivory mt-4 leading-tight max-w-3xl">
              {t.media.heroTitle}
            </h1>
            <div className="gold-line mt-6" />
            <p className="text-ivory/85 text-lg font-sans max-w-2xl leading-relaxed">
              {t.media.heroSubtitle}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Press Statements */}
      <section className="section-py section-mid border-t border-gold/10">
        <div className="container-site">
          <SectionTitle
            label={t.media.statementsLabel}
            title={t.media.statementsTitle}
            className="mb-14"
          />
          <div className="space-y-0">
            {PLACEHOLDER_STATEMENTS.map((item, i) => (
              <FadeIn key={item.title} delay={i * 80}>
                <div className="border-b border-t-border/10 py-8 group hover:border-gold/25 transition-colors duration-300 grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-2">
                    <span className="category-badge">{item.type}</span>
                  </div>
                  <div className="lg:col-span-8">
                    <h3 className="font-serif text-ivory text-xl font-semibold mb-3 group-hover:text-gold transition-colors duration-200">
                      {item.title}
                    </h3>
                    <p className="text-ivory/80 text-sm leading-relaxed font-sans">
                      {item.summary}
                    </p>
                  </div>
                  <div className="lg:col-span-2 flex flex-col items-start lg:items-end gap-3 justify-start">
                    <span className="text-[10px] text-ivory/60 tracking-[0.12em] uppercase font-sans">
                      {item.date}
                    </span>
                    <button className="btn-outline-gold text-[10px] py-2 px-4">
                      Read
                    </button>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Areas of Commentary */}
      <section className="section-py section-dark border-t border-gold/10">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <FadeIn>
              <span className="text-[10px] text-gold tracking-[0.25em] uppercase font-semibold font-sans">
                Expert Commentary
              </span>
              <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-ivory mt-4 leading-tight">
                Areas of Legal Commentary
              </h2>
              <div className="gold-line mt-6" />
              <p className="text-ivory/85 text-base leading-relaxed font-sans">
                IILA provides expert legal commentary and analysis across a wide range of
                Iran-related legal subjects. Journalists, institutions, and media organisations
                are welcome to submit formal inquiries.
              </p>
            </FadeIn>
            <FadeIn delay={100}>
              <div className="grid grid-cols-1 gap-2">
                {COMMENTARY_AREAS.map((area, i) => (
                  <div
                    key={area}
                    className="flex items-center gap-4 border border-gold/08 px-5 py-3.5 hover:border-gold/25 transition-colors duration-200 group"
                  >
                    <div className="w-1 h-4 bg-gold/25 flex-shrink-0 group-hover:bg-gold/60 transition-colors duration-300" />
                    <span className="text-ivory/80 text-sm font-sans group-hover:text-ivory transition-colors duration-200">
                      {area}
                    </span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Expert Quotes placeholder */}
      <section className="section-py section-mid border-t border-gold/10">
        <div className="container-site max-w-3xl mx-auto text-center">
          <FadeIn>
            <span className="text-[10px] text-gold tracking-[0.25em] uppercase font-semibold font-sans">
              Recent Analysis
            </span>
            <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-ivory mt-4 leading-tight">
              Expert Legal Analysis
            </h2>
            <div className="gold-line-center" />
          </FadeIn>
          <FadeIn delay={100}>
            <div className="bg-t-surface border border-gold/20 p-10 lg:p-14 mt-8">
              <div className="w-10 h-px bg-gold/30 mx-auto mb-6" />
              <p className="font-display text-xl lg:text-2xl text-ivory italic leading-relaxed mb-6">
                "IILA's first legal analyses will be published in the coming weeks.
                Subscribe to receive institutional updates and publication notifications."
              </p>
              <div className="w-10 h-px bg-gold/30 mx-auto mb-6" />
              <Link to="/contact" className="btn-outline-gold">
                Subscribe to IILA Publications
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Media Inquiry */}
      <section className="section-py section-dark border-t border-gold/10">
        <div className="container-site max-w-3xl mx-auto text-center">
          <FadeIn>
            <span className="text-[10px] text-gold tracking-[0.25em] uppercase font-semibold font-sans">
              Press
            </span>
            <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-ivory mt-4 leading-tight">
              Media Inquiries
            </h2>
            <div className="gold-line-center" />
            <p className="text-ivory/85 text-base leading-relaxed font-sans mb-4">
              Journalists, editors, and media organisations requiring expert legal commentary
              on Iran-related developments are welcome to contact IILA directly.
            </p>
            <p className="text-ivory/75 text-sm font-sans mb-10">
              Please include your publication, deadline, and the specific legal questions
              on which you require commentary.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/contact" className="btn-solid-gold">
                Media Inquiry
              </Link>
              <a
                href="mailto:info@iila-swiss.org"
                className="btn-outline-gold"
              >
                info@iila-swiss.org
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}

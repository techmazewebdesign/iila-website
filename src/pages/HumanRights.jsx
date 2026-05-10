import { Link } from 'react-router-dom'
import FadeIn from '../components/FadeIn'
import SectionTitle from '../components/SectionTitle'
import CTASection from '../components/CTASection'
import SEO from '../components/SEO'
import { useTranslation } from '../i18n'

/* ── violation cards ── */
function ViolationCard({ title, description, index }) {
  return (
    <FadeIn delay={index * 100}>
      <div className="group border border-t-border/10 hover:border-gold/30 transition-all duration-300 bg-t-surface2/30 p-7 md:p-8">
        <div className="flex items-center gap-3 mb-5">
          <span className="text-[10px] text-gold/60 tracking-[0.22em] uppercase font-semibold font-sans">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="w-8 h-px bg-gold/20 group-hover:w-12 group-hover:bg-gold/50 transition-all duration-300" />
        </div>
        <h3 className="font-serif text-xl md:text-2xl font-semibold text-ivory leading-snug mb-4">
          {title}
        </h3>
        <p className="text-muted text-sm leading-relaxed font-sans">
          {description}
        </p>
      </div>
    </FadeIn>
  )
}

export default function HumanRights() {
  const t = useTranslation()

  const violations = [
    t.humanRights.systematicRape,
    t.humanRights.illegalArrest,
    t.humanRights.execution,
    t.humanRights.politicalPrisoners,
    t.humanRights.massKillings,
  ]

  return (
    <div>
      <SEO
        title="Human Rights | IILA — Documentation & Accountability for Iran"
        description="IILA documents systematic human rights violations in Iran — systematic rape, illegal arrest, execution, political prisoners, and mass killings of protesters — through the humaninchain.org initiative."
        path="/human-rights"
      />

      {/* ── Page Hero ── */}
      <section className="page-hero">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950 to-navy-900 hidden dark:block" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gold/15" />
        <div className="relative container-site">
          <FadeIn>
            <span className="text-[10px] text-gold tracking-[0.3em] uppercase font-medium font-sans">
              {t.humanRights.heroTag}
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-ivory mt-4 leading-tight max-w-4xl">
              {t.humanRights.heroTitle}
            </h1>
            <div className="gold-line mt-6" />
            <p className="text-ivory/85 text-lg font-sans max-w-2xl leading-relaxed">
              {t.humanRights.heroSubtitle}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Human In Chain Platform ── */}
      <section className="section-py section-alt border-b border-gold/10">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-5">
              <FadeIn>
                <span className="text-[10px] text-gold tracking-[0.25em] uppercase font-semibold font-sans">
                  {t.humanRights.platformTag}
                </span>
                <div className="w-12 h-px bg-gold/40 mt-5 mb-8" />

                {/* Human In Chain logo mark */}
                <div className="mb-8 inline-flex items-center gap-3 border border-gold/20 rounded-sm px-6 py-5 bg-t-surface/40">
                  <img
                    src="/images/humaninchain.jpg"
                    alt="Human In Chain logo"
                    className="flex-shrink-0 w-auto h-auto max-w-[140px] object-contain self-center"
                  />
                  <div>
                    <h2 className="font-serif text-xl text-ivory font-semibold tracking-wide">
                      {t.humanRights.platformTitle}
                    </h2>
                    <p className="text-gold text-[10px] tracking-[0.15em] uppercase font-semibold font-sans mt-0.5">
                      {t.humanRights.platformTag}
                    </p>
                  </div>
                </div>

                <h3 className="font-serif text-2xl md:text-3xl font-semibold text-ivory leading-snug mb-5">
                  {t.humanRights.platformSubtitle}
                </h3>
              </FadeIn>
            </div>
            <div className="lg:col-span-7">
              <FadeIn delay={100}>
                <p className="text-ivory/85 text-base font-sans leading-relaxed mb-5">
                  {t.humanRights.platformDesc1}
                </p>
                <p className="text-ivory/75 text-sm font-sans leading-relaxed mb-8">
                  {t.humanRights.platformDesc2}
                </p>
                <a
                  href="https://humaninchain.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-solid-gold inline-flex"
                >
                  {t.humanRights.platformLink}
                </a>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ── Systematic Violations ── */}
      <section className="section-py section-dark border-t border-gold/10">
        <div className="container-site">
          <SectionTitle
            label={t.humanRights.violationsLabel}
            title={t.humanRights.violationsTitle}
            subtitle={t.humanRights.violationsSubtitle}
            className="mb-16"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
            {violations.map((v, i) => (
              <ViolationCard key={v.title} title={v.title} description={v.description} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Methodology ── */}
      <section className="section-py section-alt border-t border-gold/10">
        <div className="container-site max-w-3xl">
          <FadeIn>
            <span className="text-[9px] text-gold/70 tracking-[0.32em] uppercase font-semibold font-sans">
              {t.humanRights.methodLabel}
            </span>
            <div className="w-12 h-px bg-gold/40 mt-5 mb-8" />
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-ivory mb-4">
              {t.humanRights.methodTitle}
            </h2>
          </FadeIn>
          <div className="space-y-0 mt-8">
            {t.humanRights.methodItems.map((item, i) => (
              <FadeIn key={item} delay={i * 80}>
                <div className="flex items-start gap-4 border-b border-t-border/10 py-5 group hover:border-gold/25 transition-colors duration-200">
                  <span className="text-gold text-xs font-sans font-semibold pt-0.5 flex-shrink-0 w-6">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-muted text-sm font-sans leading-relaxed">
                    {item}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        label={t.humanRights.ctaTitle}
        title={t.humanRights.ctaTitle}
        subtitle={t.humanRights.ctaSubtitle}
        buttons={[
          { label: t.humanRights.ctaBtn, href: 'https://humaninchain.org', external: true },
          { label: t.ctaShort, to: '/contact' },
        ]}
      />
    </div>
  )
}

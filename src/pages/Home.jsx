import { Link } from 'react-router-dom'
import FadeIn from '../components/FadeIn'
import SectionTitle from '../components/SectionTitle'
import CTASection from '../components/CTASection'
import SEO from '../components/SEO'
import { useTranslation } from '../i18n'

const LOGO_SRC = '/images/iilia_logo_website.JPG'

const SCHEMA_ORG = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://iila-swiss.org/#organization',
      name: 'Iranian International Lawyers Association',
      alternateName: 'IILA',
      url: 'https://iila-swiss.org',
      logo: {
        '@type': 'ImageObject',
        '@id': 'https://iila-swiss.org/#logo',
        url: 'https://iila-swiss.org/images/iilia_logo_website.JPG',
        contentUrl: 'https://iila-swiss.org/images/iilia_logo_website.JPG',
        caption: 'Iranian International Lawyers Association',
      },
      image: { '@id': 'https://iila-swiss.org/#logo' },
      email: 'info@iilia-swiss.org',
      foundingLocation: { '@type': 'Place', name: 'Switzerland', addressCountry: 'CH' },
      description: 'IILA is an independent international lawyers association advancing rule of law, human rights, legal research, and institutional legal frameworks for Iran\'s future.',
      sameAs: ['https://iila-swiss.org'],
      knowsAbout: ['International Law', 'Human Rights Law', 'Constitutional Law', 'Rule of Law', 'Transitional Justice', 'Legal Research'],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://iila-swiss.org/#website',
      name: 'Iranian International Lawyers Association',
      alternateName: 'IILA',
      url: 'https://iila-swiss.org',
      inLanguage: 'en-US',
      publisher: { '@id': 'https://iila-swiss.org/#organization' },
    },
  ],
}

const AUDIENCE = [
  'Policy Institutions',
  'Universities & Academia',
  'Bar Associations',
  'Human Rights Organisations',
  'Media & Journalists',
  'Iranian Legal Professionals',
]

const getPillars = (t) => t.home.pillars || []

export default function Home() {
  const t = useTranslation()
  return (
    <div>
      <SEO
        title="Iranian International Lawyers Association (IILA) | Rule of Law, Human Rights & Legal Research for Iran"
        description="IILA is an independent, non-profit international lawyers association registered in Switzerland. We advance rule of law, human rights, legal research, and institutional frameworks for Iran's democratic future."
        path="/"
        schema={SCHEMA_ORG}
        keywords="Iranian International Lawyers Association, IILA, rule of law Iran, human rights Iran, legal research Iran, international lawyers, Swiss-registered non-profit, Iranian democracy, constitutional law, transitional justice, legal infrastructure"
      />
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="hero-home relative min-h-screen flex items-center overflow-hidden">
        {/* Hero background image */}
        <div
          className="absolute inset-0 z-0"
          aria-hidden="true"
          style={{
            backgroundImage: 'url(/images/hero.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />

        {/* White gradient overlay on left for text readability */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          aria-hidden="true"
          style={{
            background: 'linear-gradient(to right, rgba(250,249,246,0.95) 0%, rgba(250,249,246,0.85) 40%, rgba(250,249,246,0.4) 70%, rgba(250,249,246,0.1) 100%)',
          }}
        />

        {/* Bottom separator */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent z-20" />

        <div className="relative container-site pt-32 pb-20 lg:pt-44 lg:pb-28 w-full z-20">
          <div className="max-w-2xl lg:max-w-2xl">

            {/* Label */}
            <div className="anim-fade-in-up opacity-0-init flex items-center gap-3 mb-8">
              <div className="w-8 h-px bg-gold" />
              <span className="text-[10px] text-gold tracking-[0.32em] uppercase font-medium font-sans">
                {t.home.heroTag}
              </span>
            </div>

            {/* H1 */}
            <h1 className="anim-fade-in-up anim-delay-1 opacity-0-init font-serif text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-semibold text-t-text leading-[1.08] mb-6 dark:text-black">
              {t.home.heroTitle}
            </h1>

            {/* Gold line */}
            <div className="anim-fade-in-up anim-delay-2 opacity-0-init w-14 h-0.5 bg-gold mb-7 rounded-full" />

            {/* Mission text */}
            <p className="anim-fade-in-up anim-delay-3 opacity-0-init text-muted text-base lg:text-lg leading-relaxed font-sans max-w-lg mb-3 dark:text-black">
              {t.home.heroSubtitle}
            </p>
            <p className="anim-fade-in-up anim-delay-4 opacity-0-init text-sm leading-relaxed font-sans max-w-md mb-10">
              <span className="text-gold font-semibold dark:text-black">{t.home.trust1}</span>
              <span className="text-t-muted mx-2 dark:text-black">·</span>
              <span className="text-gold font-semibold dark:text-black">{t.home.trust2}</span>
              <span className="text-t-muted mx-2 dark:text-black">·</span>
              <span className="text-gold font-semibold dark:text-black">{t.home.trust3}</span>
            </p>

            {/* CTAs */}
            <div className="anim-fade-in-up anim-delay-5 opacity-0-init flex flex-wrap gap-4">
              <Link to="/mission" className="btn-solid-burgundy">
                {t.home.heroCta1}
              </Link>
              <Link to="/contact" className="btn-outline-gold">
                {t.home.heroCta2}
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── FOUR PILLARS ─────────────────────────────────── */}
      <section className="section-alt section-py">
        <div className="container-site">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {getPillars(t).map((p, i) => (
              <FadeIn key={p.num} delay={i * 80}>
                <div className="bg-t-surface border border-t-border/10 rounded-sm p-7 hover:border-t-gold/35 hover:-translate-y-1 transition-all duration-300 group h-full" style={{ boxShadow: '0 1px 4px rgba(12,28,53,0.05)' }}>
                  <span className="text-t-gold font-serif text-2xl font-bold block mb-4">
                    {p.num}
                  </span>
                  <h3 className="font-serif text-t-text text-base font-semibold mb-3 leading-[1.35]">
                    {p.title}
                  </h3>
                  <p className="text-t-muted text-sm leading-[1.8] font-sans">
                    {p.text}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY IILA EXISTS ───────────────────────────────── */}
      <section className="section-py section-dark border-t border-white/5">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <SectionTitle label={t.home.whyLabel} title={t.home.whyTitle} align="left" />
            <FadeIn delay={150}>
              <p className="text-t-muted text-base lg:text-lg leading-[1.85] font-sans mb-8">
                {t.home.whyText}
              </p>
              <Link to="/about" className="btn-solid-burgundy">
                {t.home.whyCta}
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── IRAN TODAY / IRAN TOMORROW ───────────────────── */}
      <section className="section-alt section-py border-t border-t-border/10">
        <div className="container-site">
          <SectionTitle
            label={t.home.dualMandateLabel}
            title={t.home.dualMandateTitle}
            className="mb-14"
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              {
                label: t.home.presentLabel,
                title: t.home.presentTitle,
                text: t.home.presentText,
                link: '/publications',
                linkLabel: t.home.presentCta,
              },
              {
                label: t.home.futureLabel,
                title: t.home.futureTitle,
                text: t.home.futureText,
                link: '/roadmap',
                linkLabel: t.home.futureCta,
              },
            ].map((card, i) => (
              <FadeIn key={card.title} delay={i * 120}>
                <div className="bg-t-surface border border-t-border/10 rounded-sm p-10 hover:border-t-gold/35 hover:-translate-y-1 transition-all duration-300 group h-full flex flex-col" style={{ boxShadow: '0 1px 4px rgba(12,28,53,0.05)' }}>
                  <span className="text-[9.5px] text-t-gold tracking-[0.26em] uppercase font-bold font-sans dark:text-white">
                    {card.label}
                  </span>
                  <div className="w-7 h-px bg-t-gold/40 my-4 group-hover:w-12 group-hover:bg-t-gold transition-all duration-300" />
                  <h3 className="font-serif text-t-text text-2xl lg:text-[1.65rem] font-semibold mb-5 leading-[1.25] group-hover:text-t-gold transition-colors duration-250">
                    {card.title}
                  </h3>
                  <p className="text-t-muted text-base leading-[1.85] font-sans flex-1 mb-8">
                    {card.text}
                  </p>
                  <Link to={card.link} className="btn-outline-gold self-start">
                    {card.linkLabel}
                  </Link>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── INSTITUTIONAL ROLE QUOTE ─────────────────────── */}
      <section className="section-alt section-py border-t border-t-border/10">
        <div className="container-site max-w-3xl mx-auto text-center">
          <FadeIn>
            <div className="bg-t-surface border border-t-border/10 rounded-sm p-12 lg:p-16 relative overflow-hidden" style={{ boxShadow: '0 1px 4px rgba(12,28,53,0.05)' }}>
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-t-gold to-transparent opacity-50" />
              <div className="w-8 h-px bg-t-gold mx-auto mb-8 opacity-60" />
              <p className="font-display text-[1.4rem] lg:text-[1.7rem] text-t-text italic leading-[1.65] mb-8 opacity-80 dark:text-white">
                {t.home.quote}
              </p>
              <div className="w-8 h-px bg-t-gold/40 mx-auto mb-6" />
              <span className="text-t-muted text-[9.5px] tracking-[0.24em] uppercase font-sans dark:text-white">
                {t.home.quoteAttribution}
              </span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── AUDIENCE GRID ────────────────────────────────── */}
      <section className="section-py section-dark border-t border-white/5">
        <div className="container-site">
          <SectionTitle
            label={t.home.audienceLabel}
            title={t.home.audienceTitle}
            subtitle={t.home.audienceSubtitle}
            className="mb-12"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {(t.home.audience || []).map((item, i) => (
              <FadeIn key={item} delay={i * 55}>
                <div className="bg-t-surface border border-t-border/10 px-4 py-5 text-center hover:border-t-gold/35 hover:-translate-y-0.5 transition-all duration-300 group rounded-sm" style={{ boxShadow: '0 1px 3px rgba(12,28,53,0.04)' }}>
                  <div className="w-4 h-px bg-t-gold/40 mx-auto mb-3 group-hover:w-7 group-hover:bg-t-gold transition-all duration-300" />
                  <p className="text-t-muted text-[10.5px] tracking-[0.06em] uppercase font-sans leading-[1.5]">
                    {item}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
      <CTASection
        label={t.home.ctaTitle}
        title={t.home.ctaTitle}
        subtitle={t.home.ctaSubtitle}
        buttons={[
          { label: t.home.ctaBtn1, to: '/contact' },
        ]}
      />
    </div>
  )
}

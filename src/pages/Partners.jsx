import { Link } from 'react-router-dom'
import FadeIn from '../components/FadeIn'
import SectionTitle from '../components/SectionTitle'
import CTASection from '../components/CTASection'
import SEO from '../components/SEO'
import { useTranslation } from '../i18n'

const COLLABORATIONS = [
  {
    title: 'Legal Research Support',
    description:
      'IILA provides rigorous legal research, structured analysis, and legal memoranda on specific legal questions relevant to an institution\'s Iran-focused work.',
  },
  {
    title: 'Human Rights Documentation',
    description:
      'Rigorous legal documentation of systematic human rights violations in Iran, including evidence collection, case analysis, and international accountability preparation through our humaninchain.org initiative.',
  },
  {
    title: 'Expert Legal Commentary',
    description:
      'IILA makes available expert legal commentary from qualified Iranian and international legal professionals for reports, publications, and institutional documents.',
  },
  {
    title: 'Joint Reports',
    description:
      'Co-authored legal and policy reports combining IILA\'s legal expertise with an institution\'s subject matter knowledge, produced to the highest professional standards.',
  },
  {
    title: 'Academic Cooperation',
    description:
      'Cooperation with universities, law faculties, and research centres on Iran-related legal research, publications, conferences, and academic programmes.',
  },
  {
    title: 'Bar Association Cooperation',
    description:
      'Engagement with national and international bar associations on legal profession development, judicial independence, and the institutional reform of Iran\'s legal system.',
  },
  {
    title: 'International Advocacy Support',
    description:
      'Legal expertise and documentation support for advocacy before international bodies, UN mechanisms, regional human rights courts, and international legal forums.',
  },
  {
    title: 'Media & Institutional Inquiries',
    description:
      'IILA welcomes inquiries from journalists, media organisations, and institutional communications teams requiring expert legal perspective on Iran-related developments.',
  },
]

const INSTITUTION_TYPES = [
  'Think Tanks & Policy Institutions',
  'Universities & Law Faculties',
  'National & International Bar Associations',
  'United Nations Bodies & Offices',
  'International Human Rights Organisations',
  'Legal Scholars & Researchers',
  'Journalists & Media Organisations',
  'Democratic Governance Initiatives',
  'Transitional Justice Organisations',
  'International Law Institutes',
]

export default function Partners() {
  const t = useTranslation()
  return (
    <div>
      <SEO
        title="Partners & Collaborators | IILA International Network"
        description="IILA collaborates with international legal institutions, academic bodies, and civil society organisations committed to the rule of law and Iran's legal future."
        path="/partners"
      />
      {/* Page Hero */}
      <section className="page-hero">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950 to-navy-900 hidden dark:block" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gold/15" />
        <div className="relative container-site">
          <FadeIn>
            <span className="text-[10px] text-gold tracking-[0.3em] uppercase font-medium font-sans">
              {t.partners.heroTag}
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-ivory mt-4 leading-tight max-w-3xl">
              {t.partners.heroTitle}
            </h1>
            <div className="gold-line mt-6" />
            <p className="text-ivory/85 text-lg font-sans max-w-2xl leading-relaxed">
              {t.partners.heroSubtitle}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Strategic positioning */}
      <section className="section-py section-mid border-t border-gold/10">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-5">
              <FadeIn>
                <span className="text-[10px] text-gold tracking-[0.25em] uppercase font-semibold font-sans">
                  {t.partners.positioningLabel}
                </span>
                <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-ivory mt-4 leading-tight">
                  {t.partners.positioningTitle}
                </h2>
                <div className="gold-line mt-6" />
              </FadeIn>
            </div>
            <div className="lg:col-span-7">
              <FadeIn delay={100}>
                <div className="border-l-2 border-gold/30 pl-8 mb-8">
                  <p className="font-display text-xl lg:text-2xl text-ivory italic leading-relaxed">
                    "IILA does not seek to duplicate the work of existing organisations.
                    We seek to strengthen Iran-focused initiatives through independent legal
                    analysis, legal research, legal memoranda, and institutional
                    legal expertise."
                  </p>
                </div>
                <p className="text-ivory/85 text-base leading-relaxed font-sans mb-6">
                  IILA is designed to be a legal infrastructure partner. Organisations working
                  on Iran-related policy, human rights, democracy promotion, or institutional
                  reform can draw on IILA's legal expertise to strengthen their work — without
                  duplication, without competition, and without compromising independence.
                </p>
                <p className="text-ivory/75 text-sm leading-relaxed font-sans">
                  IILA references to institutions such as NUFDI represent the type of organisation
                  IILA seeks to be useful to. Such references do not imply partnership, endorsement,
                  or affiliation unless expressly confirmed.
                </p>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Collaboration Types */}
      <section className="section-py section-dark border-t border-gold/10">
        <div className="container-site">
          <FadeIn className="text-center mb-14">
            <span className="text-[10px] text-gold tracking-[0.25em] uppercase font-semibold font-sans">
              {t.partners.collaborationLabel}
            </span>
            <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-ivory mt-4 leading-tight">
              {t.partners.collaborationTitle}
            </h2>
            <div className="gold-line-center" />
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {COLLABORATIONS.map((item, i) => (
              <FadeIn key={item.title} delay={i * 60}>
                <div className="bg-t-surface border border-gold/20 p-7 hover:border-gold/50 hover:bg-t-surface2 transition-all duration-300 group h-full">
                  <span className="text-[10px] text-gold tracking-[0.15em] font-semibold font-sans">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="w-6 h-px bg-gold/30 my-3 group-hover:w-10 group-hover:bg-gold transition-all duration-300" />
                  <h3 className="font-serif text-ivory text-base font-semibold mb-3 leading-snug group-hover:text-gold transition-colors duration-200">
                    {item.title}
                  </h3>
                  <p className="text-ivory/80 text-sm leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Intended Institutions */}
      <section className="section-py section-mid border-t border-gold/10">
        <div className="container-site">
          <FadeIn className="mb-12">
            <span className="text-[10px] text-gold tracking-[0.25em] uppercase font-semibold font-sans">
              {t.partners.institutionLabel}
            </span>
            <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-ivory mt-4 leading-tight max-w-xl">
              {t.partners.institutionTitle}
            </h2>
            <div className="gold-line mt-6" />
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
            {INSTITUTION_TYPES.map((type, i) => (
              <FadeIn key={type} delay={i * 50}>
                <div className="flex items-center gap-4 border border-t-border/10 px-5 py-4 group hover:border-gold/30 transition-colors duration-200">
                  <div className="w-1 h-5 bg-gold/30 flex-shrink-0 group-hover:bg-gold transition-colors duration-300" />
                  <p className="text-ivory/80 text-sm font-sans group-hover:text-ivory transition-colors duration-200">
                    {type}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-py section-dark border-t border-gold/10">
        <div className="container-site max-w-3xl mx-auto text-center">
          <FadeIn>
            <span className="text-[10px] text-gold tracking-[0.25em] uppercase font-semibold font-sans">
              {t.partners.ctaLabel}
            </span>
            <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-ivory mt-4 leading-tight">
              {t.partners.ctaTitle}
            </h2>
            <div className="gold-line-center" />
            <p className="text-ivory/85 text-base leading-relaxed font-sans mb-10">
              {t.partners.ctaSubtitle}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/contact" className="btn-solid-gold">
                {t.partners.ctaBtn}
              </Link>
              <Link to="/contact" className="btn-outline-gold">
                {t.partners.ctaBtn}
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}

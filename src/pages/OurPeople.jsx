import FadeIn from '../components/FadeIn'
import SEO from '../components/SEO'
import { useTranslation } from '../i18n'

const ORG_REF = { '@id': 'https://iila-swiss.org/#organization' }

const PEOPLE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'IILA Team',
  description: 'Legal professionals and researchers at the Iranian International Lawyers Association',
  itemListElement: [
    {
      '@type': 'ListItem', position: 1,
      item: {
        '@type': 'Person',
        name: 'Reza Ostad',
        jobTitle: 'Founder, CEO & Senior Partner',
        worksFor: ORG_REF,
        hasCredential: 'L.LB, L.LM, ICA/UK',
        image: 'https://iila-swiss.org/images/Reza-ostad.JPG',
      },
    },
    {
      '@type': 'ListItem', position: 2,
      item: {
        '@type': 'Person',
        name: 'Dr. Shima Bozorgi',
        jobTitle: 'Senior Legal Scholar & Policy Specialist',
        worksFor: ORG_REF,
        hasCredential: 'LL.B., LL.M., M.S., S.J.D.',
        image: 'https://iila-swiss.org/images/Dr.Shima-bozorgi.PNG',
        knowsAbout: ['Government Law', 'National Security', 'International Human Rights Law', 'Constitutional Law', 'Strategic Leadership'],
        homeLocation: { '@type': 'Place', name: 'United States' },
      },
    },
    {
      '@type': 'ListItem', position: 3,
      item: {
        '@type': 'Person',
        name: 'Holly H. Gilani',
        jobTitle: 'Senior Legal Counsel & Arbitration Specialist',
        worksFor: ORG_REF,
        hasCredential: 'LL.M., J.D.',
        image: 'https://iila-swiss.org/images/Holly_Gilani.PNG',
        knowsAbout: ['Trust & Estate Law', 'Complex Commercial Disputes', 'Governance', 'Fiduciary Duties', 'Cross-Border Matters', 'International Arbitration'],
        homeLocation: { '@type': 'Place', name: 'United States' },
      },
    },
    {
      '@type': 'ListItem', position: 4,
      item: {
        '@type': 'Person',
        name: 'Mohammad Hossein Heidarpour',
        jobTitle: 'Founder',
        worksFor: ORG_REF,
        hasCredential: 'LLB, LLM, PhD Candidate in Law; Iranian Certified Attorney-at-Law',
        image: 'https://iila-swiss.org/images/Mohammad-hossein-heidarpour.JPG',
        knowsAbout: ['International Business Law', 'Technology Law', 'Innovation Law'],
      },
    },
    {
      '@type': 'ListItem', position: 5,
      item: {
        '@type': 'Person',
        name: 'Mohammad Faghani',
        jobTitle: 'Founder',
        worksFor: ORG_REF,
        hasCredential: 'LLB, LLM, PhD Candidate in Law',
        image: 'https://iila-swiss.org/images/mohammad-Faghani.JPG',
        knowsAbout: ['International Law', 'Environmental Law', 'Dispute Resolution'],
        homeLocation: { '@type': 'Place', name: 'Maastricht, Netherlands' },
      },
    },
    {
      '@type': 'ListItem', position: 6,
      item: {
        '@type': 'Person',
        name: 'Yasmin Whitmer',
        jobTitle: 'Business Law Attorney',
        worksFor: ORG_REF,
        hasCredential: 'J.D.',
        image: 'https://iila-swiss.org/images/Yasmin-whitmer.PNG',
        homeLocation: { '@type': 'Place', name: 'United States' },
      },
    },
    {
      '@type': 'ListItem', position: 7,
      item: {
        '@type': 'Person',
        name: 'Roozbeh Ostad',
        jobTitle: 'Head of IT',
        worksFor: ORG_REF,
        hasCredential: 'B.A. Business Management',
        image: 'https://iila-swiss.org/images/Roozbeh-ostad.JPG',
      },
    },
  ],
}

const FOUNDERS = [
  {
    name: 'Reza Ostad',
    role: 'Founder, CEO & Senior Partner',
    qualifications: 'L.LB · L.LM · ICA/UK',
    description:
      'Founder and senior legal figure of IILA, providing leadership, strategic direction, and institutional vision for the association.',
    photo: '/images/Reza-ostad.JPG',
    order: 1,
  },
  {
    name: 'Dr. Shima Bozorgi',
    role: 'Senior Legal Scholar & Policy Specialist',
    qualifications: 'LL.B. · LL.M. · M.S. · S.J.D.\nUnited States',
    description:
      'Specializes in government law and policy, national security, international human rights law, constitutional law, and strategic leadership.',
    photo: '/images/Dr.Shima-bozorgi.PNG',
    order: 2,
  },
  {
    name: 'Holly H. Gilani',
    role: 'Senior Legal Counsel & Arbitration Specialist',
    qualifications: 'LL.M. · J.D.\nUnited States',
    description:
      'Senior legal professional with 25+ years of experience in trust, estate, complex commercial disputes, governance, fiduciary duties, cross-border matters, and international arbitration.',
    photo: '/images/Holly_Gilani.PNG',
    order: 3,
  },
  {
    name: 'Mohammad Hossein Heidarpour',
    role: 'Founder',
    qualifications: 'LLB · LLM · PhD Candidate in Law\nIranian Certified Attorney-at-Law',
    description:
      'Specialised in International Business Law, innovation-related legal matters, and technology disputes.',
    photo: '/images/Mohammad-hossein-heidarpour.JPG',
    order: 4,
  },
  {
    name: 'Mohammad Faghani',
    role: 'Founder',
    qualifications: 'LLB · LLM · PhD Candidate in Law',
    description:
      'International law specialist focusing on environmental dispute resolution and compensation mechanisms. Based in Maastricht, the Netherlands.',
    photo: '/images/mohammad-Faghani.JPG',
    order: 5,
  },
  {
    name: 'Yasmin Whitmer, J.D.',
    role: 'Business Law Attorney',
    qualifications: 'J.D.\nUnited States',
    description:
      'Practising business law attorney with expertise in corporate governance, commercial transactions, and cross-border legal advisory.',
    photo: '/images/Yasmin-whitmer.PNG',
    order: 6,
  },
  {
    name: 'Roozbeh Ostad',
    role: 'Head of IT',
    qualifications: 'B.A. Business Management',
    description:
      'Leads digital infrastructure, technical systems, and technology operations supporting the association\'s online and institutional presence.',
    photo: '/images/Roozbeh-ostad.JPG',
    order: 7,
  },
]

function MemberCard({ founder, delay = 0 }) {
  return (
    <FadeIn delay={delay}>
      <article
        className="group flex flex-col bg-t-surface rounded-sm overflow-hidden transition-all duration-300 hover:-translate-y-1"
        style={{ boxShadow: '0 2px 20px rgba(0,0,0,0.22)' }}
        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 8px 40px rgba(0,0,0,0.32), 0 0 0 1px rgba(212,175,55,0.25)' }}
        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 20px rgba(0,0,0,0.22)' }}
      >
        {/* Photo */}
        <div className="w-full overflow-hidden bg-t-surface2" style={{ aspectRatio: '4/5' }}>
          <img
            src={founder.photo}
            alt={`Profile photo of ${founder.name}, ${founder.role} at IILA`}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
            draggable={false}
          />
        </div>

        {/* Gold accent line */}
        <div className="h-0.5 bg-gradient-to-r from-gold/80 via-gold to-gold/40 w-full" />

        {/* Info */}
        <div className="flex flex-col flex-1 px-6 py-6">
          {/* Role badge */}
          <span className="text-[9px] text-gold tracking-[0.28em] uppercase font-semibold font-sans mb-2">
            {founder.role}
          </span>

          {/* Name */}
          <h3 className="font-serif text-t-text text-lg font-semibold leading-snug mb-2">
            {founder.name}
          </h3>

          {/* Thin gold divider */}
          <div className="w-8 h-px bg-gold/50 mb-3" />

          {/* Qualifications */}
          <p className="text-t-muted text-[11px] tracking-wide font-sans leading-relaxed mb-4 whitespace-pre-line">
            {founder.qualifications}
          </p>

          {/* Description */}
          <p className="text-t-text/70 text-sm font-sans leading-relaxed flex-1">
            {founder.description}
          </p>
        </div>
      </article>
    </FadeIn>
  )
}

export default function OurPeople() {
  const t = useTranslation()
  return (
    <div>
      <SEO
        title="Our People | IILA Legal Professionals & Researchers"
        description="Meet the legal professionals, researchers, and specialists at IILA committed to the rule of law, institutional accountability, and Iran's legal future."
        path="/our-people"
        schema={PEOPLE_SCHEMA}
      />
      {/* ── Page Hero ── */}
      <section className="page-hero">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="relative container-site">
          <FadeIn>
            <span className="text-[10px] text-gold tracking-[0.3em] uppercase font-medium font-sans">
              {t.ourPeople.heroTag}
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-ivory mt-4 leading-tight max-w-3xl">
              {t.ourPeople.heroTitle}
            </h1>
            <div className="w-12 h-px bg-gold mt-6 mb-5" />
            <p className="text-muted/80 text-lg font-sans max-w-2xl leading-relaxed">
              {t.ourPeople.heroSubtitle}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Founder Grid ── */}
      <section className="section-py section-dark border-t border-white/5">
        <div className="container-site">

          {/* Intro text */}
          <FadeIn>
            <p className="text-muted/60 text-base font-sans leading-relaxed max-w-2xl mb-14">
              {t.ourPeople.intro}
            </p>
          </FadeIn>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FOUNDERS.map((founder, i) => (
              <MemberCard key={founder.name} founder={founder} delay={i * 90} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Join Network CTA ── */}
      <section className="section-py section-alt border-t border-t-border/5">
        <div className="container-site max-w-2xl mx-auto text-center">
          <FadeIn>
            <span className="text-[10px] text-gold tracking-[0.3em] uppercase font-medium font-sans">
              {t.ourPeople.ctaTag}
            </span>
            <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-ivory mt-4 mb-5 leading-tight">
              {t.ourPeople.ctaTitle}
            </h2>
            <div className="gold-line-center" />
            <p className="text-muted/50 text-base leading-relaxed font-sans mb-10">
              {t.ourPeople.ctaSubtitle}
            </p>
            <a href="/expert-network" className="btn-outline-gold">
              {t.ourPeople.ctaBtn}
            </a>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}

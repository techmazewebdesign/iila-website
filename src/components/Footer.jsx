import { Link } from 'react-router-dom'
import IILALogo from './IILALogo'
import { useTranslation } from '../i18n'

export default function Footer() {
  const t = useTranslation()
  const year = new Date().getFullYear()

  const cols = [
    {
      heading: t.footer.orgCol,
      items: [
        { label: t.header.about,       to: '/about' },
        { label: t.header.ourPeople,    to: '/our-people' },
        { label: t.header.mission,      to: '/mission' },
        { label: 'Legal Committees',    to: '/committees' },
        { label: t.header.ourPeople === 'اعضای بنیان‌گذار' ? 'شبکه متخصصان' : 'Expert Network', to: '/expert-network' },
      ],
    },
    {
      heading: t.footer.researchCol,
      items: [
        { label: t.header.publications,  to: '/publications' },
        { label: t.header.humanRights === 'حقوق بشر' ? 'حقوق بشر' : 'Human Rights', to: '/human-rights' },
        { label: 'Legal Roadmap',        to: '/roadmap' },
        { label: 'Media & Commentary',   to: '/media' },
      ],
    },
    {
      heading: t.footer.collabCol,
      items: [
        { label: t.header.partners,         to: '/partners' },
        { label: t.cta,                     to: '/contact' },
        { label: t.header.ourPeople === 'اعضای بنیان‌گذار' ? 'شبکه متخصصان' : 'Expert Network', to: '/expert-network' },
        { label: 'Submit Research',         to: '/contact' },
      ],
    },
  ]

  return (
    <footer className="bg-navy-900" style={{ borderTop: '1px solid rgba(155,125,58,0.20)' }}>

      {/* ── Top accent line ── */}
      <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(155,125,58,0.5) 40%, rgba(155,125,58,0.5) 60%, transparent)' }} />

      {/* ── Main grid ── */}
      <div className="container-site pt-16 pb-12 lg:pt-20 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10">

          {/* Brand column */}
          <div className="lg:col-span-4">
            <IILALogo size={52} showText={true} light={true} />
            <div className="w-10 h-px mt-6 mb-5" style={{ background: 'rgba(155,125,58,0.60)' }} />
            <p className="text-sm font-sans leading-[1.85] max-w-xs mb-6 text-white/90 dark:text-white">
              {t.footer.description}
            </p>
            <div className="space-y-3">
              <a
                href={`mailto:${t.footer.email}`}
                className="flex items-center gap-2.5 text-sm font-sans tracking-wide group transition-all duration-300"
                style={{ color: '#C4A455', textDecoration: 'none' }}
              >
                <span className="h-px group-hover:w-5 transition-all duration-300" style={{ width: '12px', background: '#C4A455' }} />
                {t.footer.email}
              </a>
              <p className="flex items-center gap-2.5 text-sm font-sans tracking-wide" style={{ color: '#8A9AB0' }}>
                <span className="w-3 h-px" style={{ background: '#8A9AB0' }} />
                iilia-swiss.org · {t.footer.swissValue}
              </p>
            </div>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-10">
            {cols.map((col) => (
              <div key={col.heading}>
                <h4 className="text-[9.5px] tracking-[0.28em] uppercase font-bold font-sans mb-5" style={{ color: '#C4A455' }}>
                  {col.heading}
                </h4>
                <ul className="space-y-3">
                  {col.items.map((item) => (
                    <li key={item.label + item.to}>
                      <Link
                        to={item.to}
                        className="text-sm font-sans inline-block transition-all duration-300 hover:translate-x-1"
                        style={{ color: '#CBD5E1', textDecoration: 'none' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#C4A455'}
                        onMouseLeave={e => e.currentTarget.style.color = '#CBD5E1'}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="container-site py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs font-sans leading-relaxed max-w-xl" style={{ color: '#6B7D96' }}>
            {t.footer.bottom}
          </p>
          <div className="flex flex-col sm:items-end gap-1 flex-shrink-0">
            <span className="text-xs font-sans" style={{ color: '#6B7D96' }}>
              {t.footer.copyright.replace('{year}', year)}
            </span>
            <a
              href="https://desivo.de"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-sans transition-colors duration-300"
              style={{ color: '#6B7D96', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.color = '#C4A455'}
              onMouseLeave={e => e.currentTarget.style.color = '#6B7D96'}
            >
              {t.footer.credits}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

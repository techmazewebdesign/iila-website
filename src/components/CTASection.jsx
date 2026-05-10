import { Link } from 'react-router-dom'
import FadeIn from './FadeIn'

export default function CTASection({
  label = 'Get Involved',
  title,
  subtitle,
  buttons = [],
  dark = true,
}) {
  const bg = dark ? 'section-dark' : 'section-mid'

  return (
    <section className={`${bg} section-py border-t border-gold/10`}>
      <div className="container-site">
        <FadeIn className="text-center max-w-3xl mx-auto">
          <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-gold font-sans">
            {label}
          </span>
          <h2 className="font-serif text-3xl lg:text-4xl xl:text-5xl font-semibold text-ivory mt-4 leading-tight">
            {title}
          </h2>
          <div className="gold-line-center" />
          {subtitle && (
            <p className="text-ivory/85 text-base lg:text-lg leading-relaxed font-sans mb-10">
              {subtitle}
            </p>
          )}
          {buttons.length > 0 && (
            <div className="flex flex-wrap gap-4 justify-center">
              {buttons.map((btn, i) =>
                btn.to ? (
                  <Link
                    key={i}
                    to={btn.to}
                    className={i === 0 ? 'btn-solid-burgundy' : 'btn-outline-gold'}
                  >
                    {btn.label}
                  </Link>
                ) : (
                  <a
                    key={i}
                    href={btn.href || '#'}
                    target={btn.external ? '_blank' : undefined}
                    rel={btn.external ? 'noopener noreferrer' : undefined}
                    className={i === 0 ? 'btn-solid-burgundy' : 'btn-outline-gold'}
                  >
                    {btn.label}
                  </a>
                )
              )}
            </div>
          )}
        </FadeIn>
      </div>
    </section>
  )
}

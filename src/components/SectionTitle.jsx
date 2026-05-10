import FadeIn from './FadeIn'

export default function SectionTitle({
  label,
  title,
  subtitle,
  align = 'center',
  light = false,
  className = '',
}) {
  const textAlign =
    align === 'center' ? 'text-center items-center' : 'text-left items-start'
  const titleColor = 'text-t-text'
  const labelColor = light ? 'text-t-gold' : 'text-gold'
  const subtitleColor = 'text-t-text'

  return (
    <FadeIn className={`flex flex-col ${textAlign} ${className}`}>
      {label && (
        <div className={`flex items-center gap-2.5 mb-5 ${align === 'center' ? 'justify-center' : ''}`}>
          <span className="w-5 h-px bg-t-gold" />
          <span
            className={`text-[9.5px] font-bold tracking-[0.28em] uppercase ${labelColor} font-sans`}
          >
            {label}
          </span>
          <span className="w-5 h-px bg-t-gold" />
        </div>
      )}
      <h2
        className={`font-serif text-3xl lg:text-4xl xl:text-[2.75rem] font-semibold ${titleColor} leading-[1.18]`}
      >
        {title}
      </h2>
      <div
        className={`w-10 h-[1.5px] my-6 ${align === 'center' ? 'mx-auto' : ''} bg-t-gold`}
      />
      {subtitle && (
        <p
          className={`text-base lg:text-lg max-w-2xl leading-[1.8] ${subtitleColor} opacity-80 font-sans`}
        >
          {subtitle}
        </p>
      )}
    </FadeIn>
  )
}

import FadeIn from './FadeIn'

export default function CommitteeCard({ number, title, description, delay = 0 }) {
  const num = String(number).padStart(2, '0')

  return (
    <FadeIn delay={delay} className="h-full">
      <div className="group border border-t-border/10 bg-t-surface p-7 hover:border-t-gold/40 hover:shadow-card-hover transition-all duration-350 h-full flex flex-col relative overflow-hidden rounded-sm" style={{ boxShadow: '0 1px 4px rgba(12,28,53,0.06)' }}>
        {/* Background number watermark */}
        <span
          className="absolute -top-3 -right-1 font-serif text-8xl font-bold text-t-border/[0.04] select-none leading-none"
          aria-hidden="true"
        >
          {num}
        </span>

        {/* Number */}
        <span className="text-[9px] text-t-gold/70 tracking-[0.22em] uppercase font-bold font-sans mb-5">
          {num}
        </span>

        {/* Divider */}
        <div className="w-5 h-px bg-t-gold/40 mb-5 group-hover:w-9 group-hover:bg-t-gold transition-all duration-300" />

        {/* Title */}
        <h3 className="font-serif text-t-text text-[1.05rem] font-semibold leading-[1.35] mb-3 group-hover:text-t-gold transition-colors duration-250">
          {title}
        </h3>

        {/* Description */}
        <p className="text-t-muted text-sm leading-[1.8] font-sans flex-1">
          {description}
        </p>
      </div>
    </FadeIn>
  )
}

import FadeIn from './FadeIn'

export default function TimelinePhase({ phase, title, description, isLast = false, delay = 0 }) {
  return (
    <FadeIn delay={delay} className="flex gap-6 lg:gap-10">
      {/* Phase indicator column */}
      <div className="flex flex-col items-center flex-shrink-0">
        {/* Circle */}
        <div className="w-10 h-10 rounded-full border-2 border-gold bg-t-bg flex items-center justify-center flex-shrink-0 z-10">
          <span className="text-gold font-serif text-sm font-bold">{phase}</span>
        </div>
        {/* Connecting line */}
        {!isLast && (
          <div className="w-px flex-1 bg-gradient-to-b from-gold/40 to-gold/05 mt-2 min-h-12" />
        )}
      </div>

      {/* Content */}
      <div className={`pb-12 ${isLast ? '' : ''} flex-1`}>
        <div className="text-[10px] text-gold tracking-[0.2em] uppercase font-semibold font-sans mb-2">
          Phase {phase}
        </div>
        <h3 className="font-serif text-ivory text-xl lg:text-2xl font-semibold mb-3">
          {title}
        </h3>
        <div className="w-8 h-px bg-gold/40 mb-4" />
        <p className="text-ivory/80 text-base leading-relaxed font-sans max-w-xl">
          {description}
        </p>
      </div>
    </FadeIn>
  )
}

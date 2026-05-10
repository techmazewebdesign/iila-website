import FadeIn from './FadeIn'

export default function PolicyBriefCard({
  title,
  category,
  summary,
  pages = '4',
  date = '2025',
  delay = 0,
}) {
  return (
    <FadeIn delay={delay} className="h-full">
      <article className="group border border-t-border/10 bg-t-surface hover:border-t-gold/35 transition-all duration-350 h-full flex flex-col rounded-sm" style={{ boxShadow: '0 1px 4px rgba(12,28,53,0.06)', transition: 'all 0.35s ease' }}>
        {/* Document header bar */}
        <div className="bg-t-surface2 border-b border-t-border/10 px-6 py-4 flex items-center justify-between">
          <span className="text-[9.5px] text-t-gold tracking-[0.22em] uppercase font-bold font-sans">
            Policy Brief
          </span>
          <span className="text-[9.5px] text-t-muted tracking-[0.10em] uppercase font-sans">
            {pages} pp · {date}
          </span>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          <span className="category-badge mb-4 self-start">{category}</span>

          <h3 className="font-serif text-t-text text-[1.05rem] font-semibold leading-[1.35] mb-3 group-hover:text-t-gold transition-colors duration-250">
            {title}
          </h3>

          <div className="w-5 h-px bg-t-gold/40 mb-4 group-hover:w-10 group-hover:bg-t-gold transition-all duration-300" />

          {summary && (
            <p className="text-t-muted text-sm leading-[1.8] font-sans flex-1 mb-6">
              {summary}
            </p>
          )}

          {/* Structure labels */}
          <div className="grid grid-cols-2 gap-1.5 text-[9px] text-t-muted/70 tracking-[0.10em] uppercase font-sans mb-5 border-t border-t-border/10 pt-4">
            {['Executive Summary', 'Legal Issue', 'Key Findings', 'Recommendations'].map((item) => (
              <div key={item} className="flex items-center gap-1.5">
                <div className="w-1 h-1 bg-t-gold rounded-full" />
                {item}
              </div>
            ))}
          </div>

          <button className="btn-outline-gold text-[10px] py-2.5 self-start">
            Download Brief
          </button>
        </div>
      </article>
    </FadeIn>
  )
}

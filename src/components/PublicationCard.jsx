import FadeIn from './FadeIn'

export default function PublicationCard({
  title,
  category,
  abstract,
  date = '2025',
  author = 'IILA Legal Research and Studies Committee',
  status = 'Published',
  delay = 0,
  compact = false,
  href,
  fileType = 'PDF',
  language = 'English',
}) {
  const isPersian = language === 'فارسی'
  const statusClass =
    status === 'Published'
      ? 'status-published'
      : status === 'Draft'
      ? 'status-draft'
      : 'status-forthcoming'

  return (
    <FadeIn delay={delay} className="h-full">
      <article className="pub-card group h-full" dir={isPersian ? 'rtl' : 'ltr'}>
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <span className="category-badge">{category}</span>
          <div className="flex items-center gap-2">
            <span className={`text-[9px] tracking-[0.12em] uppercase font-medium px-2 py-0.5 border ${isPersian ? 'border-gold/30 text-gold/70 font-sans' : 'border-t-border/20 text-t-text/40'}`}>
              {language}
            </span>
            <span className={statusClass}>{status}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-serif text-t-text text-xl lg:text-[1.35rem] font-semibold leading-[1.3] mb-4 group-hover:text-t-gold transition-colors duration-250">
          {title}
        </h3>

        {/* Gold rule */}
        <div className="w-8 h-px bg-t-gold/40 mb-4 group-hover:w-14 group-hover:bg-t-gold transition-all duration-300" />

        {/* Abstract */}
        {!compact && (
          <p className="text-t-muted text-sm leading-[1.8] font-sans mb-6 flex-1">
            {abstract}
          </p>
        )}

        {/* Meta */}
        <div className="mt-auto">
          <div className="flex items-center justify-between text-[9.5px] text-t-muted/80 tracking-[0.10em] uppercase font-sans border-t border-t-border/10 pt-4 mb-5">
            <span>{author}</span>
            <span className="font-semibold">{date}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            {href ? (
              <a
                href={href}
                download
                className="btn-solid-burgundy text-[10px] py-2.5 px-5 flex-1 text-center inline-flex items-center justify-center gap-1.5"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download {fileType}
              </a>
            ) : (
              <button className="btn-ghost text-[10px] py-2.5 px-5 flex-1">
                Coming Soon
              </button>
            )}
          </div>
        </div>
      </article>
    </FadeIn>
  )
}

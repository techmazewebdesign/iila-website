const LOGO_DARK  = '/images/iilia_logo_website.JPG'

export default function IILALogo({ size = 44, showText = true, light = false, className = '' }) {
  const logoSrc = LOGO_DARK

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src={logoSrc}
        alt="IILA — Iranian International Lawyers Association"
        className="rounded-full object-cover flex-shrink-0 ring-1 ring-gold/30"
        style={{ width: size, height: size }}
        draggable={false}
      />
      {showText && (
        <div className="flex flex-col leading-tight select-none">
          <span className={`font-serif font-semibold ${light ? 'text-white !important' : 'text-t-text'} tracking-widest text-xs`}>
            IRANIAN INTERNATIONAL LAWYERS ASSOCIATION
          </span>
        </div>
      )}
    </div>
  )
}

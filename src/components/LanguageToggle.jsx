import { useLanguage } from '../context/LanguageContext'

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage()

  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'fa' : 'en')}
      aria-label={lang === 'en' ? 'Switch to Persian' : 'تغییر به انگلیسی'}
      className="inline-flex items-center justify-center w-9 h-9 rounded-sm text-[11px] font-bold font-sans tracking-wider transition-all duration-200 border"
      style={{
        borderColor: 'rgb(var(--t-gold) / 0.30)',
        color: 'rgb(var(--t-text))',
        backgroundColor: 'rgb(var(--t-surface))',
      }}
    >
      <span className={lang === 'fa' ? 'text-gold' : 'opacity-70'}>
        {lang === 'en' ? 'FA' : 'EN'}
      </span>
    </button>
  )
}

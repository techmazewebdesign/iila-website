import { createContext, useContext, useEffect, useState } from 'react'

const LanguageContext = createContext({
  lang: 'en',
  setLang: () => {},
  dir: 'ltr',
})

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      return localStorage.getItem('iila-lang') || 'en'
    } catch {
      return 'en'
    }
  })

  const dir = lang === 'fa' ? 'rtl' : 'ltr'

  const setLang = (next) => {
    setLangState(next)
    try { localStorage.setItem('iila-lang', next) } catch {}
  }

  useEffect(() => {
    const html = document.documentElement
    html.setAttribute('lang', lang)
    html.setAttribute('dir', dir)
    html.classList.toggle('rtl', lang === 'fa')
    html.classList.toggle('ltr', lang === 'en')
  }, [lang, dir])

  return (
    <LanguageContext.Provider value={{ lang, setLang, dir }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)

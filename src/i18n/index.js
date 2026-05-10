import { useLanguage } from '../context/LanguageContext'
import translations from './translations'

export function useTranslation() {
  const { lang } = useLanguage()
  return translations[lang] || translations.en
}

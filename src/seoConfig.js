import translations from './i18n/translations.js'

export const BASE_URL = 'https://iila-swiss.org'
export const SITE_NAME = 'Iranian International Lawyers Association'
export const DEFAULT_IMAGE_PATH = '/og-image.png'
export const DEFAULT_IMAGE_ALT = "Iranian International Lawyers Association — legal infrastructure for Iran's democratic future"

export const PAGE_METADATA = {
  '/': {
    key: 'home',
    title: 'Iranian International Lawyers Association (IILA) | Rule of Law, Human Rights & Legal Research for Iran',
    description: "IILA is an independent, non-profit international lawyers association registered in Switzerland. We advance rule of law, human rights, legal research, and institutional frameworks for Iran's democratic future.",
  },
  '/about': {
    key: 'about',
    title: 'About IILA | Iranian International Lawyers Association',
    description: 'Learn about IILA — the Iranian International Lawyers Association — its founding principles, legal mission, and institutional structure advancing the rule of law for Iran.',
  },
  '/our-people': {
    key: 'ourPeople',
    title: 'Our People | IILA Legal Professionals & Researchers',
    description: "Meet the legal professionals, researchers, and specialists at IILA committed to the rule of law, institutional accountability, and Iran's legal future.",
  },
  '/mission': {
    key: 'mission',
    title: 'Our Mission & Principles | IILA — Iranian International Lawyers Association',
    description: "IILA's mission is to advance rule of law, human rights, and institutional legal preparation for Iran through independent research, international engagement, and legal expertise.",
  },
  '/publications': {
    key: 'publications',
    title: 'Legal Publications | IILA Research & International Law',
    description: "Explore IILA's legal publications and research covering international law, human rights, constitutional frameworks, and institutional development for Iran.",
  },
  '/policy-briefs': {
    key: 'policyBriefs',
    title: 'Policy Briefs | IILA — Legal & Institutional Analysis',
    description: "Read IILA's policy briefs on international law, human rights, governance, and legal reform relevant to Iran and the wider international legal community.",
  },
  '/human-rights': {
    key: 'humanRights',
    title: 'Human Rights | IILA — Documentation & Accountability for Iran',
    description: 'IILA documents systematic human rights violations in Iran through legal research, accountability frameworks, and the humaninchain.org initiative.',
  },
  '/roadmap': {
    key: 'roadmap',
    title: "Legal Roadmap | IILA — Institutional Preparation for Iran's Future",
    description: "IILA's legal roadmap outlines constitutional design, judicial reform, transitional justice, and institutional accountability frameworks for Iran's democratic future.",
  },
  '/committees': {
    key: 'committees',
    title: 'Legal Committees | IILA Specialist Working Groups',
    description: "Discover IILA's specialist legal committees covering international law, human rights, constitutional design, and institutional reform for Iran.",
  },
  '/partners': {
    key: 'partners',
    title: 'Partners & Collaborators | IILA International Network',
    description: "IILA collaborates with international legal institutions, academic bodies, and civil society organisations committed to the rule of law and Iran's legal future.",
  },
  '/expert-network': {
    key: 'expertNetwork',
    title: 'Expert Network | IILA Legal Professionals',
    description: "Join IILA's international network of legal professionals, researchers, and specialists working on institutional preparation and legal reform for Iran.",
  },
  '/media': {
    key: 'media',
    title: 'Media & Press | IILA — Iranian International Lawyers Association',
    description: 'IILA media resources, press releases, and institutional statements on international law, human rights, and legal developments relevant to Iran.',
  },
  '/contact': {
    key: 'contact',
    title: 'Contact IILA | Institutional Inquiries & Correspondence',
    description: 'Contact the Iranian International Lawyers Association for institutional inquiries, legal collaboration, media requests, and general correspondence.',
  },
}

export const ROUTES = Object.keys(PAGE_METADATA)

export function getLocalizedPath(path, lang = 'en') {
  const normalizedPath = path === '' ? '/' : path
  if (lang !== 'fa') return normalizedPath
  return normalizedPath === '/' ? '/fa/' : `/fa${normalizedPath}`
}

export function getPageMetadata({ path = '/', lang = 'en', title, description, canonicalPath, image, imageAlt, type }) {
  const route = PAGE_METADATA[path] || PAGE_METADATA['/']
  const translation = translations[lang]?.[route.key]
  const localizedTitle = lang === 'fa' && translation?.heroTitle
    ? `${translation.heroTitle} | IILA`
    : (title || route.title)
  const localizedDescription = lang === 'fa' && translation?.heroSubtitle
    ? translation.heroSubtitle
    : (description || route.description)
  const canonicalRoutePath = canonicalPath || route.canonicalPath || path
  const localizedPath = getLocalizedPath(canonicalRoutePath, lang)
  const englishPath = getLocalizedPath(canonicalRoutePath, 'en')
  const persianPath = getLocalizedPath(canonicalRoutePath, 'fa')
  const imageUrl = image || route.image || `${BASE_URL}${DEFAULT_IMAGE_PATH}`

  return {
    title: localizedTitle,
    description: localizedDescription,
    type: type || route.type || 'website',
    lang,
    locale: lang === 'fa' ? 'fa_IR' : 'en_US',
    alternateLocale: lang === 'fa' ? 'en_US' : 'fa_IR',
    url: `${BASE_URL}${localizedPath}`,
    image: imageUrl.startsWith('http') ? imageUrl : `${BASE_URL}${imageUrl}`,
    imageAlt: imageAlt || route.imageAlt || DEFAULT_IMAGE_ALT,
    englishUrl: `${BASE_URL}${englishPath}`,
    persianUrl: `${BASE_URL}${persianPath}`,
  }
}

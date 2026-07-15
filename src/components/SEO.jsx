import { useEffect, useRef } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { BASE_URL, SITE_NAME, getPageMetadata } from '../seoConfig'

const ORGANIZATION_LOGO = `${BASE_URL}/images/iilia_logo_website.JPG`

const CRUMB_LABELS = {
  'about':          'About IILA',
  'our-people':     'Our People',
  'mission':        'Mission & Principles',
  'publications':   'Publications',
  'human-rights':   'Human Rights',
  'roadmap':        'Legal Roadmap',
  'committees':     'Legal Committees',
  'partners':       'Partners',
  'expert-network': 'Expert Network',
  'media':          'Media & Press',
  'contact':        'Contact',
}

function setMeta(selector, attr, value) {
  let el = document.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    const m = selector.match(/\[(.+?)="(.+?)"\]/)
    el.setAttribute(m[1], m[2])
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
}

function setLink(rel, href) {
  let el = document.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function setAlternate(hreflang, href) {
  let el = document.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`)
  if (!el) {
    el = document.createElement('link')
    el.rel = 'alternate'
    el.hreflang = hreflang
    document.head.appendChild(el)
  }
  el.href = href
}

function upsertSchema(id, data) {
  let el = document.querySelector(`script[data-schema="${id}"]`)
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.setAttribute('data-schema', id)
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
  return el
}

export default function SEO({
  title,
  description,
  path = '',
  canonicalPath,
  image,
  imageAlt,
  type,
  schema = null,
  keywords = null,
}) {
  const { lang } = useLanguage()
  const metadata = getPageMetadata({ path, lang, title, description, canonicalPath, image, imageAlt, type })
  const { url } = metadata
  const segment = path.replace(/^\//, '')
  const crumb   = CRUMB_LABELS[segment] || metadata.title
  const pageSchemaEl = useRef(null)

  useEffect(() => {
    // ── Title ──────────────────────────────────────────
    document.title = metadata.title

    // ── Standard meta ──────────────────────────────────
    setMeta('meta[name="description"]',           'content', metadata.description)
    setMeta('meta[name="author"]',                'content', SITE_NAME)
    setMeta('meta[name="robots"]',                'content', 'index, follow')
    if (keywords) {
      setMeta('meta[name="keywords"]',            'content', keywords)
    }

    // ── Open Graph ─────────────────────────────────────
    setMeta('meta[property="og:title"]',          'content', metadata.title)
    setMeta('meta[property="og:description"]',    'content', metadata.description)
    setMeta('meta[property="og:type"]',           'content', metadata.type)
    setMeta('meta[property="og:url"]',            'content', metadata.url)
    setMeta('meta[property="og:image"]',          'content', metadata.image)
    setMeta('meta[property="og:image:secure_url"]', 'content', metadata.image)
    setMeta('meta[property="og:image:type"]',     'content', 'image/png')
    setMeta('meta[property="og:image:width"]',    'content', '1200')
    setMeta('meta[property="og:image:height"]',   'content', '630')
    setMeta('meta[property="og:image:alt"]',      'content', metadata.imageAlt)
    setMeta('meta[property="og:locale"]',         'content', metadata.locale)
    setMeta('meta[property="og:locale:alternate"]', 'content', metadata.alternateLocale)
    setMeta('meta[property="og:site_name"]',      'content', SITE_NAME)

    // ── Twitter Card ───────────────────────────────────
    setMeta('meta[name="twitter:card"]',          'content', 'summary_large_image')
    setMeta('meta[name="twitter:title"]',         'content', metadata.title)
    setMeta('meta[name="twitter:description"]',   'content', metadata.description)
    setMeta('meta[name="twitter:image"]',         'content', metadata.image)
    setMeta('meta[name="twitter:image:alt"]',     'content', metadata.imageAlt)

    // ── Canonical ──────────────────────────────────────
    setLink('canonical', metadata.url)
    setAlternate('en', metadata.englishUrl)
    setAlternate('fa', metadata.persianUrl)
    setAlternate('x-default', metadata.englishUrl)

    // ── WebPage + BreadcrumbList schema (every page) ───
    upsertSchema('webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      name: metadata.title,
      description: metadata.description,
      url,
      inLanguage: lang === 'fa' ? 'fa-IR' : 'en-US',
      isPartOf: { '@id': `${BASE_URL}/#website` },
      about: { '@id': `${BASE_URL}/#organization` },
      ...(segment && {
        breadcrumb: {
          '@type': 'BreadcrumbList',
          '@id': `${url}#breadcrumb`,
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home',  item: `${BASE_URL}/` },
            { '@type': 'ListItem', position: 2, name: crumb,   item: url },
          ],
        },
      }),
    })

    // ── Organization schema (every page) ─────────────────
    upsertSchema('organization', {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${BASE_URL}/#organization`,
      name: SITE_NAME,
      url: BASE_URL,
      logo: ORGANIZATION_LOGO,
      description: 'An independent, non-profit legal association registered in Switzerland, dedicated to rule of law, human rights, and institutional preparation for Iran\'s democratic future.',
      sameAs: [
        'https://www.linkedin.com/company/iila-swiss',
        'https://twitter.com/iila_swiss',
      ],
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'CH',
        addressLocality: 'Zurich',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+41-44-XXX-XXXX',
        contactType: 'customer service',
        email: 'info@iila-swiss.org',
        availableLanguage: ['English', 'Persian'],
      },
    })

    // ── Page-specific schema ───────────────────────────
    if (schema) {
      pageSchemaEl.current = upsertSchema('page-schema', schema)
    }

    return () => {
      if (pageSchemaEl.current) {
        pageSchemaEl.current.remove()
        pageSchemaEl.current = null
      }
    }
  }, [metadata.title, metadata.description, metadata.type, metadata.url, metadata.image, metadata.imageAlt, metadata.locale, metadata.alternateLocale, metadata.englishUrl, metadata.persianUrl, url, lang, schema, segment, crumb, keywords])

  return null
}

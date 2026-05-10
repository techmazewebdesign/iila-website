import { useEffect, useRef } from 'react'

const BASE_URL  = 'https://iila-swiss.org'
const SITE_NAME = 'Iranian International Lawyers Association'
const DEFAULT_IMAGE = `${BASE_URL}/images/iilia_logo_website.JPG`

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
  image = DEFAULT_IMAGE,
  type = 'website',
  schema = null,
}) {
  const url     = `${BASE_URL}${path}`
  const segment = path.replace(/^\//, '')
  const crumb   = CRUMB_LABELS[segment] || title
  const pageSchemaEl = useRef(null)

  useEffect(() => {
    // ── Title ──────────────────────────────────────────
    document.title = title

    // ── Standard meta ──────────────────────────────────
    setMeta('meta[name="description"]',           'content', description)
    setMeta('meta[name="author"]',                'content', SITE_NAME)
    setMeta('meta[name="robots"]',                'content', 'index, follow')

    // ── Open Graph ─────────────────────────────────────
    setMeta('meta[property="og:title"]',          'content', title)
    setMeta('meta[property="og:description"]',    'content', description)
    setMeta('meta[property="og:type"]',           'content', type)
    setMeta('meta[property="og:url"]',            'content', url)
    setMeta('meta[property="og:image"]',          'content', image)
    setMeta('meta[property="og:locale"]',         'content', 'en_US')
    setMeta('meta[property="og:site_name"]',      'content', SITE_NAME)

    // ── Twitter Card ───────────────────────────────────
    setMeta('meta[name="twitter:card"]',          'content', 'summary_large_image')
    setMeta('meta[name="twitter:title"]',         'content', title)
    setMeta('meta[name="twitter:description"]',   'content', description)
    setMeta('meta[name="twitter:image"]',         'content', image)

    // ── Canonical ──────────────────────────────────────
    setLink('canonical', url)

    // ── WebPage + BreadcrumbList schema (every page) ───
    upsertSchema('webpage', {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
      name: title,
      description,
      url,
      inLanguage: 'en-US',
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
  }, [title, description, url, image, type, schema, segment, crumb])

  return null
}

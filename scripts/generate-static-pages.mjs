import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { BASE_URL, ROUTES, SITE_NAME, getLocalizedPath, getPageMetadata } from '../src/seoConfig.js'

const distDir = new URL('../dist/', import.meta.url)
const template = await readFile(new URL('index.html', distDir), 'utf8')

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')

function metadataHtml(metadata) {
  const title = escapeHtml(metadata.title)
  const description = escapeHtml(metadata.description)
  const imageAlt = escapeHtml(metadata.imageAlt)

  return `<!-- seo:start -->
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${metadata.url}" />
    <link rel="alternate" hreflang="en" href="${metadata.englishUrl}" />
    <link rel="alternate" hreflang="fa" href="${metadata.persianUrl}" />
    <link rel="alternate" hreflang="x-default" href="${metadata.englishUrl}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:type" content="${metadata.type}" />
    <meta property="og:url" content="${metadata.url}" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:locale" content="${metadata.locale}" />
    <meta property="og:locale:alternate" content="${metadata.alternateLocale}" />
    <meta property="og:image" content="${metadata.image}" />
    <meta property="og:image:secure_url" content="${metadata.image}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${imageAlt}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${metadata.image}" />
    <meta name="twitter:image:alt" content="${imageAlt}" />
    <link rel="preload" as="image" href="/og-image.png" />
    <!-- seo:end -->`
}

function renderPage(path, lang) {
  const metadata = getPageMetadata({ path, lang })
  return template
    .replace(/<html lang="[^"]+"(?: dir="[^"]+")?>/, `<html lang="${lang === 'fa' ? 'fa' : 'en'}" dir="${lang === 'fa' ? 'rtl' : 'ltr'}">`)
    .replace(/<!-- seo:start -->[\s\S]*?<!-- seo:end -->/, metadataHtml(metadata))
}

for (const path of ROUTES) {
  for (const lang of ['en', 'fa']) {
    const localizedPath = getLocalizedPath(path, lang)
    const relativeDir = localizedPath === '/' ? '' : localizedPath.replace(/^\//, '').replace(/\/$/, '')
    const outputDir = new URL(`${relativeDir}${relativeDir ? '/' : ''}`, distDir)
    await mkdir(outputDir, { recursive: true })
    await writeFile(new URL('index.html', outputDir), renderPage(path, lang))
  }
}

const sitemapUrls = ROUTES.flatMap((path) => ['en', 'fa'].map((lang) => {
  const localizedPath = getLocalizedPath(path, lang)
  const alternateLang = lang === 'en' ? 'fa' : 'en'
  const alternatePath = getLocalizedPath(path, alternateLang)
  return `  <url>
    <loc>${BASE_URL}${localizedPath}</loc>
    <xhtml:link rel="alternate" hreflang="${lang}" href="${BASE_URL}${localizedPath}" />
    <xhtml:link rel="alternate" hreflang="${alternateLang}" href="${BASE_URL}${alternatePath}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE_URL}${getLocalizedPath(path, 'en')}" />
  </url>`
})).join('\n')

await writeFile(new URL('sitemap.xml', distDir), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapUrls}
</urlset>
`)

console.log(`Generated ${ROUTES.length * 2} static metadata pages and a localized sitemap.`)

import { useState } from 'react'
import FadeIn from '../components/FadeIn'
import SectionTitle from '../components/SectionTitle'
import PublicationCard from '../components/PublicationCard'
import CTASection from '../components/CTASection'
import SEO from '../components/SEO'
import { useTranslation } from '../i18n'
import { useLanguage } from '../context/LanguageContext'

const CATEGORIES = [
  { key: 'all', en: 'All', fa: 'همه' },
  { key: 'international-policy', en: 'International Policy / EU Policy', fa: 'سیاست بین‌الملل / سیاست اتحادیه اروپا' },
  { key: 'human-rights', en: 'Human Rights / Legal Analysis', fa: 'حقوق بشر / تحلیل حقوقی' },
  { key: 'institutional-reform', en: 'Institutional Reform / Economic Governance', fa: 'اصلاحات نهادی / حکمرانی اقتصادی' },
  { key: 'document-design', en: 'Publication Cover / Document Design', fa: 'طراحی جلد / اسناد' },
  { key: 'banking-reform', en: 'Banking Reform', fa: 'اصلاحات نهادی / نظام بانکی' },
]

const PUBLICATIONS = [
  {
    title: 'IRAN 2026 — Human Rights Report',
    subtitle: 'Lives, evidence and the pursuit of accountability',
    edition: 'Research Edition',
    categoryKey: 'human-rights',
    category: 'Human Rights / Legal Analysis',
    abstract:
      'A research-based human rights report examining developments affecting people in Iran, including state repression, executions, women’s rights, detention, exile and return, political prisoners, and pathways toward legal accountability.',
    date: '23 September 2026',
    author: 'Iranian International Lawyers Association (IILA)',
    status: 'Published',
    href: '/Publications/Iran%20Human%20Rights%20Report%202026%20IILA.pdf',
    cover: '/Publications/iran-human-rights-report-2026-cover.png',
    fileType: 'PDF',
    language: 'English',
    fa: {
      title: 'گزارش حقوق بشر ایران ۲۰۲۶',
      subtitle: 'زندگی‌ها، شواهد و پیگیری پاسخگویی',
      edition: 'نسخه پژوهشی',
      category: 'حقوق بشر / تحلیل حقوقی',
      abstract: 'گزارشی پژوهش‌محور درباره تحولات مؤثر بر مردم ایران، از جمله سرکوب دولتی، اعدام‌ها، حقوق زنان، بازداشت، تبعید و بازگشت، زندانیان سیاسی و مسیرهای پاسخگویی حقوقی.',
      date: '۲۳ سپتامبر ۲۰۲۶',
      author: 'انجمن وکلای بین‌المللی ایرانی (IILA)',
      statusLabel: 'منتشرشده',
      language: 'فارسی',
      readLabel: 'مشاهده گزارش',
      downloadLabel: 'دانلود PDF',
    },
  },
  {
    title: 'EU Policy Dossier on Iran',
    categoryKey: 'international-policy',
    category: 'International Policy / EU Policy',
    abstract:
      'A policy-focused dossier addressing European Union approaches toward Iran, with emphasis on accountability, democratic transition, human rights, and institutional engagement.',
    date: '2025',
    author: 'IILA International Law and Human Rights Committee',
    status: 'Published',
    href: '/Publications/EU POLICY DOSSIER.docx',
    fileType: 'DOCX',
    language: 'English',
    cover: '/Publications/eu-policy-dossier-cover.jpg',
    fa: {
      title: 'پرونده سیاستی اتحادیه اروپا درباره ایران',
      category: 'سیاست بین‌الملل / سیاست اتحادیه اروپا',
      abstract: 'پرونده‌ای سیاست‌محور درباره رویکردهای اتحادیه اروپا نسبت به ایران، با تمرکز بر پاسخگویی، گذار دموکراتیک، حقوق بشر و تعامل نهادی.',
      date: '۲۰۲۵',
      author: 'کمیته حقوق بین‌الملل و حقوق بشر IILA',
      statusLabel: 'منتشرشده',
      language: 'فارسی',
      readLabel: 'مشاهده سند',
      downloadLabel: 'دانلود DOCX',
    },
  },
  {
    title: 'Transitional Banking Reform Framework for Iran',
    categoryKey: 'institutional-reform',
    category: 'Institutional Reform / Economic Governance',
    abstract:
      'A proposed framework for reforming Iran\'s banking and financial governance during a democratic transition, focusing on institutional stability, transparency, accountability, and economic recovery.',
    date: '2025',
    author: 'IILA Comparative Law and International Banking Law Committee',
    status: 'Published',
    href: '/Publications/Transitional Banking Reform Framework for Iran.pdf',
    fileType: 'PDF',
    language: 'English',
    cover: '/Publications/transitional-banking-reform-framework-cover.jpg',
    fa: {
      title: 'چارچوب اصلاحات انتقالی بانکداری برای ایران',
      category: 'اصلاحات نهادی / حکمرانی اقتصادی',
      abstract: 'چارچوبی پیشنهادی برای اصلاح حکمرانی بانکی و مالی ایران در دوران گذار دموکراتیک، با تمرکز بر ثبات نهادی، شفافیت، پاسخگویی و بازیابی اقتصادی.',
      date: '۲۰۲۵',
      author: 'کمیته حقوق تطبیقی و حقوق بانکداری بین‌الملل IILA',
      statusLabel: 'منتشرشده',
      language: 'فارسی',
      readLabel: 'مشاهده سند',
      downloadLabel: 'دانلود PDF',
    },
  },
  {
    title: 'بازنگری و بازنویسی قانون بانک مرکزی ایران نوین',
    categoryKey: 'banking-reform',
    category: 'اصلاحات نهادی / نظام بانکی',
    abstract:
      'این سند به بررسی و بازنویسی چارچوب قانونی بانک مرکزی ایران در مسیر گذار به حکمرانی نوین، شفافیت مالی، استقلال نهادی و پاسخگویی اقتصادی می‌پردازد.',
    date: '2025',
    author: 'کمیته حقوق تطبیقی و حقوق بانکداری بین‌الملل IILA',
    status: 'Published',
    href: '/Publications/\u200e\u2068بازنگری_و_بازنویسی_قانون_بانک_مرکزی_ایران_نوین\u2069.pdf',
    fileType: 'PDF',
    language: 'فارسی',
    cover: '/Publications/modern-central-bank-law-cover.jpg',
    fa: {
      title: 'بازنگری و بازنویسی قانون بانک مرکزی نوین ایران',
      category: 'اصلاحات نهادی / نظام بانکی',
      abstract: 'این سند چارچوب قانونی بانک مرکزی ایران را برای گذار به حکمرانی نوین، شفافیت مالی، استقلال نهادی و پاسخگویی اقتصادی بررسی و بازنویسی می‌کند.',
      date: '۲۰۲۵',
      author: 'کمیته حقوق تطبیقی و حقوق بانکداری بین‌الملل IILA',
      statusLabel: 'منتشرشده',
      language: 'فارسی',
      readLabel: 'مشاهده سند',
      downloadLabel: 'دانلود PDF',
    },
  },
  {
    title: 'Second-Class Citizen',
    categoryKey: 'human-rights',
    category: 'Human Rights / Legal Analysis',
    abstract:
      'A legal and human rights analysis examining the structural conditions that reduce citizens to second-class status, with focus on discrimination, exclusion, and the need for legal restoration.',
    date: '2025',
    author: 'IILA International Law and Human Rights Committee',
    status: 'Published',
    href: '/Publications/Second Class Citizen 2026-05-01.pdf',
    fileType: 'PDF',
    language: 'English',
    cover: '/Publications/second-class-citizen-cover.jpg',
    fa: {
      title: 'شهروند درجه‌دوم',
      category: 'حقوق بشر / تحلیل حقوقی',
      abstract: 'تحلیلی حقوقی و حقوق‌بشری درباره شرایط ساختاری‌ای که شهروندان را به جایگاهی فرودست می‌کاهد، با تمرکز بر تبعیض، حذف و ضرورت احیای حقوق برابر.',
      date: '۲۰۲۵',
      author: 'کمیته حقوق بین‌الملل و حقوق بشر IILA',
      statusLabel: 'منتشرشده',
      language: 'فارسی',
      readLabel: 'مشاهده سند',
      downloadLabel: 'دانلود PDF',
    },
  },
]

export default function Publications() {
  const t = useTranslation()
  const { lang } = useLanguage()
  const isPersian = lang === 'fa'
  const [activeCategory, setActiveCategory] = useState('all')
  const publications = PUBLICATIONS.map((publication) => ({
    ...publication,
    ...(isPersian ? publication.fa : {}),
  }))

  const filtered =
    activeCategory === 'all'
      ? publications
      : publications.filter((p) => p.categoryKey === activeCategory)

  return (
    <div>
      <SEO
        title={isPersian ? 'انتشارات حقوقی | پژوهش و حقوق بین‌الملل IILA' : 'Legal Publications | IILA Research & International Law'}
        description={isPersian ? 'پژوهش‌ها و انتشارات حقوقی IILA درباره حقوق بین‌الملل، حقوق بشر، چارچوب‌های قانون اساسی و توسعه نهادی ایران.' : "Explore IILA's legal publications and research covering international law, human rights, constitutional frameworks, and institutional development for Iran."}
        path="/publications"
      />
      {/* Page Hero */}
      <section className="page-hero">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950 to-navy-900 hidden dark:block" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gold/15" />
        <div className="relative container-site">
          <FadeIn>
            <span className="text-[10px] text-gold tracking-[0.3em] uppercase font-medium font-sans">
              {t.publications.heroTag}
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-ivory mt-4 leading-tight max-w-3xl">
              {t.publications.heroTitle}
            </h1>
            <div className="gold-line mt-6" />
            <p className="text-ivory/85 text-lg font-sans max-w-2xl leading-relaxed">
              {t.publications.heroSubtitle}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="section-alt border-b border-gold/10 py-6 sticky top-16 lg:top-[68px] z-30">
        <div className="container-site">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex-shrink-0 text-[10px] tracking-[0.18em] uppercase font-medium px-4 py-2 border transition-all duration-200 font-sans ${
                  activeCategory === cat.key
                    ? 'border-gold bg-gold/10 text-gold'
                    : 'border-gold/20 text-t-text hover:border-gold/40 hover:text-t-text'
                }`}
              >
                {isPersian ? cat.fa : cat.en}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Publications Grid */}
      <section className="section-py section-mid border-t border-gold/10">
        <div className="container-site">
          <FadeIn className="flex items-center justify-between mb-10">
            <p className="text-ivory/70 text-xs tracking-[0.15em] uppercase font-sans">
              {filtered.length} {isPersian ? 'انتشار' : `Publication${filtered.length !== 1 ? 's' : ''}`}
              {activeCategory !== 'all' && ` · ${isPersian ? CATEGORIES.find((cat) => cat.key === activeCategory)?.fa : CATEGORIES.find((cat) => cat.key === activeCategory)?.en}`}
            </p>
            <span className="text-[10px] text-gold tracking-[0.15em] uppercase font-semibold font-sans">
              {isPersian ? 'آرشیو انتشارات IILA' : 'IILA Publication Archive'}
            </span>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((pub, i) => (
              <PublicationCard key={pub.title} {...pub} delay={i * 80} />
            ))}
          </div>

          {filtered.length === 0 && (
            <FadeIn className="text-center py-20">
              <p className="text-ivory/70 font-sans text-base">
                {isPersian ? 'هنوز انتشاری در این دسته وجود ندارد.' : 'No publications in this category yet.'}
              </p>
            </FadeIn>
          )}
        </div>
      </section>

      {/* Publication Categories Overview */}
      <section className="section-py section-dark border-t border-gold/10">
        <div className="container-site">
          <SectionTitle
            label={t.publications.categoriesLabel}
            title={t.publications.categoriesTitle}
            subtitle={t.publications.categoriesSubtitle}
            className="mb-14"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {CATEGORIES.filter((cat) => cat.key !== 'all').map((cat, i) => (
              <FadeIn key={cat.key} delay={i * 40}>
                <button
                  onClick={() => {
                    setActiveCategory(cat.key)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="w-full border border-t-border/15 bg-t-surface/30 p-5 text-left hover:border-gold/40 hover:bg-t-surface transition-all duration-300 group"
                >
                  <div className="w-5 h-px bg-gold/30 mb-3 group-hover:w-8 group-hover:bg-gold transition-all duration-300" />
                  <p className="text-t-text text-xs tracking-[0.08em] uppercase font-sans leading-relaxed group-hover:text-t-text transition-colors duration-200">
                    {isPersian ? cat.fa : cat.en}
                  </p>
                </button>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Disclaimer ── */}
      <section className="section-alt section-py border-t border-t-border/10">
        <div className="container-site max-w-3xl mx-auto">
          <div className="border border-t-border/15 rounded-sm p-8 lg:p-10" style={{ background: 'rgb(var(--t-surface-2))' }}>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-4 h-px bg-t-gold" />
              <span className="text-[9.5px] text-t-gold font-bold tracking-[0.26em] uppercase font-sans">
                {isPersian ? 'سلب مسئولیت' : 'Disclaimer'}
              </span>
            </div>
            <p className="text-t-muted text-sm leading-[1.9] font-sans">
              {isPersian
                ? 'دیدگاه‌ها، نظرات و محتوای تمامی انتشارات این وب‌سایت صرفاً بر عهده نویسندگان آن‌هاست. IILA هیچ مسئولیتی در قبال صحت، قانونی بودن یا پیامدهای این مطالب نمی‌پذیرد. مگر آن‌که صراحتاً به‌عنوان اثری مشترک اعلام شده باشد، تمامی انتشارات مشارکت‌های فردی محسوب می‌شوند و انجمن مسئولیتی در قبال محتوا یا پیامدهای آن‌ها ندارد.'
                : 'The views, opinions, and content of all publications on this website are solely the responsibility of the individual authors. IILA does not assume any liability for the accuracy, legality, or consequences of these materials. Unless explicitly stated as a collaborative work, all publications are deemed individual contributions, and the association does not bear responsibility for their content or implications.'}
            </p>
          </div>
        </div>
      </section>

      <CTASection
        label={t.publications.ctaTitle}
        title={t.publications.ctaTitle}
        subtitle={t.publications.ctaSubtitle}
        buttons={[
          { label: t.publications.ctaBtn, to: '/contact' },
          { label: t.ctaShort, to: '/expert-network' },
        ]}
      />
    </div>
  )
}

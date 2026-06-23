import { useState } from 'react'
import FadeIn from '../components/FadeIn'
import SEO from '../components/SEO'
import { useTranslation } from '../i18n'

export default function Contact() {
  const t = useTranslation()
  const [form, setForm] = useState({
    name: '', organisation: '', email: '',
    country: '', type: '', message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const submit = (e) => { e.preventDefault(); setSubmitted(true) }

  return (
    <div>
      <SEO
        title="Contact IILA | Institutional Inquiries & Correspondence"
        description="Contact the Iranian International Lawyers Association for institutional inquiries, legal collaboration, media requests, and general correspondence."
        path="/contact"
      />
      {/* ── Page Hero ── */}
      <section className="page-hero">
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
        <div className="relative container-site">
          <FadeIn>
            <span className="text-[10px] text-gold tracking-[0.3em] uppercase font-medium font-sans">
              {t.contact.heroTag}
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-ivory mt-4 leading-tight max-w-3xl">
              {t.contact.heroTitle}
            </h1>
            <div className="w-12 h-px bg-gold mt-6 mb-5" />
            <p className="text-muted/80 text-lg font-sans max-w-2xl leading-relaxed">
              {t.contact.heroSubtitle}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── Main two-column layout ── */}
      <section className="section-py section-dark border-t border-white/5">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">

            {/* ── Left info panel ── */}
            <div className="lg:col-span-2 space-y-8">
              <FadeIn>
                <div>
                  <span className="text-[10px] text-gold tracking-[0.25em] uppercase font-semibold font-sans">
                    {t.contact.infoLabel}
                  </span>
                  <div className="w-10 h-px bg-gold/50 mt-4 mb-6" />
                </div>

                {/* Info cards */}
                <div className="space-y-3">
                  {[
                    { label: t.contact.email, value: 'info@iila-swiss.org', href: 'mailto:info@iila-swiss.org' },
                    { label: t.contact.website, value: 'iila-swiss.org' },
                    { label: t.contact.registered, value: t.contact.swissValue },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-start gap-4 bg-t-surface border border-t-border/5 rounded-sm px-5 py-4 group hover:border-gold/25 transition-all duration-200"
                    >
                      <span className="text-[9px] text-gold tracking-[0.18em] uppercase font-semibold font-sans pt-0.5 w-20 flex-shrink-0">
                        {item.label}
                      </span>
                      {item.href ? (
                        <a href={item.href} className="text-muted text-sm font-sans hover:text-gold transition-colors duration-200">
                          {item.value}
                        </a>
                      ) : (
                        <span className="text-muted text-sm font-sans">{item.value}</span>
                      )}
                    </div>
                  ))}
                </div>
              </FadeIn>

              {/* Response time */}
              <FadeIn delay={80}>
                <div className="bg-t-surface border border-t-border/5 rounded-sm p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-0.5 h-full bg-gold/40 rounded-full" />
                  <p className="text-[9px] text-gold tracking-[0.18em] uppercase font-semibold font-sans mb-3 pl-3">
                    {t.contact.responseLabel}
                  </p>
                  <p className="text-muted text-sm leading-relaxed font-sans pl-3">
                    {t.contact.responseText}
                  </p>
                </div>
              </FadeIn>

              {/* Inquiry types */}
              <FadeIn delay={130}>
                <div className="bg-t-surface border border-t-border/5 rounded-sm p-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-0.5 h-full bg-gold/40 rounded-full" />
                  <p className="text-[9px] text-gold tracking-[0.18em] uppercase font-semibold font-sans mb-4 pl-3">
                    {t.contact.inquiryLabel}
                  </p>
                  <ul className="space-y-2 pl-3">
                    {(t.contact.inquiryTypes || []).map((type) => (
                      <li key={type} className="flex items-center gap-2 text-muted text-xs font-sans">
                        <span className="w-1 h-1 rounded-full bg-gold/40 flex-shrink-0" />
                        {type}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>

              {/* Confidentiality note */}
              <FadeIn delay={160}>
                <p className="text-muted text-xs font-sans leading-relaxed">
                  {t.contact.confidentiality}
                </p>
              </FadeIn>
            </div>

            {/* ── Right form ── */}
            <div className="lg:col-span-3">
              {submitted ? (
                <FadeIn>
                  <div
                    className="bg-t-surface rounded-sm border border-gold/20 p-12 lg:p-16 text-center flex flex-col items-center justify-center min-h-[480px] relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
                    <div className="w-10 h-px bg-gold/50 mb-8" />
                    <p className="font-serif text-ivory text-2xl font-semibold mb-4">
                      {t.contact.formSubmittedTitle}
                    </p>
                    <p className="text-muted/65 text-sm font-sans max-w-sm leading-relaxed mb-8">
                      {t.contact.formSubmittedText}
                    </p>
                    <button onClick={() => setSubmitted(false)} className="btn-outline-gold">
                      {t.contact.formSubmittedBtn}
                    </button>
                  </div>
                </FadeIn>
              ) : (
                <FadeIn delay={60}>
                  <div
                    className="bg-t-surface rounded-sm border border-t-border/5 p-8 lg:p-10 relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                    <p className="font-serif text-ivory text-xl font-semibold mb-1">
                      {t.contact.formTitle}
                    </p>
                    <p className="text-muted/50 text-xs font-sans mb-8 tracking-wide">
                      {t.contact.formRequired}
                    </p>

                    <form onSubmit={submit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="form-label">{t.contact.name}</label>
                          <input name="name" required value={form.name} onChange={handle}
                            className="form-input" placeholder={t.contact.namePlaceholder} />
                        </div>
                        <div>
                          <label className="form-label">{t.contact.organisation}</label>
                          <input name="organisation" value={form.organisation} onChange={handle}
                            className="form-input" placeholder={t.contact.orgPlaceholder} />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="form-label">{t.contact.emailField}</label>
                          <input name="email" type="email" required value={form.email} onChange={handle}
                            className="form-input" placeholder={t.contact.emailPlaceholder} />
                        </div>
                        <div>
                          <label className="form-label">{t.contact.country}</label>
                          <input name="country" value={form.country} onChange={handle}
                            className="form-input" placeholder={t.contact.countryPlaceholder} />
                        </div>
                      </div>
                      <div>
                        <label className="form-label">{t.contact.type}</label>
                        <select name="type" required value={form.type} onChange={handle}
                          className="form-input appearance-none cursor-pointer">
                          <option value="" disabled>
                            {t.contact.typePlaceholder}
                          </option>
                          {(t.contact.inquiryTypes || []).map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="form-label">{t.contact.message}</label>
                        <textarea name="message" rows={6} required value={form.message} onChange={handle}
                          className="form-input"
                          placeholder={t.contact.messagePlaceholder} />
                      </div>
                      <div className="pt-1">
                        <button type="submit" className="btn-solid-gold">
                          {t.contact.submitBtn}
                        </button>
                      </div>
                    </form>
                  </div>
                </FadeIn>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

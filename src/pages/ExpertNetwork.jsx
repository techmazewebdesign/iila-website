import { useState } from 'react'
import FadeIn from '../components/FadeIn'
import SectionTitle from '../components/SectionTitle'
import SEO from '../components/SEO'
import { useTranslation } from '../i18n'

const WHO_CAN_JOIN = [
  { title: 'Practising Lawyers', text: 'Lawyers with experience in international law, human rights, constitutional law, or related practice areas.' },
  { title: 'Legal Scholars & Academics', text: 'University-based researchers, professors, and doctoral candidates in relevant legal fields.' },
  { title: 'Policy Analysts', text: 'Professionals with legal training engaged in policy research, governance, or institutional reform.' },
  { title: 'Human Rights Experts', text: 'Professionals with documented expertise in international human rights law and mechanisms.' },
  { title: 'Judges & Former Jurists', text: 'Current and former members of the judiciary with relevant legal experience.' },
  { title: 'Legal Students', text: 'Advanced law students at recognised institutions with a serious commitment to IILA\'s mandate.' },
]

const AREAS = [
  'Public Law and Constitutional Law',
  'International Law and Human Rights',
  'Commercial Law and Arbitration',
  'Legal Research and Studies',
  'Criminal Law and Criminology',
  'Comparative Law and International Banking Law',
]

export default function ExpertNetwork() {
  const { t } = useTranslation()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    name: '', email: '', country: '', profession: '',
    expertise: '', organisation: '', linkedin: '', message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div>
      {/* Page Hero */}
      <section className="page-hero">
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950 to-navy-900 hidden dark:block" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gold/15" />
        <div className="relative container-site">
          <FadeIn>
            <span className="text-[10px] text-gold tracking-[0.3em] uppercase font-medium font-sans">
              {t.expertNetwork.heroTag}
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold text-ivory mt-4 leading-tight max-w-3xl">
              {t.expertNetwork.heroTitle}
            </h1>
            <div className="gold-line mt-6" />
            <p className="text-ivory/85 text-lg font-sans max-w-2xl leading-relaxed">
              {t.expertNetwork.heroSubtitle}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Who can join */}
      <section className="section-py section-mid border-t border-gold/10">
        <div className="container-site">
          <SectionTitle
            label={t.expertNetwork.eligibilityLabel}
            title={t.expertNetwork.eligibilityTitle}
            subtitle={t.expertNetwork.eligibilitySubtitle}
            className="mb-14"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHO_CAN_JOIN.map((item, i) => (
              <FadeIn key={item.title} delay={i * 70}>
                <div className="bg-t-surface border border-gold/20 p-7 hover:border-gold/45 transition-all duration-300 group h-full">
                  <div className="w-6 h-px bg-gold/40 mb-4 group-hover:w-10 group-hover:bg-gold transition-all duration-300" />
                  <h3 className="font-serif text-ivory text-base font-semibold mb-3 group-hover:text-gold transition-colors duration-200">
                    {item.title}
                  </h3>
                  <p className="text-ivory/80 text-sm leading-relaxed font-sans">
                    {item.text}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Areas + Standards */}
      <section className="section-py section-dark border-t border-gold/10">
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Areas */}
            <div>
              <FadeIn>
                <span className="text-[10px] text-gold tracking-[0.25em] uppercase font-semibold font-sans">
                  {t.expertNetwork.areasLabel}
                </span>
                <h2 className="font-serif text-2xl lg:text-3xl font-semibold text-ivory mt-4 leading-tight">
                  {t.expertNetwork.areasTitle}
                </h2>
                <div className="gold-line mt-5" />
              </FadeIn>
              <div className="space-y-2 mt-2">
                {AREAS.map((area, i) => (
                  <FadeIn key={area} delay={i * 40}>
                    <div className="flex items-center gap-3 border-b border-gold/08 py-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold/40 flex-shrink-0" />
                      <span className="text-ivory/85 text-sm font-sans">{area}</span>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>

            {/* Standards + Confidentiality */}
            <div className="space-y-8">
              <FadeIn delay={80}>
                <div className="bg-t-surface border border-gold/20 p-8">
                  <span className="text-[10px] text-gold tracking-[0.18em] uppercase font-semibold font-sans">
                    {t.expertNetwork.standardsLabel}
                  </span>
                  <div className="w-6 h-px bg-gold/40 my-3" />
                  <p className="text-ivory/80 text-sm leading-relaxed font-sans">
                    All network members are expected to maintain the professional legal standards
                    consistent with their qualifications and the institutional standards of IILA.
                    Contributions must be legally rigorous, factually accurate, and consistent with
                    IILA's principles of independence and non-partisanship.
                  </p>
                </div>
              </FadeIn>
              <FadeIn delay={140}>
                <div className="bg-t-surface border border-gold/20 p-8">
                  <span className="text-[10px] text-gold tracking-[0.18em] uppercase font-semibold font-sans">
                    {t.expertNetwork.confidentialityLabel}
                  </span>
                  <div className="w-6 h-px bg-gold/40 my-3" />
                  <p className="text-ivory/80 text-sm leading-relaxed font-sans">
                    IILA respects the professional confidentiality and independence of all network
                    members. Membership does not require public disclosure unless expressly agreed.
                    Network members retain their professional independence and are not required to
                    endorse any position they do not personally hold.
                  </p>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="section-py section-mid border-t border-gold/10">
        <div className="container-site max-w-3xl mx-auto">
          <SectionTitle
            label={t.expertNetwork.applicationLabel}
            title={t.expertNetwork.applicationTitle}
            subtitle={t.expertNetwork.applicationSubtitle}
            className="mb-12"
          />

          {submitted ? (
            <FadeIn>
              <div className="bg-t-surface border border-gold/30 p-12 text-center">
                <div className="gold-line-center" />
                <p className="font-serif text-ivory text-2xl font-semibold mb-4">
                  {t.expertNetwork.formSubmittedTitle}
                </p>
                <p className="text-ivory/80 text-base font-sans">
                  {t.expertNetwork.formSubmittedText}
                </p>
              </div>
            </FadeIn>
          ) : (
            <FadeIn>
              <form onSubmit={submit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">{t.expertNetwork.formName}</label>
                    <input name="name" required value={form.name} onChange={handle}
                      className="form-input" placeholder={t.expertNetwork.formNamePlaceholder} />
                  </div>
                  <div>
                    <label className="form-label">{t.expertNetwork.formEmail}</label>
                    <input name="email" type="email" required value={form.email} onChange={handle}
                      className="form-input" placeholder="your@email.com" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">{t.expertNetwork.formCountry}</label>
                    <input name="country" required value={form.country} onChange={handle}
                      className="form-input" placeholder={t.expertNetwork.formCountryPlaceholder} />
                  </div>
                  <div>
                    <label className="form-label">{t.expertNetwork.formProfession}</label>
                    <input name="profession" required value={form.profession} onChange={handle}
                      className="form-input" placeholder={t.expertNetwork.formProfessionPlaceholder} />
                  </div>
                </div>
                <div>
                  <label className="form-label">{t.expertNetwork.formExpertise}</label>
                  <input name="expertise" required value={form.expertise} onChange={handle}
                    className="form-input" placeholder={t.expertNetwork.formExpertisePlaceholder} />
                </div>
                <div>
                  <label className="form-label">{t.expertNetwork.formOrg}</label>
                  <input name="organisation" value={form.organisation} onChange={handle}
                    className="form-input" placeholder={t.expertNetwork.formOrgPlaceholder} />
                </div>
                <div>
                  <label className="form-label">{t.expertNetwork.formLinkedIn}</label>
                  <input name="linkedin" value={form.linkedin} onChange={handle}
                    className="form-input" placeholder={t.expertNetwork.formLinkedInPlaceholder} />
                </div>
                <div>
                  <label className="form-label">{t.expertNetwork.formStatement}</label>
                  <textarea name="message" rows={5} value={form.message} onChange={handle}
                    className="form-input"
                    placeholder={t.expertNetwork.formStatementPlaceholder} />
                </div>
                <div className="pt-2">
                  <button type="submit" className="btn-solid-gold">
                    {t.expertNetwork.formSubmit}
                  </button>
                </div>
              </form>
            </FadeIn>
          )}
        </div>
      </section>
    </div>
  )
}

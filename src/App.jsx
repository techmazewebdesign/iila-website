import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Mission from './pages/Mission'
import Publications from './pages/Publications'
import Roadmap from './pages/Roadmap'
import Committees from './pages/Committees'
import Partners from './pages/Partners'
import ExpertNetwork from './pages/ExpertNetwork'
import Media from './pages/Media'
import Contact from './pages/Contact'
import HumanRights from './pages/HumanRights'
import OurPeople from './pages/OurPeople'
import PolicyBriefs from './pages/PolicyBriefs'
import { useLanguage } from './context/LanguageContext'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function LocalePathSync() {
  const { lang } = useLanguage()
  const { pathname, search, hash } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const isPersianPath = pathname === '/fa' || pathname.startsWith('/fa/')
    if (lang === 'fa' && !isPersianPath) {
      const target = pathname === '/' ? '/fa/' : `/fa${pathname}`
      navigate(`${target}${search}${hash}`, { replace: true })
    } else if (lang === 'en' && isPersianPath) {
      const target = pathname.replace(/^\/fa/, '') || '/'
      navigate(`${target}${search}${hash}`, { replace: true })
    }
  }, [lang, pathname, search, hash, navigate])

  return null
}

const pageRoutes = [
  ['/', Home],
  ['/about', About],
  ['/mission', Mission],
  ['/publications', Publications],
  ['/policy-briefs', PolicyBriefs],
  ['/human-rights', HumanRights],
  ['/roadmap', Roadmap],
  ['/committees', Committees],
  ['/partners', Partners],
  ['/expert-network', ExpertNetwork],
  ['/media', Media],
  ['/contact', Contact],
  ['/our-people', OurPeople],
]

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <BrowserRouter>
          <ScrollToTop />
          <LocalePathSync />
          <div className="min-h-screen bg-t-bg flex flex-col transition-colors duration-300">
            <Header />
            <main className="flex-1">
              <Routes>
                {pageRoutes.flatMap(([path, Component]) => {
                  const faPath = path === '/' ? '/fa/' : `/fa${path}`
                  return [
                    <Route key={path} path={path} element={<Component />} />,
                    <Route key={faPath} path={faPath} element={<Component />} />,
                  ]
                })}
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </LanguageProvider>
  )
}

export default App

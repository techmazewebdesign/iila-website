import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
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

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function App() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="min-h-screen bg-t-bg flex flex-col transition-colors duration-300">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/mission" element={<Mission />} />
                <Route path="/publications" element={<Publications />} />
                <Route path="/human-rights" element={<HumanRights />} />
                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="/committees" element={<Committees />} />
                <Route path="/partners" element={<Partners />} />
                <Route path="/expert-network" element={<ExpertNetwork />} />
                <Route path="/media" element={<Media />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/our-people" element={<OurPeople />} />
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

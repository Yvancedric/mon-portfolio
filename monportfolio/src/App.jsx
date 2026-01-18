import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import Blog from './pages/Blog'
import AdminProjects from './pages/AdminProjects'
import { LanguageProvider } from './contexts'
import './App.css'

function App() {
  return (
    <LanguageProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/a_propos" element={<About />} />
          <Route path="/mes-projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/admin/projects" element={<AdminProjects />} />
        </Routes>
      </Layout>
    </LanguageProvider>
  )
}

export default App


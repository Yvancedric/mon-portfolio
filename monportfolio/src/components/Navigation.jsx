import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Globe } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import '../styles/Navigation.css'

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const { language, toggleLanguage, isFrench } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    // Fermer le menu mobile lors du changement de route
    // Utilisation de setTimeout pour rendre l'appel asynchrone et éviter les rendus en cascade
    const timer = setTimeout(() => {
      setIsOpen(false)
    }, 0)
    return () => clearTimeout(timer)
  }, [location])

  const navItems = [
    { path: '/', labelFr: 'Accueil', labelEn: 'Home' },
    { path: '/a_propos', labelFr: 'À propos', labelEn: 'About' },
    { path: '/mes-projects', labelFr: 'Projets', labelEn: 'Projects' },
    { path: '/blog', labelFr: 'Blog', labelEn: 'Blog' },
    { path: '/contact', labelFr: 'Contact', labelEn: 'Contact' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className={`navigation ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="nav-content">
          <Link to="/" className="nav-logo">
            <img src="/vite.svg" alt="Portfolio Logo" className="logo-image" />
          </Link>

          <button
            className="nav-toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <ul className={`nav-menu ${isOpen ? 'open' : ''}`}>
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
                >
                  {isFrench ? item.labelFr : item.labelEn}
                </Link>
              </li>
            ))}
            <li>
              <button
                className="nav-lang-toggle"
                onClick={toggleLanguage}
                aria-label="Toggle language"
              >
                <Globe size={18} />
                <span>{language.toUpperCase()}</span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

export default Navigation

import React from 'react'
import { Link } from 'react-router-dom'
import { GithubIcon, Linkedin, Mail, Twitter, Instagram } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import '../styles/Footer.css'

const Footer = () => {
  const { isFrench } = useLanguage()

  const currentYear = new Date().getFullYear()

  const footerColumns = [
    {
      title: isFrench ? 'NAVIGATION' : 'NAVIGATION',
      links: [
        { to: '/', label: isFrench ? 'ACCUEIL' : 'HOME' },
        { to: '/a_propos', label: isFrench ? 'À PROPOS' : 'ABOUT' },
        { to: '/mes-projects', label: isFrench ? 'PROJETS' : 'PROJECTS' },
        { to: '/blog', label: 'BLOG' },
        { to: '/contact', label: 'CONTACT' },
      ]
    },
    {
      title: isFrench ? 'SERVICES' : 'SERVICES',
      links: [
        { to: '/mes-projects', label: isFrench ? 'DÉVELOPPEMENT WEB' : 'WEB DEVELOPMENT' },
        { to: '/mes-projects', label: isFrench ? 'APPLICATIONS MOBILE' : 'MOBILE APPS' },
        { to: '/mes-projects', label: isFrench ? 'UI/UX DESIGN' : 'UI/UX DESIGN' },
      ]
    },
    {
      title: isFrench ? 'RESSOURCES' : 'RESOURCES',
      links: [
        { to: '/blog', label: isFrench ? 'BLOG' : 'BLOG' },
        { to: '/mes-projects', label: isFrench ? 'PORTFOLIO' : 'PORTFOLIO' },
        { to: '/contact', label: isFrench ? 'SUPPORT' : 'SUPPORT' },
      ]
    },
    {
      title: isFrench ? 'À PROPOS' : 'ABOUT US',
      links: [
        { to: '/contact', label: isFrench ? 'NOUS CONTACTER' : 'CONTACT US' },
        { to: '/a_propos', label: isFrench ? 'À PROPOS' : 'ABOUT' },
        { to: '/mes-projects', label: isFrench ? 'PROJETS' : 'PROJECTS' },
      ]
    }
  ]

  const socialLinks = [
    { icon: GithubIcon, href: 'https://github.com/Yvancedric', label: 'GitHub' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/yvan-cedric-318727261', label: 'LinkedIn' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Mail, href: 'mailto:yvancedric.pro@gmail.com', label: 'Email' },
  ]

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-columns">
            {footerColumns.map((column, index) => (
              <div key={index} className="footer-column">
                <h3 className="footer-column-title">{column.title}</h3>
                <ul className="footer-links">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link to={link.to}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="footer-separator"></div>

        <div className="footer-bottom">
          <div className="footer-social">
            {socialLinks.map((link) => {
              const Icon = link.icon
              return (
                <a
                  key={link.label}
                  href={link.href}
                  aria-label={link.label}
                  className="social-icon"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon size={20} />
                </a>
              )
            })}
          </div>
          <p className="footer-copyright">
            © {currentYear} Copyright. {isFrench ? 'Tous droits réservés.' : 'All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

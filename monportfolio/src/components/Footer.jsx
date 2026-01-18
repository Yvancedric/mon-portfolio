import React from 'react'
import { Link } from 'react-router-dom'
import { GithubIcon, Linkedin, Mail, Twitter, Instagram } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import '../styles/Footer.css'

const Footer = () => {
  const { isFrench } = useLanguage()

  const currentYear = new Date().getFullYear()

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
        <div className="footer-content">
          <div className="footer-section">
            <h3>{isFrench ? 'Navigation' : 'Navigation'}</h3>
            <ul className="footer-links">
              <li><Link to="/">{isFrench ? 'Accueil' : 'Home'}</Link></li>
              <li><Link to="/a_propos">{isFrench ? 'À propos' : 'About'}</Link></li>
              <li><Link to="/mes-projects">{isFrench ? 'Projets' : 'Projects'}</Link></li>
              <li><Link to="/blog">{isFrench ? 'Blog' : 'Blog'}</Link></li>
              <li><Link to="/contact">{isFrench ? 'Contact' : 'Contact'}</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>{isFrench ? 'Réseaux sociaux' : 'Social Media'}</h3>
            <div className="footer-social">
              {socialLinks.map((link) => {
                const Icon = link.icon
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    aria-label={link.label}
                    className="social-link"
                  >
                    <Icon size={20} />
                  </a>
                )
              })}
            </div>
          </div>

          <div className="footer-section">
            <h3>{isFrench ? 'Contact' : 'Contact'}</h3>
            <p className="footer-text">
              {isFrench
                ? 'N\'hésitez pas à me contacter pour discuter de vos projets.'
                : 'Feel free to contact me to discuss your projects.'}
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {currentYear} YvanCedric. {isFrench ? 'Tous droits réservés.' : 'All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

import { useState, useEffect } from 'react'
import { LanguageContext } from './LanguageContext'

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Récupérer la langue depuis localStorage ou utiliser 'fr' par défaut
    return localStorage.getItem('portfolio-language') || 'fr'
  })

  useEffect(() => {
    localStorage.setItem('portfolio-language', language)
  }, [language])

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'fr' ? 'en' : 'fr')
  }

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    isFrench: language === 'fr',
    isEnglish: language === 'en',
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
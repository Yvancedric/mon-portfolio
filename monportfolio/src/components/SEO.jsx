import { useEffect } from 'react'

const SEO = ({ title, description, keywords }) => {
  useEffect(() => {
    // Mettre à jour le titre
    if (title) {
      document.title = `${title} - Portfolio`
    }

    // Mettre à jour la meta description
    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.setAttribute('name', 'description')
      document.head.appendChild(metaDescription)
    }
    if (description) {
      metaDescription.setAttribute('content', description)
    }

    // Mettre à jour les keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]')
    if (keywords) {
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta')
        metaKeywords.setAttribute('name', 'keywords')
        document.head.appendChild(metaKeywords)
      }
      metaKeywords.setAttribute('content', keywords)
    }
  }, [title, description, keywords])

  return null
}

export default SEO
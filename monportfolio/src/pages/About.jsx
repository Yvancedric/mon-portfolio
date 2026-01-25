import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { portfolioAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import SEO from '../components/SEO'
import '../styles/About.css'

const About = () => {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const { isFrench } = useLanguage()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const settingsRes = await portfolioAPI.getSettings().catch(() => ({ data: null }))
        setSettings(settingsRes.data)
      } catch (error) {
        console.error('Error fetching data:', error)
        setSettings(null)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  const ownerBio = isFrench ? settings?.owner_bio_fr : settings?.owner_bio_en
  const ownerName = settings?.owner_name || 'YvanCedric'
  const ownerPhoto = settings?.owner_photo_url

  return (
    <>
      <SEO
        title={isFrench ? 'À propos' : 'About'}
        description={ownerBio}
      />

      <section className="about-page">
        <div className="container">
          <div className="about-content-wrapper">
            {/* Left Section - Image/Product Display */}
            <motion.div
              className="about-image-section"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="about-image-container">
                {ownerPhoto ? (
                  <img src={ownerPhoto} alt={ownerName} className="about-main-image" />
                ) : (
                  <div className="about-placeholder-image">
                    <span>{ownerName.charAt(0)}</span>
                  </div>
                )}
                
                {/* Callout Box 1 - Stats */}
                <div className="about-callout about-callout-1">
                  <p className="callout-label">{isFrench ? 'Membres mensuels' : 'Monthly Members'}</p>
                  <p className="callout-value">5000+</p>
                </div>

                {/* Callout Box 2 - Reviews */}
                <div className="about-callout about-callout-2">
                  <div className="callout-avatars">
                    <div className="avatar"></div>
                    <div className="avatar"></div>
                    <div className="avatar"></div>
                  </div>
                  <p className="callout-value">8000+ {isFrench ? 'avis' : 'reviews'}</p>
                </div>
              </div>
            </motion.div>

            {/* Right Section - Text Content */}
            <motion.div
              className="about-text-section"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h1 className="about-title">{isFrench ? 'À propos de nous' : 'About Us'}</h1>
              
              <div className="about-description">
                <p>
                  {isFrench
                    ? `Bienvenue sur le portfolio de ${ownerName}. Je suis un développeur full stack passionné créant des solutions web modernes et performantes qui transforment vos idées en réalité numérique. Je combine créativité et expertise technique pour livrer des projets d'exception.`
                    : `Welcome to ${ownerName}'s portfolio. I am a passionate full stack developer creating modern and performant web solutions that transform your ideas into digital reality. I combine creativity and technical expertise to deliver exceptional projects.`}
                </p>
                <p>
                  {isFrench
                    ? 'Je sélectionne tous mes projets, y compris mes applications web, applications mobiles et solutions UI/UX, en utilisant des technologies modernes et des meilleures pratiques pour garantir des résultats de qualité supérieure.'
                    : 'I curate all my projects, including my web applications, mobile apps, and UI/UX solutions, using modern technologies and best practices to ensure superior quality results.'}
                </p>
              </div>

              <Link to="/mes-projects" className="about-explore-btn">
                {isFrench ? 'EXPLORER' : 'EXPLORE'}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

export default About

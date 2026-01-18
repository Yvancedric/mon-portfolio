import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../hooks/useLanguage'
import { portfolioAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import SkillCard from '../components/SkillCard'
import ExperienceTimeline from '../components/ExperienceTimeline'
import SEO from '../components/SEO'
import '../styles/About.css'

const About = () => {
  const [settings, setSettings] = useState(null)
  const [skills, setSkills] = useState([])
  const [skillCategories, setSkillCategories] = useState([])
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)
  const { isFrench } = useLanguage()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, skillsRes, categoriesRes, experiencesRes] = await Promise.all([
          portfolioAPI.getSettings().catch(() => ({ data: null })),
          portfolioAPI.getSkills().catch(() => ({ data: { results: [] } })),
          portfolioAPI.getSkillCategories().catch(() => ({ data: { results: [] } })),
          portfolioAPI.getExperiences().catch(() => ({ data: { results: [] } })),
        ])

        setSettings(settingsRes.data)
        setSkills(skillsRes.data.results || skillsRes.data || [])
        setSkillCategories(categoriesRes.data.results || categoriesRes.data || [])
        setExperiences(experiencesRes.data.results || experiencesRes.data || [])
      } catch (error) {
        console.error('Error fetching data:', error)
        // Définir des valeurs par défaut en cas d'erreur
        setSettings(null)
        setSkills([])
        setSkillCategories([])
        setExperiences([])
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <>
      <SEO
        title={isFrench ? 'À propos' : 'About'}
        description={ownerBio}
      />

      <section className="about section">
        <div className="container">
          <motion.div
            className="section-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2>{isFrench ? 'À propos de moi' : 'About me'}</h2>
          </motion.div>

          <motion.div
            className="about-content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="about-bio" variants={containerVariants}>
              <h3>{isFrench ? 'Biographie' : 'Biography'}</h3>
              <p>{ownerBio}</p>
            </motion.div>

            {skillCategories.length > 0 && (
              <motion.div className="skills-section" variants={containerVariants}>
                <h3>{isFrench ? 'Compétences' : 'Skills'}</h3>
                <div className="skills-grid">
                  {skillCategories.map((category) => {
                    const categorySkills = skills.filter(
                      (skill) => skill.category?.id === category.id
                    )
                    if (categorySkills.length === 0) return null

                    return (
                      <SkillCard
                        key={category.id}
                        category={category}
                        skills={categorySkills}
                        isFrench={isFrench}
                      />
                    )
                  })}
                </div>
              </motion.div>
            )}

            {experiences.length > 0 && (
              <motion.div className="experiences-section" variants={containerVariants}>
                <h3>{isFrench ? 'Parcours' : 'Experience'}</h3>
                <ExperienceTimeline experiences={experiences} isFrench={isFrench} />
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default About

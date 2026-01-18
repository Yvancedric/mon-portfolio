import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Download, GithubIcon, Linkedin, Mail, Code, Briefcase, Award, Users } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { portfolioAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import ProjectCard from '../components/ProjectCard'
import SEO from '../components/SEO'
import '../styles/Home.css'

const Home = () => {
  const [settings, setSettings] = useState(null)
  const [featuredProjects, setFeaturedProjects] = useState([])
  const [stats, setStats] = useState({ projects: 0, skills: 0, experiences: 0 })
  const [loading, setLoading] = useState(true)
  const { isFrench } = useLanguage()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, projectsRes, skillsRes, experiencesRes] = await Promise.all([
          portfolioAPI.getSettings().catch((err) => {
            console.warn('Settings API error:', err.response?.status || err.message)
            return { data: null }
          }),
          portfolioAPI.getFeaturedProjects().catch((err) => {
            console.warn('Featured Projects API error:', err.response?.status || err.message)
            return { data: { results: [] } }
          }),
          portfolioAPI.getSkills().catch((err) => {
            console.warn('Skills API error:', err.response?.status || err.message)
            return { data: { results: [] } }
          }),
          portfolioAPI.getExperiences().catch((err) => {
            console.warn('Experiences API error:', err.response?.status || err.message)
            return { data: { results: [] } }
          }),
        ])

        setSettings(settingsRes.data)
        setFeaturedProjects(projectsRes.data.results || projectsRes.data || [])
        
        // Debug: afficher les données reçues
        console.log('Données reçues:', {
          projects: projectsRes.data,
          skills: skillsRes.data,
          experiences: experiencesRes.data,
        })
        
        const projectsCount = projectsRes.data.results?.length || projectsRes.data?.length || 0
        const skillsCount = skillsRes.data.results?.length || skillsRes.data?.length || 0
        const experiencesCount = experiencesRes.data.results?.length || experiencesRes.data?.length || 0
        
        setStats({
          projects: projectsCount,
          skills: skillsCount,
          experiences: experiencesCount,
        })
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <LoadingSpinner />
  }

  const ownerName = settings?.owner_name || 'YvanCedric'
  const ownerTitle = isFrench 
    ? (settings?.owner_title_fr || 'Développeur Full Stack') 
    : (settings?.owner_title_en || 'Full Stack Developer')
  const ownerBio = isFrench 
    ? (settings?.owner_bio_fr || 'Passionné par le développement web et les technologies modernes. Je crée des applications web performantes et intuitives.')
    : (settings?.owner_bio_en || 'Passionate about web development and modern technologies. I create performant and intuitive web applications.')
  const ownerPhoto = settings?.owner_photo_url

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  }

  return (
    <>
      <SEO
        title={isFrench ? 'Accueil' : 'Home'}
        description={ownerBio}
      />

      <section className="hero section">
        <div className="container">
          <motion.div
            className="hero-content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="hero-text" variants={itemVariants}>
              <motion.div
                className="hero-greeting"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {isFrench ? 'Bonjour, je suis' : 'Hello, I am'}
              </motion.div>
              <motion.h1
                className="hero-name"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {ownerName}
              </motion.h1>
              <motion.h2
                className="hero-title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {ownerTitle}
              </motion.h2>
              <motion.p
                className="hero-description"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                {ownerBio}
              </motion.p>

              <motion.div
                className="hero-actions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <Link to="/mes-projects" className="btn btn-primary">
                  {isFrench ? 'Voir mes projets' : 'View my projects'}
                  <ArrowRight size={18} />
                </Link>
                <Link to="/contact" className="btn btn-secondary">
                  {isFrench ? 'Me contacter' : 'Contact me'}
                </Link>
                {settings?.cv_file_url && (
                  <a
                    href={settings.cv_file_url}
                    download
                    className="btn btn-outline"
                  >
                    <Download size={18} />
                    {isFrench ? 'Télécharger CV' : 'Download CV'}
                  </a>
                )}
              </motion.div>

              <motion.div
                className="hero-social"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                {settings?.github_url && (
                  <a
                    href={settings.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="social-icon"
                  >
                    <GithubIcon size={24} />
                  </a>
                )}
                {settings?.linkedin_url && (
                  <a
                    href={settings.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="social-icon"
                  >
                    <Linkedin size={24} />
                  </a>
                )}
                {settings?.owner_email && (
                  <a
                    href={`mailto:${settings.owner_email}`}
                    aria-label="Email"
                    className="social-icon"
                  >
                    <Mail size={24} />
                  </a>
                )}
              </motion.div>
            </motion.div>

            <motion.div
              className="hero-image"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              {ownerPhoto ? (
                <img
                  src={ownerPhoto}
                  alt={ownerName}
                  className="profile-image"
                />
              ) : (
                <div className="profile-placeholder">
                  <span>{ownerName.charAt(0)}</span>
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Section Statistiques */}
      <section className="stats section">
        <div className="container">
          <motion.div
            className="section-title"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2>{isFrench ? 'Statistiques' : 'Statistics'}</h2>
            <p>
              {isFrench
                ? 'Mes réalisations en chiffres'
                : 'My achievements in numbers'}
            </p>
          </motion.div>
          <motion.div
            className="stats-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div className="stat-card" variants={itemVariants}>
              <div className="stat-icon">
                <Briefcase size={32} />
              </div>
              <h3 className="stat-number">{stats.projects}+</h3>
              <p className="stat-label">{isFrench ? 'Projets' : 'Projects'}</p>
            </motion.div>
            <motion.div className="stat-card" variants={itemVariants}>
              <div className="stat-icon">
                <Code size={32} />
              </div>
              <h3 className="stat-number">{stats.skills}+</h3>
              <p className="stat-label">{isFrench ? 'Compétences' : 'Skills'}</p>
            </motion.div>
            <motion.div className="stat-card" variants={itemVariants}>
              <div className="stat-icon">
                <Award size={32} />
              </div>
              <h3 className="stat-number">{stats.experiences}+</h3>
              <p className="stat-label">{isFrench ? 'Expériences' : 'Experiences'}</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Section Projets en vedette */}
      {featuredProjects.length > 0 && (
        <section className="featured-projects section">
          <div className="container">
            <motion.div
              className="section-title"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2>{isFrench ? 'Projets en vedette' : 'Featured Projects'}</h2>
              <p>
                {isFrench
                  ? 'Découvrez quelques-uns de mes projets récents'
                  : 'Discover some of my recent projects'}
              </p>
            </motion.div>

            <motion.div
              className="projects-grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {featuredProjects.slice(0, 3).map((project) => (
                <ProjectCard key={project.id} project={project} isFrench={isFrench} />
              ))}
            </motion.div>

            <motion.div
              className="section-cta"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Link to="/mes-projects" className="btn btn-primary">
                {isFrench ? 'Voir tous les projets' : 'View all projects'}
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </section>
      )}
    </>
  )
}

export default Home
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Mail, Phone, MapPin, Facebook, Twitter, Instagram, ChevronDown } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { portfolioAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import ProjectCard from '../components/ProjectCard'
import SEO from '../components/SEO'
import '../styles/Home.css'

const Home = () => {
  const [settings, setSettings] = useState(null)
  const [featuredProjects, setFeaturedProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const { isFrench } = useLanguage()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, projectsRes] = await Promise.all([
          portfolioAPI.getSettings().catch((err) => {
            console.warn('Settings API error:', err.response?.status || err.message)
            return { data: null }
          }),
          portfolioAPI.getFeaturedProjects().catch((err) => {
            console.warn('Featured Projects API error:', err.response?.status || err.message)
            return { data: { results: [] } }
          }),
        ])

        setSettings(settingsRes.data)
        setFeaturedProjects(projectsRes.data.results || projectsRes.data || [])
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

  const services = [
    {
      title: isFrench ? 'Développement Web' : 'Web Development',
      description: isFrench ? 'Création de sites web modernes et performants' : 'Creating modern and performant websites',
      image: '/api/placeholder/400/300'
    },
    {
      title: isFrench ? 'UI/UX Design' : 'UI/UX Design',
      description: isFrench ? 'Design d\'interfaces utilisateur intuitives et attrayantes' : 'Intuitive and attractive user interface design',
      image: '/api/placeholder/400/300'
    },
    {
      title: isFrench ? 'Maintenance' : 'Maintenance',
      description: isFrench ? 'Maintenance et support technique pour vos applications' : 'Maintenance and technical support for your applications',
      image: '/api/placeholder/400/300'
    },
    {
      title: isFrench ? 'E-commerce' : 'E-commerce',
      description: isFrench ? 'Solutions e-commerce sur mesure pour votre business' : 'Custom e-commerce solutions for your business',
      image: '/api/placeholder/400/300'
    },
    {
      title: isFrench ? 'API Development' : 'API Development',
      description: isFrench ? 'Création d\'APIs RESTful et GraphQL robustes' : 'Creating robust RESTful and GraphQL APIs',
      image: '/api/placeholder/400/300'
    },
    {
      title: isFrench ? 'Optimisation SEO' : 'SEO Optimization',
      description: isFrench ? 'Optimisation pour les moteurs de recherche' : 'Search engine optimization',
      image: '/api/placeholder/400/300'
    }
  ]

  const howItWorks = [
    {
      number: '1',
      title: isFrench ? 'Prenez contact' : 'Get in touch',
      description: isFrench 
        ? 'Contactez-moi pour discuter de votre projet et de vos besoins spécifiques.'
        : 'Contact me to discuss your project and specific needs.'
    },
    {
      number: '2',
      title: isFrench ? 'Analyse du projet' : 'Project analysis',
      description: isFrench
        ? 'J\'analyse vos besoins et propose une solution adaptée à vos objectifs.'
        : 'I analyze your needs and propose a solution adapted to your objectives.'
    },
    {
      number: '3',
      title: isFrench ? 'Développement' : 'Development',
      description: isFrench
        ? 'Je développe votre projet en suivant les meilleures pratiques et standards.'
        : 'I develop your project following best practices and standards.'
    },
    {
      number: '4',
      title: isFrench ? 'Livraison & Support' : 'Delivery & Support',
      description: isFrench
        ? 'Je livre votre projet et assure un support continu pour son évolution.'
        : 'I deliver your project and provide ongoing support for its evolution.'
    }
  ]

  return (
    <>
      <SEO
        title={isFrench ? 'Accueil' : 'Home'}
        description={isFrench ? 'Portfolio de YvanCedric - Développeur Full Stack' : 'YvanCedric Portfolio - Full Stack Developer'}
      />

      {/* Hero Banner Section */}
      <section className="hero-banner">
        <div className="hero-overlay"></div>
        <div className="hero-wrapper">
          <motion.div
            className="hero-image-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {settings?.owner_photo_url ? (
              <img 
                src={settings.owner_photo_url} 
                alt={settings.owner_name || 'Portfolio'} 
                className="hero-photo"
              />
            ) : (
              <div className="hero-photo-placeholder">
                <span>{(settings?.owner_name || 'YC').charAt(0)}</span>
              </div>
            )}
          </motion.div>
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-title">
              {isFrench ? 'Choisissez l\'excellence' : 'Choose Excellence'}
            </h1>
            <p className="hero-subtitle">
              {isFrench
                ? 'Je crée des solutions web modernes et performantes qui transforment vos idées en réalité numérique. Spécialisé en développement full stack, je combine créativité et expertise technique pour livrer des projets d\'exception.'
                : 'I create modern and performant web solutions that transform your ideas into digital reality. Specialized in full stack development, I combine creativity and technical expertise to deliver exceptional projects.'}
            </p>
            <Link to="/contact" className="btn-hero">
              {isFrench ? 'ME CONTACTER' : 'CONTACT ME'}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="services-section section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>{isFrench ? 'Nos Services' : 'Our Services'}</h2>
            <p>
              {isFrench
                ? 'Des solutions complètes pour tous vos besoins numériques'
                : 'Complete solutions for all your digital needs'}
            </p>
          </motion.div>
          <div className="services-grid">
            {services.map((service, index) => (
              <motion.div
                key={index}
                className="service-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="service-image">
                  <img src={service.image} alt={service.title} />
                </div>
                <div className="service-content">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section section">
        <div className="container">
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>{isFrench ? 'Comment ça fonctionne' : 'Here\'s How It Works'}</h2>
            <p>
              {isFrench
                ? 'Un processus simple et efficace pour transformer vos idées en réalité'
                : 'A simple and efficient process to transform your ideas into reality'}
            </p>
          </motion.div>
          <div className="how-it-works-grid">
            {howItWorks.map((step, index) => (
              <motion.div
                key={index}
                className="how-it-works-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="step-number">{step.number}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                <button className="btn-more">
                  {isFrench ? 'En savoir plus' : 'More'} <ChevronDown size={16} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      {featuredProjects.length > 0 && (
        <section className="featured-projects section">
          <div className="container">
            <motion.div
              className="section-header"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2>{isFrench ? 'Projets en vedette' : 'Featured Projects'}</h2>
              <p>
                {isFrench
                  ? 'Découvrez quelques-uns de mes projets récents'
                  : 'Discover some of my recent projects'}
              </p>
            </motion.div>
            <div className="projects-grid">
              {featuredProjects.slice(0, 3).map((project) => (
                <ProjectCard key={project.id} project={project} isFrench={isFrench} />
              ))}
            </div>
            <div className="section-cta">
              <Link to="/mes-projects" className="btn-primary">
                {isFrench ? 'Voir tous les projets' : 'View all projects'}
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

    </>
  )
}

export default Home

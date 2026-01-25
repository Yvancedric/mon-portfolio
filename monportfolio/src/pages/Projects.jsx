import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { portfolioAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import SEO from '../components/SEO'
import '../styles/Projects.css'

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const { isFrench } = useLanguage()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, categoriesRes] = await Promise.all([
          portfolioAPI.getProjects().catch(() => ({ data: { results: [] } })),
          portfolioAPI.getProjectCategories().catch(() => ({ data: { results: [] } })),
        ])

        const projectsData = projectsRes.data.results || projectsRes.data || []
        const categoriesData = categoriesRes.data.results || categoriesRes.data || []

        setProjects(projectsData)
        setCategories(categoriesData)
      } catch (error) {
        console.error('Error fetching data:', error)
        setProjects([])
        setCategories([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredProjects = selectedCategory
    ? projects.filter((project) => project.category?.id === selectedCategory)
    : projects

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <>
      <SEO
        title={isFrench ? 'Projets' : 'Projects'}
        description={isFrench ? 'Découvrez mes projets de développement' : 'Discover my development projects'}
      />

      <section className="projects-page">
        <div className="container">
          {/* Header with Title and Button */}
          <div className="projects-header">
            <h1 className="projects-title">
              {isFrench ? 'Mes Projets' : 'My Projects'}
            </h1>
            <Link to="/blog" className="projects-see-all-btn">
              {isFrench ? 'Voir tous les projets' : 'See All Projects'}
            </Link>
          </div>

          {/* Filter Buttons */}
          {categories.length > 0 && (
            <div className="projects-filters">
              <button
                className={`filter-btn ${selectedCategory === null ? 'active' : ''}`}
                onClick={() => setSelectedCategory(null)}
              >
                {isFrench ? 'Tous' : 'All'}
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {isFrench ? category.name_fr : category.name_en}
                </button>
              ))}
            </div>
          )}

          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
            <div className="projects-grid">
              {filteredProjects.map((project) => (
                <Link
                  key={project.id}
                  to={project.demo_url || project.github_url ? '#' : '/mes-projects'}
                  onClick={(e) => {
                    if (project.demo_url || project.github_url) {
                      e.preventDefault()
                      window.open(project.demo_url || project.github_url, '_blank', 'noopener,noreferrer')
                    }
                  }}
                  className="project-card"
                >
                  <div className="project-image">
                    {project.featured_image_url ? (
                      <img
                        src={project.featured_image_url}
                        alt={isFrench ? project.title_fr : project.title_en}
                      />
                    ) : (
                      <div className="project-placeholder">
                        <span>{(isFrench ? project.title_fr : project.title_en)?.charAt(0) || 'P'}</span>
                      </div>
                    )}
                  </div>
                  <div className="project-content">
                    <h3 className="project-title">
                      {isFrench ? project.title_fr : project.title_en}
                    </h3>
                    <p className="project-client">
                      {project.client_name || 'Client'}
                    </p>
                    <p className="project-category">
                      {project.category
                        ? isFrench
                          ? project.category.name_fr
                          : project.category.name_en
                        : 'Uncategorized'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="no-projects">
              <p>{isFrench ? 'Aucun projet trouvé' : 'No projects found'}</p>
            </div>
          )}

          {/* Load More Button - Masqué car tous les projets sont déjà affichés */}
        </div>
      </section>
    </>
  )
}

export default Projects

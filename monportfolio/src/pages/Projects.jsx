import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '../hooks/useLanguage'
import { portfolioAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import ProjectCard from '../components/ProjectCard'
import ProjectFilter from '../components/ProjectFilter'
import SEO from '../components/SEO'
import '../styles/Projects.css'

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [categories, setCategories] = useState([])
  const [technologies, setTechnologies] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedTech, setSelectedTech] = useState(null)
  const [loading, setLoading] = useState(true)
  const { isFrench } = useLanguage()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, categoriesRes, techRes] = await Promise.all([
          portfolioAPI.getProjects().catch((err) => {
            console.warn('⚠️ Erreur API Projects:', err.response?.status || err.message)
            console.warn('URL appelée:', err.config?.url || '/projects/')
            return { data: { results: [] } }
          }),
          portfolioAPI.getProjectCategories().catch((err) => {
            console.warn('⚠️ Erreur API Categories:', err.response?.status || err.message)
            return { data: { results: [] } }
          }),
          portfolioAPI.getTechnologies().catch((err) => {
            console.warn('⚠️ Erreur API Technologies:', err.response?.status || err.message)
            return { data: { results: [] } }
          }),
        ])

        // Debug: afficher les données reçues
        console.log('📦 Réponse complète Projects:', projectsRes)
        console.log('📦 Projets reçus (data):', projectsRes.data)
        console.log('📁 Catégories reçues:', categoriesRes.data)
        console.log('🔧 Technologies reçues:', techRes.data)

        // Gérer différents formats de réponse API
        let projectsData = []
        if (projectsRes.data) {
          if (Array.isArray(projectsRes.data)) {
            projectsData = projectsRes.data
          } else if (projectsRes.data.results && Array.isArray(projectsRes.data.results)) {
            projectsData = projectsRes.data.results
          } else if (projectsRes.data.data && Array.isArray(projectsRes.data.data)) {
            projectsData = projectsRes.data.data
          }
        }

        const categoriesData = categoriesRes.data.results || categoriesRes.data || []
        const technologiesData = techRes.data.results || techRes.data || []

        console.log('✅ Projets à afficher:', projectsData.length, projectsData)
        console.log('🔍 Structure du premier projet:', projectsData[0])

        setProjects(projectsData)
        setCategories(categoriesData)
        setTechnologies(technologiesData)
      } catch (error) {
        console.error('❌ Erreur lors de la récupération des projets:', error)
        // Définir des tableaux vides en cas d'erreur
        setProjects([])
        setCategories([])
        setTechnologies([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredProjects = projects.filter((project) => {
    if (selectedCategory && project.category?.id !== selectedCategory) {
      return false
    }
    if (selectedTech && !project.technologies?.some((tech) => tech.id === selectedTech)) {
      return false
    }
    return true
  })

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <>
      <SEO
        title={isFrench ? 'Projets' : 'Projects'}
        description={isFrench ? 'Découvrez mes projets de développement' : 'Discover my development projects'}
      />

      <section className="projects section">
        <div className="container">
          <motion.div
            className="section-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2>{isFrench ? 'Mes Projets' : 'My Projects'}</h2>
            <p>
              {isFrench
                ? 'Découvrez une sélection de mes réalisations'
                : 'Discover a selection of my work'}
            </p>
          </motion.div>

          <ProjectFilter
            categories={categories}
            technologies={technologies}
            selectedCategory={selectedCategory}
            selectedTech={selectedTech}
            onCategoryChange={setSelectedCategory}
            onTechChange={setSelectedTech}
            isFrench={isFrench}
          />

          <motion.div
            className="projects-grid"
            initial="hidden"
            animate="visible"
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
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} isFrench={isFrench} />
              ))
            ) : (
              <div className="no-projects">
                <p>{isFrench ? 'Aucun projet trouvé' : 'No projects found'}</p>
                {projects.length === 0 && (
                  <div style={{ marginTop: '20px', padding: '20px', background: '#f5f5f5', borderRadius: '8px' }}>
                    <p style={{ marginBottom: '10px' }}>
                      {isFrench 
                        ? '💡 Pour ajouter des projets :' 
                        : '💡 To add projects:'}
                    </p>
                    <ul style={{ textAlign: 'left', display: 'inline-block' }}>
                      <li>
                        {isFrench 
                          ? '1. Allez dans l\'admin Django : http://localhost:8000/admin/portfoapp/project/' 
                          : '1. Go to Django admin: http://localhost:8000/admin/portfoapp/project/'}
                      </li>
                      <li>
                        {isFrench 
                          ? '2. Cliquez sur "Ajouter un projet"' 
                          : '2. Click "Add project"'}
                      </li>
                      <li>
                        {isFrench 
                          ? '3. Remplissez les informations et sauvegardez' 
                          : '3. Fill in the information and save'}
                      </li>
                      <li>
                        {isFrench 
                          ? '4. Vérifiez que l\'API fonctionne : http://localhost:8000/portfolio/projects/' 
                          : '4. Check that the API works: http://localhost:8000/portfolio/projects/'}
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default Projects


import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Plus, Save, X, Trash2, Edit2 } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { portfolioAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import '../styles/AdminProjects.css'

const AdminProjects = () => {
  const [projects, setProjects] = useState([])
  const [categories, setCategories] = useState([])
  const [technologies, setTechnologies] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const { isFrench } = useLanguage()

  const [formData, setFormData] = useState({
    title_fr: '',
    title_en: '',
    short_description_fr: '',
    short_description_en: '',
    description_fr: '',
    description_en: '',
    image_url: '',
    demo_url: '',
    github_url: '',
    featured: false,
    category: '',
    technologies: [],
  })

  const fetchData = useCallback(async () => {
    try {
      const [projectsRes, categoriesRes, techRes] = await Promise.all([
        portfolioAPI.getProjects(),
        portfolioAPI.getProjectCategories(),
        portfolioAPI.getTechnologies(),
      ])

      setProjects(projectsRes.data.results || projectsRes.data)
      setCategories(categoriesRes.data.results || categoriesRes.data)
      setTechnologies(techRes.data.results || techRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
      alert(isFrench ? 'Erreur lors du chargement des données' : 'Error loading data')
    } finally {
      setLoading(false)
    }
  }, [isFrench])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleTechnologyChange = (techId) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies.includes(techId)
        ? prev.technologies.filter((id) => id !== techId)
        : [...prev.technologies, techId],
    }))
  }

  const resetForm = () => {
    setFormData({
      title_fr: '',
      title_en: '',
      short_description_fr: '',
      short_description_en: '',
      description_fr: '',
      description_en: '',
      image_url: '',
      demo_url: '',
      github_url: '',
      featured: false,
      category: '',
      technologies: [],
    })
    setIsEditing(false)
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const projectData = {
        ...formData,
        category: formData.category || null,
      }

      if (isEditing) {
        await portfolioAPI.updateProject(editingId, projectData)
        alert(isFrench ? 'Projet mis à jour avec succès' : 'Project updated successfully')
      } else {
        await portfolioAPI.createProject(projectData)
        alert(isFrench ? 'Projet créé avec succès' : 'Project created successfully')
      }

      resetForm()
      fetchData()
    } catch (error) {
      console.error('Error saving project:', error)
      alert(
        isFrench
          ? 'Erreur lors de la sauvegarde du projet'
          : 'Error saving project'
      )
    }
  }

  const handleEdit = (project) => {
    setFormData({
      title_fr: project.title_fr || '',
      title_en: project.title_en || '',
      short_description_fr: project.short_description_fr || '',
      short_description_en: project.short_description_en || '',
      description_fr: project.description_fr || '',
      description_en: project.description_en || '',
      image_url: project.image_url || '',
      demo_url: project.demo_url || '',
      github_url: project.github_url || '',
      featured: project.featured || false,
      category: project.category?.id || '',
      technologies: project.technologies?.map((t) => t.id) || [],
    })
    setIsEditing(true)
    setEditingId(project.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        isFrench
          ? 'Êtes-vous sûr de vouloir supprimer ce projet ?'
          : 'Are you sure you want to delete this project?'
      )
    ) {
      return
    }

    try {
      await portfolioAPI.deleteProject(id)
      alert(isFrench ? 'Projet supprimé avec succès' : 'Project deleted successfully')
      fetchData()
    } catch (error) {
      console.error('Error deleting project:', error)
      alert(
        isFrench
          ? 'Erreur lors de la suppression du projet'
          : 'Error deleting project'
      )
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="admin-projects">
      <div className="container">
        <div className="admin-header">
          <h1>{isFrench ? 'Gestion des Projets' : 'Projects Management'}</h1>
          <button
            className="btn btn-primary"
            onClick={() => {
              resetForm()
              setShowForm(true)
            }}
          >
            <Plus size={20} />
            {isFrench ? 'Nouveau Projet' : 'New Project'}
          </button>
        </div>

        {showForm && (
          <motion.div
            className="admin-form-container"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="admin-form-header">
              <h2>
                {isEditing
                  ? isFrench
                    ? 'Modifier le projet'
                    : 'Edit Project'
                  : isFrench
                  ? 'Nouveau projet'
                  : 'New Project'}
              </h2>
              <button className="btn-close" onClick={resetForm}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-row">
                <div className="form-group">
                  <label>{isFrench ? 'Titre (FR)' : 'Title (FR)'}</label>
                  <input
                    type="text"
                    name="title_fr"
                    value={formData.title_fr}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>{isFrench ? 'Titre (EN)' : 'Title (EN)'}</label>
                  <input
                    type="text"
                    name="title_en"
                    value={formData.title_en}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>
                    {isFrench ? 'Description courte (FR)' : 'Short Description (FR)'}
                  </label>
                  <textarea
                    name="short_description_fr"
                    value={formData.short_description_fr}
                    onChange={handleInputChange}
                    rows="3"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>
                    {isFrench ? 'Description courte (EN)' : 'Short Description (EN)'}
                  </label>
                  <textarea
                    name="short_description_en"
                    value={formData.short_description_en}
                    onChange={handleInputChange}
                    rows="3"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{isFrench ? 'Description (FR)' : 'Description (FR)'}</label>
                  <textarea
                    name="description_fr"
                    value={formData.description_fr}
                    onChange={handleInputChange}
                    rows="5"
                  />
                </div>
                <div className="form-group">
                  <label>{isFrench ? 'Description (EN)' : 'Description (EN)'}</label>
                  <textarea
                    name="description_en"
                    value={formData.description_en}
                    onChange={handleInputChange}
                    rows="5"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{isFrench ? 'URL de l\'image' : 'Image URL'}</label>
                  <input
                    type="url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>{isFrench ? 'Catégorie' : 'Category'}</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value="">{isFrench ? 'Aucune' : 'None'}</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {isFrench ? cat.name_fr : cat.name_en}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{isFrench ? 'URL de la démo' : 'Demo URL'}</label>
                  <input
                    type="url"
                    name="demo_url"
                    value={formData.demo_url}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>{isFrench ? 'URL GitHub' : 'GitHub URL'}</label>
                  <input
                    type="url"
                    name="github_url"
                    value={formData.github_url}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  {isFrench ? 'Technologies' : 'Technologies'}
                </label>
                <div className="technologies-checkboxes">
                  {technologies.map((tech) => (
                    <label key={tech.id} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.technologies.includes(tech.id)}
                        onChange={() => handleTechnologyChange(tech.id)}
                      />
                      <span>{tech.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                  />
                  <span>{isFrench ? 'Projet en vedette' : 'Featured Project'}</span>
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  <Save size={18} />
                  {isFrench ? 'Enregistrer' : 'Save'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  {isFrench ? 'Annuler' : 'Cancel'}
                </button>
              </div>
            </form>
          </motion.div>
        )}

        <div className="projects-list">
          {projects.length === 0 ? (
            <p className="no-projects">
              {isFrench ? 'Aucun projet trouvé' : 'No projects found'}
            </p>
          ) : (
            projects.map((project) => (
              <motion.div
                key={project.id}
                className="project-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="project-info">
                  {project.image_url && (
                    <img
                      src={project.image_url}
                      alt={isFrench ? project.title_fr : project.title_en}
                      className="project-thumbnail"
                    />
                  )}
                  <div className="project-details">
                    <h3>{isFrench ? project.title_fr : project.title_en}</h3>
                    <p>{isFrench ? project.short_description_fr : project.short_description_en}</p>
                    {project.featured && (
                      <span className="featured-badge">
                        {isFrench ? 'Vedette' : 'Featured'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="project-actions">
                  <button
                    className="btn btn-icon"
                    onClick={() => handleEdit(project)}
                    title={isFrench ? 'Modifier' : 'Edit'}
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    className="btn btn-icon btn-danger"
                    onClick={() => handleDelete(project.id)}
                    title={isFrench ? 'Supprimer' : 'Delete'}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminProjects

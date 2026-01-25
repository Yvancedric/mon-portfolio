import { motion } from 'framer-motion'
import '../styles/ProjectCard.css'

const ProjectCard = ({ project, isFrench }) => {
  const title = isFrench ? project.title_fr : project.title_en
  const description = isFrench ? project.short_description_fr : project.short_description_en

  return (
    <motion.div
      className="project-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <div className="project-image-container">
        {(project.image_url || project.image) ? (
          <img 
            src={project.image_url || project.image} 
            alt={title} 
            className="project-image" 
            onError={(e) => {
              // Si l'image ne charge pas, afficher le placeholder
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'flex'
            }}
          />
        ) : null}
        {(!project.image_url && !project.image) && (
          <div className="project-placeholder">
            <span>{title.charAt(0)}</span>
          </div>
        )}
        {project.category && (
          <span
            className="project-category"
            style={{ backgroundColor: project.category.color || 'var(--color-primary)' }}
          >
            {isFrench ? project.category.name_fr : project.category.name_en}
          </span>
        )}
        {project.featured && (
          <span className="project-featured">
            {isFrench ? 'Vedette' : 'Featured'}
          </span>
        )}
      </div>

      <div className="project-content">
        <h3>{title}</h3>
        <p>{description}</p>

        {project.technologies && project.technologies.length > 0 && (
          <div className="project-technologies">
            {project.technologies.slice(0, 5).map((tech) => (
              <span key={tech.id} className="tech-tag">
                {tech.name}
              </span>
            ))}
            {project.technologies.length > 5 && (
              <span className="tech-tag">+{project.technologies.length - 5}</span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default ProjectCard

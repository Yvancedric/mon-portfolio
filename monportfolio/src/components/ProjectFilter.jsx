import { X } from 'lucide-react'
import '../styles/ProjectFilter.css'

const ProjectFilter = ({
  categories,
  technologies,
  selectedCategory,
  selectedTech,
  onCategoryChange,
  onTechChange,
  isFrench,
}) => {
  return (
    <div className="project-filters">
      <div className="filter-group">
        <h4>{isFrench ? 'Catégories' : 'Categories'}</h4>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${selectedCategory === null ? 'active' : ''}`}
            onClick={() => onCategoryChange(null)}
          >
            {isFrench ? 'Tous' : 'All'}
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`filter-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => onCategoryChange(category.id)}
              style={{
                '--category-color': category.color || 'var(--color-primary)',
              }}
            >
              {isFrench ? category.name_fr : category.name_en}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <h4>{isFrench ? 'Technologies' : 'Technologies'}</h4>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${selectedTech === null ? 'active' : ''}`}
            onClick={() => onTechChange(null)}
          >
            {isFrench ? 'Toutes' : 'All'}
          </button>
          {technologies.map((tech) => (
            <button
              key={tech.id}
              className={`filter-btn ${selectedTech === tech.id ? 'active' : ''}`}
              onClick={() => onTechChange(tech.id)}
            >
              {tech.name}
            </button>
          ))}
        </div>
      </div>

      {(selectedCategory || selectedTech) && (
        <button
          className="clear-filters"
          onClick={() => {
            onCategoryChange(null)
            onTechChange(null)
          }}
        >
          <X size={16} />
          {isFrench ? 'Effacer les filtres' : 'Clear filters'}
        </button>
      )}
    </div>
  )
}

export default ProjectFilter

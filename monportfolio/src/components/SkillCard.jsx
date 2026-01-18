import { motion } from 'framer-motion'
import '../styles/SkillCard.css'

const SkillCard = ({ category, skills, isFrench }) => {
  return (
    <motion.div
      className="skill-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="skill-card-header">
        {category.icon && (
          <span className="skill-icon">{category.icon}</span>
        )}
        <h4>{isFrench ? category.name_fr : category.name_en}</h4>
      </div>
      <div className="skill-list">
        {skills.map((skill) => (
          <div key={skill.id} className="skill-item">
            <div className="skill-info">
              <span className="skill-name">{skill.name}</span>
              <span className="skill-level">{skill.level}/10</span>
            </div>
            <div className="skill-bar">
              <motion.div
                className="skill-progress"
                initial={{ width: 0 }}
                whileInView={{ width: `${(skill.level / 10) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: 'easeOut' }}
                style={{
                  background: `linear-gradient(90deg, var(--color-accent-light), var(--color-accent-dark))`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default SkillCard
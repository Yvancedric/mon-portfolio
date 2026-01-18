import { motion } from 'framer-motion'
import { Calendar, MapPin, Briefcase, GraduationCap } from 'lucide-react'
import '../styles/ExperienceTimeline.css'

const ExperienceTimeline = ({ experiences, isFrench }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(isFrench ? 'fr-FR' : 'en-US', {
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="timeline">
      {experiences.map((experience, index) => {
        const isProfessional = experience.experience_type === 'professional'
        const Icon = isProfessional ? Briefcase : GraduationCap

        return (
          <motion.div
            key={experience.id}
            className="timeline-item"
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="timeline-marker">
              <Icon size={24} />
            </div>
            <div className="timeline-content">
              <div className="timeline-header">
                <h4>{isFrench ? experience.title_fr : experience.title_en}</h4>
                <span className={`timeline-badge ${isProfessional ? 'professional' : 'academic'}`}>
                  {isFrench
                    ? isProfessional
                      ? 'Professionnel'
                      : 'Académique'
                    : isProfessional
                    ? 'Professional'
                    : 'Academic'}
                </span>
              </div>
              <h5 className="timeline-company">
                {isFrench ? experience.company_fr : experience.company_en}
              </h5>
              <div className="timeline-meta">
                <span className="timeline-date">
                  <Calendar size={16} />
                  {formatDate(experience.start_date)} -{' '}
                  {experience.is_current
                    ? isFrench
                      ? 'Présent'
                      : 'Present'
                    : formatDate(experience.end_date)}
                </span>
                {experience.location_fr && (
                  <span className="timeline-location">
                    <MapPin size={16} />
                    {isFrench ? experience.location_fr : experience.location_en}
                  </span>
                )}
              </div>
              {(experience.description_fr || experience.description_en) && (
                <p className="timeline-description">
                  {isFrench ? experience.description_fr : experience.description_en}
                </p>
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default ExperienceTimeline

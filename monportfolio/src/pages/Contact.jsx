import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MapPin, Phone, CheckCircle, AlertCircle } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { portfolioAPI } from '../services/api'
import ContactForm from '../components/ContactForm'
import SEO from '../components/SEO'
import '../styles/Contact.css'

const Contact = () => {
  const [formStatus, setFormStatus] = useState({ type: null, message: '' })
  const { isFrench } = useLanguage()

  const handleSubmit = async (formData) => {
    try {
      await portfolioAPI.sendContactMessage({
        ...formData,
        honeypot: '', // Honeypot anti-spam
      })
      setFormStatus({
        type: 'success',
        message: isFrench
          ? 'Votre message a été envoyé avec succès !'
          : 'Your message has been sent successfully!',
      })
    } catch (_error) {
      console.error('Contact form error:', _error)
      setFormStatus({
        type: 'error',
        message: isFrench
          ? 'Une erreur est survenue. Veuillez réessayer.'
          : 'An error occurred. Please try again.',
      })
    }
  }

  return (
    <>
      <SEO
        title={isFrench ? 'Contact' : 'Contact'}
        description={isFrench ? 'Contactez-moi pour discuter de vos projets' : 'Contact me to discuss your projects'}
      />

      <section className="contact section">
        <div className="container">
          <motion.div
            className="section-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2>{isFrench ? 'Contactez-moi' : 'Contact me'}</h2>
            <p>
              {isFrench
                ? 'N\'hésitez pas à me contacter pour discuter de vos projets'
                : 'Feel free to contact me to discuss your projects'}
            </p>
          </motion.div>

          <div className="contact-content">
            <motion.div
              className="contact-info"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="info-card">
                <Mail size={24} />
                <h4>{isFrench ? 'Email' : 'Email'}</h4>
                <a href="mailto:yvancedric.pro@gmail.com">ivancedric82@gmail.com</a>
              </div>

              <div className="info-card">
                <Phone size={24} />
                <h4>{isFrench ? 'Téléphone' : 'Phone'}</h4>
                <a href="tel:+2250767685827">+225 07 67 68 58 27</a>
              </div>

              <div className="info-card">
                <MapPin size={24} />
                <h4>{isFrench ? 'Localisation' : 'Location'}</h4>
                <p>Abidjan, Côte d'Ivoire</p>
              </div>
            </motion.div>

            <motion.div
              className="contact-form-container"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {formStatus.type && (
                <div
                  className={`form-message ${formStatus.type === 'success' ? 'success' : 'error'}`}
                >
                  {formStatus.type === 'success' ? (
                    <CheckCircle size={20} />
                  ) : (
                    <AlertCircle size={20} />
                  )}
                  <span>{formStatus.message}</span>
                </div>
              )}

              <ContactForm onSubmit={handleSubmit} isFrench={isFrench} />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Contact

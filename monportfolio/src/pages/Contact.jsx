import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MapPin, Phone, Printer } from 'lucide-react'
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
      console.log('Sending contact form data:', formData)
      const response = await portfolioAPI.sendContactMessage({
        name: formData.name?.trim() || '',
        email: formData.email?.trim() || '',
        subject: formData.subject?.trim() || '',
        message: formData.message?.trim() || '',
        honeypot: '',
      })
      console.log('Contact form response:', response)
      setFormStatus({
        type: 'success',
        message: isFrench
          ? 'Votre message a été envoyé avec succès !'
          : 'Your message has been sent successfully!',
      })
    } catch (error) {
      console.error('Contact form error:', error)
      console.error('Error response:', error.response?.data)
      console.error('Error status:', error.response?.status)
      console.error('Error code:', error.code)
      
      let errorMessage = isFrench
        ? 'Une erreur est survenue. Veuillez réessayer.'
        : 'An error occurred. Please try again.'
      
      if (error.response?.data) {
        const errorData = error.response.data
        if (typeof errorData === 'object' && errorData !== null) {
          const errorMessages = Object.values(errorData).flat().filter(Boolean)
          if (errorMessages.length > 0) {
            errorMessage = errorMessages.join(', ')
          } else if (error.response.status === 400) {
            errorMessage = isFrench
              ? 'Veuillez vérifier que tous les champs sont correctement remplis.'
              : 'Please check that all fields are correctly filled.'
          }
        } else if (typeof errorData === 'string') {
          errorMessage = errorData
        }
      } else if (error.code === 'ERR_NETWORK' || error.message?.includes('Network')) {
        errorMessage = isFrench
          ? 'Impossible de se connecter au serveur. Vérifiez que le backend est démarré et votre connexion internet.'
          : 'Unable to connect to server. Please check that the backend is running and your internet connection.'
      } else if (error.response?.status === 404) {
        errorMessage = isFrench
          ? 'Le service de contact n\'est pas disponible. Veuillez réessayer plus tard.'
          : 'Contact service is not available. Please try again later.'
      }
      
      setFormStatus({
        type: 'error',
        message: errorMessage,
      })
    }
  }

  return (
    <>
      <SEO
        title={isFrench ? 'Contact' : 'Contact'}
        description={isFrench ? 'Contactez-moi pour discuter de vos projets' : 'Contact me to discuss your projects'}
      />

      <section className="contact-page">
        <div className="contact-container">
          {/* Left Sidebar - Contact Info */}
          <motion.div
            className="contact-sidebar"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="sidebar-title">{isFrench ? 'Contactez-nous' : 'Contact Us'}</h2>
            
            <div className="contact-info-list">
              <div className="contact-info-item">
                <MapPin size={24} className="contact-icon" />
                <div className="contact-info-text">
                  <p>Rue du Plateau</p>
                  <p>Abidjan, Côte d'Ivoire</p>
                </div>
              </div>

              <div className="contact-info-item">
                <Mail size={24} className="contact-icon" />
                <div className="contact-info-text">
                  <p>ivancedric82@gmail.com</p>
                </div>
              </div>

              <div className="contact-info-item">
                <Phone size={24} className="contact-icon" />
                <div className="contact-info-text">
                  <p>+225 07 67 68 58 27</p>
                </div>
              </div>

              <div className="contact-info-item">
                <Printer size={24} className="contact-icon" />
                <div className="contact-info-text">
                  <p>à vénir</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Panel - Contact Form */}
          <motion.div
            className="contact-form-panel"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="form-title">{isFrench ? 'Entrez en contact' : 'Get in Touch'}</h2>
            <p className="form-subtitle">
              {isFrench
                ? 'N\'hésitez pas à nous envoyer un message ci-dessous !'
                : 'Feel free to drop us a line below!'}
            </p>

            {formStatus.type && (
              <div className={`form-message ${formStatus.type === 'success' ? 'success' : 'error'}`}>
                <span>{formStatus.message}</span>
              </div>
            )}

            <ContactForm onSubmit={handleSubmit} isFrench={isFrench} />
          </motion.div>
        </div>
      </section>
    </>
  )
}

export default Contact

import { useState } from 'react'
import { Send, Loader } from 'lucide-react'
import '../styles/ContactForm.css'

const ContactForm = ({ onSubmit, isFrench }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = isFrench ? 'Le nom est requis' : 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = isFrench ? 'L\'email est requis' : 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = isFrench ? 'Email invalide' : 'Invalid email'
    }

    if (!formData.subject.trim()) {
      newErrors.subject = isFrench ? 'Le sujet est requis' : 'Subject is required'
    }

    if (!formData.message.trim()) {
      newErrors.message = isFrench ? 'Le message est requis' : 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = isFrench
        ? 'Le message doit contenir au moins 10 caractères'
        : 'Message must be at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      })
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder={isFrench ? 'Votre nom' : 'Your Name'}
          className={errors.name ? 'error' : ''}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <span className="error-message" role="alert">
            {errors.name}
          </span>
        )}
      </div>

      <div className="form-group">
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder={isFrench ? 'Votre email' : 'Your Email'}
          className={errors.email ? 'error' : ''}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <span className="error-message" role="alert">
            {errors.email}
          </span>
        )}
      </div>

      <div className="form-group">
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder={isFrench ? 'Sujet' : 'Subject'}
          className={errors.subject ? 'error' : ''}
          aria-invalid={!!errors.subject}
        />
        {errors.subject && (
          <span className="error-message" role="alert">
            {errors.subject}
          </span>
        )}
      </div>

      <div className="form-group">
        <textarea
          id="message"
          name="message"
          rows="6"
          value={formData.message}
          onChange={handleChange}
          placeholder={isFrench ? 'Tapez votre message ici.....' : 'Typing your massage here.....'}
          className={errors.message ? 'error' : ''}
          aria-invalid={!!errors.message}
        />
        {errors.message && (
          <span className="error-message" role="alert">
            {errors.message}
          </span>
        )}
      </div>

      {/* Honeypot field (hidden) */}
      <input
        type="text"
        name="honeypot"
        style={{ display: 'none' }}
        tabIndex="-1"
        autoComplete="off"
      />

      <button type="submit" className="submit-btn" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader size={18} className="spinning" />
            {isFrench ? 'Envoi...' : 'Sending...'}
          </>
        ) : (
          <>
            <Send size={18} />
            {isFrench ? 'ENVOYER' : 'SEND'}
          </>
        )}
      </button>
    </form>
  )
}

export default ContactForm

import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/portfolio'

// Debug: Afficher l'URL de l'API utilisée
console.log('🔗 API Base URL:', API_BASE_URL)

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Intercepteurs pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Ne pas afficher d'erreur pour les 404 si l'API n'est pas disponible
    if (error.response?.status === 404) {
      // Ne rien afficher dans la console pour les 404 - les erreurs sont déjà visibles dans le terminal Django
      // Les erreurs 404 sont normales si l'API backend n'est pas configurée
      return Promise.reject(error)
    } else if (error.response?.status >= 500) {
      console.error('Erreur serveur API:', error.response?.status, error.config?.url)
    } else if (error.code === 'ERR_NETWORK') {
      console.warn('⚠️ Impossible de se connecter à l\'API. Vérifiez que le backend est démarré.')
    } else {
      console.error('API Error:', error)
    }
    return Promise.reject(error)
  }
)

// Services API
export const portfolioAPI = {
  // Settings
  getSettings: () => api.get('/settings/current/'),
  
  // Skills
  getSkills: (params) => api.get('/skills/', { params }),
  getSkillCategories: () => api.get('/skill-categories/'),
  
  // Experiences
  getExperiences: (params) => api.get('/experiences/', { params }),
  
  // Projects
  getProjects: (params) => api.get('/projects/', { params }),
  getProject: (id) => api.get(`/projects/${id}/`),
  getFeaturedProjects: () => api.get('/projects/featured/'),
  getProjectCategories: () => api.get('/project-categories/'),
  getTechnologies: () => api.get('/technologies/'),
  createProject: (data) => api.post('/projects/', data),
  updateProject: (id, data) => api.put(`/projects/${id}/`, data),
  deleteProject: (id) => api.delete(`/projects/${id}/`),
  
  // Articles
  getArticles: (params) => api.get('/articles/', { params }),
  getArticle: (id) => api.get(`/articles/${id}/`),
  getFeaturedArticles: () => api.get('/articles/featured/'),
  incrementArticleViews: (id) => api.post(`/articles/${id}/increment_views/`),
  getArticleCategories: () => api.get('/article-categories/'),
  getTags: () => api.get('/tags/'),
  
  // Contact
  sendContactMessage: (data) => api.post('/contact/', data),
}

export default api

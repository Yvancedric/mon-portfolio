import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, ArrowRight } from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { portfolioAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import SEO from '../components/SEO'
import '../styles/Blog.css'

const Blog = () => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const { isFrench } = useLanguage()

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await portfolioAPI.getArticles().catch(() => ({ data: { results: [] } }))
        setArticles(response.data.results || response.data || [])
      } catch (error) {
        console.error('Error fetching articles:', error)
        setArticles([])
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [])

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString(isFrench ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  if (loading) {
    return <LoadingSpinner />
  }

  // Main articles (first 2) and sidebar articles (next 4)
  const mainArticles = articles.slice(0, 2)
  const sidebarArticles = articles.slice(2, 6)

  return (
    <>
      <SEO
        title={isFrench ? 'Blog' : 'Blog'}
        description={isFrench ? 'Articles et publications' : 'Articles and publications'}
      />

      <section className="blog-page">
        <div className="container">
          {/* Header */}
          <div className="blog-header">
            <h1 className="blog-title">
              {isFrench ? 'Nos derniers articles de blog' : 'Our Latest Blog Posts'}
            </h1>
            <Link to="/blog" className="blog-see-all-btn">
              {isFrench ? 'Voir tous les articles' : 'See All Blog Posts'}
            </Link>
          </div>

          <div className="blog-content">
            {/* Left - Main Articles (2 large cards) */}
            <div className="blog-main">
              {mainArticles.length > 0 ? (
                <div className="blog-main-grid">
                  {mainArticles.map((article) => (
                    <motion.article
                      key={article.id}
                      className="blog-main-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="blog-main-image">
                        {article.featured_image_url ? (
                          <img
                            src={article.featured_image_url}
                            alt={isFrench ? article.title_fr : article.title_en}
                          />
                        ) : (
                          <div className="blog-placeholder">
                            <span>{(isFrench ? article.title_fr : article.title_en)?.charAt(0) || 'B'}</span>
                          </div>
                        )}
                      </div>
                      <div className="blog-main-content">
                        <div className="blog-meta">
                          <span className="blog-date">
                            {formatDate(article.published_at || article.created_at)}
                          </span>
                          <span className="blog-category">
                            {article.category
                              ? isFrench
                                ? article.category.name_fr
                                : article.category.name_en
                              : 'Category'}
                          </span>
                        </div>
                        <h3 className="blog-main-title">
                          {isFrench ? article.title_fr : article.title_en}
                        </h3>
                        <p className="blog-main-excerpt">
                          {isFrench ? article.excerpt_fr : article.excerpt_en}
                        </p>
                      </div>
                    </motion.article>
                  ))}
                </div>
              ) : (
                <div className="no-articles">
                  <p>{isFrench ? 'Aucun article disponible' : 'No articles available'}</p>
                </div>
              )}
            </div>

            {/* Right - Sidebar Articles */}
            {sidebarArticles.length > 0 && (
              <div className="blog-sidebar">
                {sidebarArticles.map((article) => (
                  <motion.article
                    key={article.id}
                    className="blog-sidebar-item"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="blog-sidebar-image">
                      {article.featured_image_url ? (
                        <img
                          src={article.featured_image_url}
                          alt={isFrench ? article.title_fr : article.title_en}
                        />
                      ) : (
                        <div className="blog-sidebar-placeholder">
                          <span>{(isFrench ? article.title_fr : article.title_en)?.charAt(0) || 'A'}</span>
                        </div>
                      )}
                    </div>
                    <div className="blog-sidebar-content">
                      <div className="blog-sidebar-meta">
                        <span className="blog-date">
                          {formatDate(article.published_at || article.created_at)}
                        </span>
                        <span className="blog-category">
                          {article.category
                            ? isFrench
                              ? article.category.name_fr
                              : article.category.name_en
                            : 'Category'}
                        </span>
                      </div>
                      <h4 className="blog-sidebar-title">
                        {isFrench ? article.title_fr : article.title_en}
                      </h4>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default Blog

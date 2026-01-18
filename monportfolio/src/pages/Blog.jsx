import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
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
    const date = new Date(dateString)
    return date.toLocaleDateString(isFrench ? 'fr-FR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <>
      <SEO
        title={isFrench ? 'Blog' : 'Blog'}
        description={isFrench ? 'Articles et publications' : 'Articles and publications'}
      />

      <section className="blog section">
        <div className="container">
          <motion.div
            className="section-title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2>{isFrench ? 'Blog' : 'Blog'}</h2>
            <p>
              {isFrench
                ? 'Découvrez mes articles et publications'
                : 'Discover my articles and publications'}
            </p>
          </motion.div>

          {articles.length > 0 ? (
            <motion.div
              className="articles-grid"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {articles.map((article) => (
                <motion.article
                  key={article.id}
                  className="article-card"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  whileHover={{ y: -5 }}
                >
                  {article.featured_image_url && (
                    <div className="article-image">
                      <img
                        src={article.featured_image_url}
                        alt={isFrench ? article.title_fr : article.title_en}
                      />
                      {article.featured && (
                        <span className="article-featured">
                          {isFrench ? 'Vedette' : 'Featured'}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="article-content">
                    {article.category && (
                      <span className="article-category">
                        {isFrench ? article.category.name_fr : article.category.name_en}
                      </span>
                    )}
                    <h3>{isFrench ? article.title_fr : article.title_en}</h3>
                    <p>{isFrench ? article.excerpt_fr : article.excerpt_en}</p>
                    <div className="article-meta">
                      <span className="article-date">
                        <Calendar size={16} />
                        {formatDate(article.published_at || article.created_at)}
                      </span>
                      <span className="article-views">
                        <Clock size={16} />
                        {article.views_count} {isFrench ? 'vues' : 'views'}
                      </span>
                    </div>
                    <Link to={`/blog/${article.slug}`} className="article-link">
                      {isFrench ? 'Lire la suite' : 'Read more'}
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          ) : (
            <div className="no-articles">
              <p>{isFrench ? 'Aucun article disponible' : 'No articles available'}</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default Blog

import { useState, useEffect } from 'react'
import Navigation from './Navigation'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'
import LoadingSpinner from './LoadingSpinner'

const Layout = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simuler un chargement initial
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="app">
      <Navigation />
      <main className="main-content">
        {children}
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  )
}

export default Layout

from django.contrib.sitemaps import Sitemap
from .models import Project, Article


class StaticViewSitemap(Sitemap):
    """Sitemap pour les pages statiques (gérées par le frontend)"""
    priority = 1.0
    changefreq = 'monthly'

    def items(self):
        # Les pages statiques sont gérées par le frontend React
        # On retourne des chemins relatifs qui seront utilisés par le frontend
        return ['/', '/about', '/projects', '/contact', '/blog']

    def location(self, item):
        return item


class ProjectSitemap(Sitemap):
    """Sitemap pour les projets"""
    changefreq = 'monthly'
    priority = 0.8

    def items(self):
        return Project.objects.all()

    def lastmod(self, obj):
        return obj.updated_at


class ArticleSitemap(Sitemap):
    """Sitemap pour les articles"""
    changefreq = 'weekly'
    priority = 0.7

    def items(self):
        return Article.objects.filter(published=True)

    def lastmod(self, obj):
        return obj.updated_at
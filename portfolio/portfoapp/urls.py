from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SkillCategoryViewSet, SkillViewSet, ExperienceViewSet,
    ProjectCategoryViewSet, TechnologyViewSet, ProjectViewSet,
    ArticleCategoryViewSet, TagViewSet, ArticleViewSet,
    ContactMessageViewSet, SiteSettingsViewSet
)

router = DefaultRouter()
router.register(r'skill-categories', SkillCategoryViewSet, basename='skillcategory')
router.register(r'skills', SkillViewSet, basename='skill')
router.register(r'experiences', ExperienceViewSet, basename='experience')
router.register(r'project-categories', ProjectCategoryViewSet, basename='projectcategory')
router.register(r'technologies', TechnologyViewSet, basename='technology')
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'article-categories', ArticleCategoryViewSet, basename='articlecategory')
router.register(r'tags', TagViewSet, basename='tag')
router.register(r'articles', ArticleViewSet, basename='article')
router.register(r'contact', ContactMessageViewSet, basename='contact')
router.register(r'settings', SiteSettingsViewSet, basename='settings')

urlpatterns = [
    path('', include(router.urls)),
]
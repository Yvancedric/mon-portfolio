from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import (
    SiteSettings, Project, ProjectCategory, Technology,
    Skill, SkillCategory, Experience, Article, ArticleCategory
)


class SiteSettingsTestCase(TestCase):
    def setUp(self):
        SiteSettings.load()

    def test_site_settings_singleton(self):
        """Test que SiteSettings est un singleton"""
        settings1 = SiteSettings.load()
        settings2 = SiteSettings.load()
        self.assertEqual(settings1.pk, settings2.pk)
        self.assertEqual(SiteSettings.objects.count(), 1)


class ProjectAPITestCase(APITestCase):
    def setUp(self):
        self.category = ProjectCategory.objects.create(
            name_fr='Web',
            name_en='Web',
            slug='web'
        )
        self.technology = Technology.objects.create(
            name='React',
            icon='react',
            color='#61DAFB'
        )
        self.project = Project.objects.create(
            title_fr='Projet Test',
            title_en='Test Project',
            slug='projet-test',
            description_fr='Description test',
            description_en='Test description',
            short_description_fr='Court',
            short_description_en='Short',
            category=self.category
        )
        self.project.technologies.add(self.technology)

    def test_list_projects(self):
        """Test la liste des projets"""
        url = reverse('project-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_project_detail(self):
        """Test les détails d'un projet"""
        url = reverse('project-detail', kwargs={'pk': self.project.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title_fr'], 'Projet Test')

    def test_filter_projects_by_category(self):
        """Test le filtrage par catégorie"""
        url = reverse('project-list')
        response = self.client.get(url, {'category': self.category.id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)


class ContactMessageAPITestCase(APITestCase):
    def test_create_contact_message(self):
        """Test la création d'un message de contact"""
        url = reverse('contact-list')
        data = {
            'name': 'Test User',
            'email': 'test@example.com',
            'subject': 'Test Subject',
            'message': 'Test message',
            'honeypot': ''
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

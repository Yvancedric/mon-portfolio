from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError


class SkillCategory(models.Model):
    """Catégorie de compétence (ex: Frontend, Backend, Design)"""
    name_fr = models.CharField(_('Nom (FR)'), max_length=100)
    name_en = models.CharField(_('Nom (EN)'), max_length=100)
    icon = models.CharField(_('Icône'), max_length=50, blank=True, help_text="Nom de l'icône Lucide")
    order = models.IntegerField(_('Ordre'), default=0)
    created_at = models.DateTimeField(_('Date de création'), auto_now_add=True)

    class Meta:
        verbose_name = _('Catégorie de compétence')
        verbose_name_plural = _('Catégories de compétences')
        ordering = ['order', 'name_fr']

    def __str__(self):
        return self.name_fr


class Skill(models.Model):
    """Compétence technique ou soft skill"""
    SKILL_TYPE_CHOICES = [
        ('technical', _('Technique')),
        ('soft', _('Soft Skill')),
    ]
    
    name = models.CharField(_('Nom'), max_length=100)
    category = models.ForeignKey(SkillCategory, on_delete=models.CASCADE, related_name='skills', null=True, blank=True)
    skill_type = models.CharField(_('Type'), max_length=20, choices=SKILL_TYPE_CHOICES, default='technical')
    level = models.IntegerField(_('Niveau'), default=5, help_text="Niveau de 1 à 10")
    icon = models.CharField(_('Icône'), max_length=50, blank=True, help_text="Nom de l'icône Lucide")
    order = models.IntegerField(_('Ordre'), default=0)
    created_at = models.DateTimeField(_('Date de création'), auto_now_add=True)

    class Meta:
        verbose_name = _('Compétence')
        verbose_name_plural = _('Compétences')
        ordering = ['category', 'order', 'name']

    def __str__(self):
        return self.name


class Experience(models.Model):
    """Expérience professionnelle ou académique"""
    EXPERIENCE_TYPE_CHOICES = [
        ('professional', _('Professionnelle')),
        ('academic', _('Académique')),
    ]
    
    title_fr = models.CharField(_('Titre (FR)'), max_length=200)
    title_en = models.CharField(_('Titre (EN)'), max_length=200)
    company_fr = models.CharField(_('Entreprise/École (FR)'), max_length=200)
    company_en = models.CharField(_('Entreprise/École (EN)'), max_length=200)
    description_fr = models.TextField(_('Description (FR)'), blank=True)
    description_en = models.TextField(_('Description (EN)'), blank=True)
    experience_type = models.CharField(_('Type'), max_length=20, choices=EXPERIENCE_TYPE_CHOICES, default='professional')
    start_date = models.DateField(_('Date de début'))
    end_date = models.DateField(_('Date de fin'), null=True, blank=True, help_text="Laisser vide si en cours")
    location_fr = models.CharField(_('Lieu (FR)'), max_length=200, blank=True)
    location_en = models.CharField(_('Lieu (EN)'), max_length=200, blank=True)
    order = models.IntegerField(_('Ordre'), default=0)
    created_at = models.DateTimeField(_('Date de création'), auto_now_add=True)

    class Meta:
        verbose_name = _('Expérience')
        verbose_name_plural = _('Expériences')
        ordering = ['-start_date', '-order']

    def __str__(self):
        return f"{self.title_fr} - {self.company_fr}"

    @property
    def is_current(self):
        return self.end_date is None


class ProjectCategory(models.Model):
    """Catégorie de projet"""
    name_fr = models.CharField(_('Nom (FR)'), max_length=100)
    name_en = models.CharField(_('Nom (EN)'), max_length=100)
    slug = models.SlugField(_('Slug'), unique=True)
    color = models.CharField(_('Couleur'), max_length=7, default='#4e598c', help_text="Code couleur hexadécimal")
    order = models.IntegerField(_('Ordre'), default=0)
    created_at = models.DateTimeField(_('Date de création'), auto_now_add=True)

    class Meta:
        verbose_name = _('Catégorie de projet')
        verbose_name_plural = _('Catégories de projets')
        ordering = ['order', 'name_fr']

    def __str__(self):
        return self.name_fr


class Technology(models.Model):
    """Technologie utilisée dans les projets"""
    name = models.CharField(_('Nom'), max_length=100, unique=True)
    icon = models.CharField(_('Icône'), max_length=50, blank=True, help_text="Nom de l'icône Lucide")
    color = models.CharField(_('Couleur'), max_length=7, default='#4e598c', help_text="Code couleur hexadécimal")
    created_at = models.DateTimeField(_('Date de création'), auto_now_add=True)

    class Meta:
        verbose_name = _('Technologie')
        verbose_name_plural = _('Technologies')
        ordering = ['name']

    def __str__(self):
        return self.name


class Project(models.Model):
    """Projet portfolio"""
    title_fr = models.CharField(_('Titre (FR)'), max_length=200)
    title_en = models.CharField(_('Titre (EN)'), max_length=200)
    slug = models.SlugField(_('Slug'), unique=True)
    description_fr = models.TextField(_('Description (FR)'))
    description_en = models.TextField(_('Description (EN)'))
    short_description_fr = models.CharField(_('Description courte (FR)'), max_length=300)
    short_description_en = models.CharField(_('Description courte (EN)'), max_length=300)
    image = models.ImageField(_('Image principale'), upload_to='projects/', blank=True, null=True)
    video_url = models.URLField(_('URL vidéo'), blank=True, help_text="URL YouTube, Vimeo, etc.")
    gif = models.ImageField(_('GIF'), upload_to='projects/gifs/', blank=True, null=True)
    category = models.ForeignKey(ProjectCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='projects')
    technologies = models.ManyToManyField(Technology, related_name='projects', blank=True)
    github_url = models.URLField(_('URL GitHub'), blank=True)
    demo_url = models.URLField(_('URL démo'), blank=True)
    featured = models.BooleanField(_('Projet vedette'), default=False)
    order = models.IntegerField(_('Ordre'), default=0)
    created_at = models.DateTimeField(_('Date de création'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Date de mise à jour'), auto_now=True)

    class Meta:
        verbose_name = _('Projet')
        verbose_name_plural = _('Projets')
        ordering = ['-featured', '-order', '-created_at']

    def __str__(self):
        return self.title_fr

    def clean(self):
        if not self.github_url and not self.demo_url:
            raise ValidationError(_('Au moins une URL (GitHub ou démo) doit être fournie.'))


class ArticleCategory(models.Model):
    """Catégorie d'article de blog"""
    name_fr = models.CharField(_('Nom (FR)'), max_length=100)
    name_en = models.CharField(_('Nom (EN)'), max_length=100)
    slug = models.SlugField(_('Slug'), unique=True)
    description_fr = models.TextField(_('Description (FR)'), blank=True)
    description_en = models.TextField(_('Description (EN)'), blank=True)
    created_at = models.DateTimeField(_('Date de création'), auto_now_add=True)

    class Meta:
        verbose_name = _('Catégorie d\'article')
        verbose_name_plural = _('Catégories d\'articles')
        ordering = ['name_fr']

    def __str__(self):
        return self.name_fr


class Tag(models.Model):
    """Tag pour les articles"""
    name = models.CharField(_('Nom'), max_length=50, unique=True)
    slug = models.SlugField(_('Slug'), unique=True)
    created_at = models.DateTimeField(_('Date de création'), auto_now_add=True)

    class Meta:
        verbose_name = _('Tag')
        verbose_name_plural = _('Tags')
        ordering = ['name']

    def __str__(self):
        return self.name


class Article(models.Model):
    """Article de blog"""
    title_fr = models.CharField(_('Titre (FR)'), max_length=200)
    title_en = models.CharField(_('Titre (EN)'), max_length=200)
    slug = models.SlugField(_('Slug'), unique=True)
    excerpt_fr = models.TextField(_('Extrait (FR)'), max_length=500)
    excerpt_en = models.TextField(_('Extrait (EN)'), max_length=500)
    content_fr = models.TextField(_('Contenu (FR)'))
    content_en = models.TextField(_('Contenu (EN)'))
    featured_image = models.ImageField(_('Image vedette'), upload_to='articles/', blank=True, null=True)
    category = models.ForeignKey(ArticleCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='articles')
    tags = models.ManyToManyField(Tag, related_name='articles', blank=True)
    author = models.CharField(_('Auteur'), max_length=100, default='Portfolio Owner')
    published = models.BooleanField(_('Publié'), default=False)
    featured = models.BooleanField(_('Article vedette'), default=False)
    views_count = models.IntegerField(_('Nombre de vues'), default=0)
    created_at = models.DateTimeField(_('Date de création'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Date de mise à jour'), auto_now=True)
    published_at = models.DateTimeField(_('Date de publication'), null=True, blank=True)

    class Meta:
        verbose_name = _('Article')
        verbose_name_plural = _('Articles')
        ordering = ['-published_at', '-created_at']

    def __str__(self):
        return self.title_fr


class ContactMessage(models.Model):
    """Message de contact"""
    STATUS_CHOICES = [
        ('new', _('Nouveau')),
        ('read', _('Lu')),
        ('replied', _('Répondu')),
        ('archived', _('Archivé')),
    ]
    
    name = models.CharField(_('Nom'), max_length=100)
    email = models.EmailField(_('Email'))
    subject = models.CharField(_('Objet'), max_length=200)
    message = models.TextField(_('Message'))
    status = models.CharField(_('Statut'), max_length=20, choices=STATUS_CHOICES, default='new')
    ip_address = models.GenericIPAddressField(_('Adresse IP'), null=True, blank=True)
    user_agent = models.TextField(_('User Agent'), blank=True)
    created_at = models.DateTimeField(_('Date de création'), auto_now_add=True)
    replied_at = models.DateTimeField(_('Date de réponse'), null=True, blank=True)

    class Meta:
        verbose_name = _('Message de contact')
        verbose_name_plural = _('Messages de contact')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.subject}"


class SiteSettings(models.Model):
    """Paramètres du site (singleton)"""
    site_name_fr = models.CharField(_('Nom du site (FR)'), max_length=200, default='Mon Portfolio')
    site_name_en = models.CharField(_('Nom du site (EN)'), max_length=200, default='My Portfolio')
    site_description_fr = models.TextField(_('Description du site (FR)'), blank=True)
    site_description_en = models.TextField(_('Description du site (EN)'), blank=True)
    owner_name = models.CharField(_('Nom du propriétaire'), max_length=200)
    owner_title_fr = models.CharField(_('Titre professionnel (FR)'), max_length=200)
    owner_title_en = models.CharField(_('Titre professionnel (EN)'), max_length=200)
    owner_bio_fr = models.TextField(_('Biographie (FR)'))
    owner_bio_en = models.TextField(_('Biographie (EN)'))
    owner_photo = models.ImageField(_('Photo'), upload_to='profile/', blank=True, null=True)
    owner_email = models.EmailField(_('Email'))
    owner_phone = models.CharField(_('Téléphone'), max_length=20, blank=True)
    owner_location_fr = models.CharField(_('Localisation (FR)'), max_length=200, blank=True)
    owner_location_en = models.CharField(_('Localisation (EN)'), max_length=200, blank=True)
    cv_file = models.FileField(_('Fichier CV'), upload_to='cv/', blank=True, null=True)
    
    # Réseaux sociaux
    github_url = models.URLField(_('URL GitHub'), blank=True)
    linkedin_url = models.URLField(_('URL LinkedIn'), blank=True)
    twitter_url = models.URLField(_('URL Twitter'), blank=True)
    instagram_url = models.URLField(_('URL Instagram'), blank=True)
    portfolio_url = models.URLField(_('URL Portfolio'), blank=True)
    
    # SEO
    meta_keywords_fr = models.CharField(_('Mots-clés SEO (FR)'), max_length=500, blank=True)
    meta_keywords_en = models.CharField(_('Mots-clés SEO (EN)'), max_length=500, blank=True)
    google_analytics_id = models.CharField(_('ID Google Analytics'), max_length=50, blank=True)
    
    updated_at = models.DateTimeField(_('Date de mise à jour'), auto_now=True)

    class Meta:
        verbose_name = _('Paramètres du site')
        verbose_name_plural = _('Paramètres du site')

    def __str__(self):
        return f"Paramètres - {self.owner_name}"

    def save(self, *args, **kwargs):
    # S'assurer qu'il n'y a qu'une seule instance
        if not self.pk:
            # Si c'est une nouvelle instance, vérifier s'il en existe déjà une
            existing = SiteSettings.objects.first()
            if existing:
                self.pk = existing.pk
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, created = cls.objects.get_or_create(pk=1, defaults={
            'owner_name': 'Votre Nom',
            'owner_title_fr': 'Développeur',
            'owner_title_en': 'Developer',
            'owner_bio_fr': 'Biographie en français',
            'owner_bio_en': 'Biography in English',
            'owner_email': 'email@example.com',
        })
        return obj


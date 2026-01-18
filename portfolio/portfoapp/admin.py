from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from .models import (
    SkillCategory, Skill, Experience, ProjectCategory, Technology,
    Project, ArticleCategory, Tag, Article, ContactMessage, SiteSettings
)


@admin.register(SkillCategory)
class SkillCategoryAdmin(admin.ModelAdmin):
    list_display = ['name_fr', 'name_en', 'icon', 'order']
    list_editable = ['order']
    search_fields = ['name_fr', 'name_en']


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'skill_type', 'level', 'order']
    list_filter = ['skill_type', 'category']
    list_editable = ['level', 'order']
    search_fields = ['name']


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ['title_fr', 'company_fr', 'experience_type', 'start_date', 'end_date', 'is_current']
    list_filter = ['experience_type', 'start_date']
    search_fields = ['title_fr', 'title_en', 'company_fr', 'company_en']
    date_hierarchy = 'start_date'


@admin.register(ProjectCategory)
class ProjectCategoryAdmin(admin.ModelAdmin):
    list_display = ['name_fr', 'name_en', 'slug', 'color', 'order']
    list_editable = ['order']
    prepopulated_fields = {'slug': ('name_fr',)}


@admin.register(Technology)
class TechnologyAdmin(admin.ModelAdmin):
    list_display = ['name', 'icon', 'color']
    search_fields = ['name']


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title_fr', 'category', 'featured', 'order', 'created_at']
    list_filter = ['category', 'featured', 'technologies', 'created_at']
    list_editable = ['featured', 'order']
    search_fields = ['title_fr', 'title_en', 'description_fr', 'description_en']
    prepopulated_fields = {'slug': ('title_fr',)}
    filter_horizontal = ['technologies']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        (_('Informations générales'), {
            'fields': ('title_fr', 'title_en', 'slug', 'category', 'featured', 'order')
        }),
        (_('Descriptions'), {
            'fields': ('short_description_fr', 'short_description_en', 'description_fr', 'description_en')
        }),
        (_('Médias'), {
            'fields': ('image', 'video_url', 'gif')
        }),
        (_('Technologies et liens'), {
            'fields': ('technologies', 'github_url', 'demo_url')
        }),
        (_('Dates'), {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(ArticleCategory)
class ArticleCategoryAdmin(admin.ModelAdmin):
    list_display = ['name_fr', 'name_en', 'slug']
    prepopulated_fields = {'slug': ('name_fr',)}


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ['title_fr', 'category', 'published', 'featured', 'views_count', 'published_at']
    list_filter = ['category', 'published', 'featured', 'tags', 'created_at']
    list_editable = ['published', 'featured']
    search_fields = ['title_fr', 'title_en', 'content_fr', 'content_en']
    prepopulated_fields = {'slug': ('title_fr',)}
    filter_horizontal = ['tags']
    readonly_fields = ['created_at', 'updated_at', 'views_count']
    fieldsets = (
        (_('Informations générales'), {
            'fields': ('title_fr', 'title_en', 'slug', 'category', 'tags', 'author', 'featured', 'published')
        }),
        (_('Contenu'), {
            'fields': ('excerpt_fr', 'excerpt_en', 'content_fr', 'content_en', 'featured_image')
        }),
        (_('Statistiques'), {
            'fields': ('views_count', 'published_at')
        }),
        (_('Dates'), {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'status', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['name', 'email', 'subject', 'message']
    readonly_fields = ['created_at', 'ip_address', 'user_agent']
    date_hierarchy = 'created_at'
    actions = ['mark_as_read', 'mark_as_replied', 'mark_as_archived']

    def mark_as_read(self, request, queryset):
        queryset.update(status='read')
    mark_as_read.short_description = _('Marquer comme lu')

    def mark_as_replied(self, request, queryset):
        queryset.update(status='replied', replied_at=timezone.now())
    mark_as_replied.short_description = _('Marquer comme répondu')

    def mark_as_archived(self, request, queryset):
        queryset.update(status='archived')
    mark_as_archived.short_description = _('Archiver')



@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    fieldsets = (
        (_('Informations générales'), {
            'fields': ('site_name_fr', 'site_name_en', 'site_description_fr', 'site_description_en')
        }),
        (_('Propriétaire'), {
            'fields': ('owner_name', 'owner_title_fr', 'owner_title_en', 'owner_bio_fr', 'owner_bio_en', 'owner_photo')
        }),
        (_('Contact'), {
            'fields': ('owner_email', 'owner_phone', 'owner_location_fr', 'owner_location_en', 'cv_file')
        }),
        (_('Réseaux sociaux'), {
            'fields': ('github_url', 'linkedin_url', 'twitter_url', 'instagram_url', 'portfolio_url')
        }),
        (_('SEO et Analytics'), {
            'fields': ('meta_keywords_fr', 'meta_keywords_en', 'google_analytics_id')
        }),
    )

    def has_add_permission(self, request):
        # Ne permettre qu'une seule instance
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False
    
    def changelist_view(self, request, extra_context=None):
        # Rediriger vers la page d'édition de l'unique instance
        obj = SiteSettings.load()
        return self.change_view(request, str(obj.pk))


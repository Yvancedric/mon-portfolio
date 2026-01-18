from rest_framework import serializers
from .models import (
    SkillCategory, Skill, Experience, ProjectCategory, Technology,
    Project, ArticleCategory, Tag, Article, ContactMessage, SiteSettings
)


class SkillCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillCategory
        fields = ['id', 'name_fr', 'name_en', 'icon', 'order']


class SkillSerializer(serializers.ModelSerializer):
    category = SkillCategorySerializer(read_only=True)
    
    class Meta:
        model = Skill
        fields = ['id', 'name', 'category', 'skill_type', 'level', 'icon', 'order']


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = [
            'id', 'title_fr', 'title_en', 'company_fr', 'company_en',
            'description_fr', 'description_en', 'experience_type',
            'start_date', 'end_date', 'location_fr', 'location_en',
            'order', 'is_current'
        ]


class TechnologySerializer(serializers.ModelSerializer):
    class Meta:
        model = Technology
        fields = ['id', 'name', 'icon', 'color']


class ProjectCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectCategory
        fields = ['id', 'name_fr', 'name_en', 'slug', 'color', 'order']


class ProjectSerializer(serializers.ModelSerializer):
    category = ProjectCategorySerializer(read_only=True)
    technologies = TechnologySerializer(many=True, read_only=True)
    image_url = serializers.SerializerMethodField()
    gif_url = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'title_fr', 'title_en', 'slug', 'description_fr', 'description_en',
            'short_description_fr', 'short_description_en', 'image', 'image_url',
            'video_url', 'gif', 'gif_url', 'category', 'technologies',
            'github_url', 'demo_url', 'featured', 'order', 'created_at', 'updated_at'
        ]

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

    def get_gif_url(self, obj):
        if obj.gif:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.gif.url)
            return obj.gif.url
        return None


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name', 'slug']


class ArticleCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleCategory
        fields = ['id', 'name_fr', 'name_en', 'slug', 'description_fr', 'description_en']


class ArticleSerializer(serializers.ModelSerializer):
    category = ArticleCategorySerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    featured_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = [
            'id', 'title_fr', 'title_en', 'slug', 'excerpt_fr', 'excerpt_en',
            'content_fr', 'content_en', 'featured_image', 'featured_image_url',
            'category', 'tags', 'author', 'published', 'featured',
            'views_count', 'created_at', 'updated_at', 'published_at'
        ]

    def get_featured_image_url(self, obj):
        if obj.featured_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.featured_image.url)
            return obj.featured_image.url
        return None


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'subject', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']


class ContactMessageCreateSerializer(serializers.ModelSerializer):
    recaptcha_token = serializers.CharField(write_only=True, required=False)
    honeypot = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'subject', 'message', 'recaptcha_token', 'honeypot']

    def validate_honeypot(self, value):
        # Honeypot anti-spam : si rempli, c'est un bot
        if value:
            raise serializers.ValidationError("Spam détecté")
        return value


class SiteSettingsSerializer(serializers.ModelSerializer):
    owner_photo_url = serializers.SerializerMethodField()
    cv_file_url = serializers.SerializerMethodField()

    class Meta:
        model = SiteSettings
        fields = [
            'site_name_fr', 'site_name_en', 'site_description_fr', 'site_description_en',
            'owner_name', 'owner_title_fr', 'owner_title_en', 'owner_bio_fr', 'owner_bio_en',
            'owner_photo', 'owner_photo_url', 'owner_email', 'owner_phone',
            'owner_location_fr', 'owner_location_en', 'cv_file', 'cv_file_url',
            'github_url', 'linkedin_url', 'twitter_url', 'instagram_url', 'portfolio_url',
            'meta_keywords_fr', 'meta_keywords_en', 'google_analytics_id'
        ]

    def get_owner_photo_url(self, obj):
        if obj.owner_photo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.owner_photo.url)
            return obj.owner_photo.url
        return None

    def get_cv_file_url(self, obj):
        if obj.cv_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.cv_file.url)
            return obj.cv_file.url
        return None

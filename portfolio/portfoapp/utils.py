"""
Utilitaires pour l'application portfolio
"""
import json
from django.http import JsonResponse
from django.core.serializers.json import DjangoJSONEncoder


def generate_structured_data(request):
    """
    Génère les données structurées JSON-LD pour le SEO
    """
    from .models import SiteSettings
    
    settings = SiteSettings.load()
    
    # Person schema
    person_schema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": settings.owner_name,
        "jobTitle": settings.owner_title_fr,
        "email": settings.owner_email,
        "url": request.build_absolute_uri('/'),
    }
    
    if settings.owner_photo:
        person_schema["image"] = request.build_absolute_uri(settings.owner_photo.url)
    
    if settings.linkedin_url:
        person_schema["sameAs"] = [settings.linkedin_url]
        if settings.github_url:
            person_schema["sameAs"].append(settings.github_url)
    
    # Website schema
    website_schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": settings.site_name_fr,
        "url": request.build_absolute_uri('/'),
        "description": settings.site_description_fr,
    }
    
    return [person_schema, website_schema]

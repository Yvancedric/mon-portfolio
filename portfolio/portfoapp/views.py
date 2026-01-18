from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.utils import timezone
from django.conf import settings
from django.core.mail import send_mail
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import requests

from .models import (
    SkillCategory, Skill, Experience, ProjectCategory, Technology,
    Project, ArticleCategory, Tag, Article, ContactMessage, SiteSettings
)
from .serializers import (
    SkillCategorySerializer, SkillSerializer, ExperienceSerializer,
    ProjectCategorySerializer, TechnologySerializer, ProjectSerializer,
    ArticleCategorySerializer, TagSerializer, ArticleSerializer,
    ContactMessageCreateSerializer, ContactMessageSerializer, SiteSettingsSerializer
)


class SkillCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SkillCategory.objects.all()
    serializer_class = SkillCategorySerializer
    permission_classes = [AllowAny]


class SkillViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [AllowAny]
    filterset_fields = ['skill_type', 'category']


class ExperienceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    permission_classes = [AllowAny]
    filterset_fields = ['experience_type']


class ProjectCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProjectCategory.objects.all()
    serializer_class = ProjectCategorySerializer
    permission_classes = [AllowAny]


class TechnologyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Technology.objects.all()
    serializer_class = TechnologySerializer
    permission_classes = [AllowAny]


class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]
    filterset_fields = ['category', 'featured', 'technologies']
    search_fields = ['title_fr', 'title_en', 'description_fr', 'description_en']
    ordering_fields = ['created_at', 'order', 'title_fr']
    ordering = ['-featured', '-order', '-created_at']

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Retourne uniquement les projets vedettes"""
        featured_projects = self.queryset.filter(featured=True)
        serializer = self.get_serializer(featured_projects, many=True)
        return Response(serializer.data)


class ArticleCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ArticleCategory.objects.all()
    serializer_class = ArticleCategorySerializer
    permission_classes = [AllowAny]


class TagViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [AllowAny]


class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Article.objects.filter(published=True)
    serializer_class = ArticleSerializer
    permission_classes = [AllowAny]
    filterset_fields = ['category', 'featured', 'tags']
    search_fields = ['title_fr', 'title_en', 'content_fr', 'content_en', 'excerpt_fr', 'excerpt_en']
    ordering_fields = ['published_at', 'created_at', 'views_count']
    ordering = ['-published_at', '-created_at']

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @action(detail=True, methods=['post'])
    def increment_views(self, request, pk=None):
        """Incrémente le compteur de vues"""
        article = self.get_object()
        article.views_count += 1
        article.save()
        return Response({'views_count': article.views_count})

    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Retourne uniquement les articles vedettes"""
        featured_articles = self.queryset.filter(featured=True)
        serializer = self.get_serializer(featured_articles, many=True)
        return Response(serializer.data)


class ContactMessageViewSet(viewsets.ModelViewSet):
    queryset = ContactMessage.objects.all()
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action == 'create':
            return ContactMessageCreateSerializer
        return ContactMessageSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Vérification reCAPTCHA si configuré
        recaptcha_token = serializer.validated_data.pop('recaptcha_token', None)
        if settings.RECAPTCHA_SECRET_KEY and recaptcha_token:
            recaptcha_response = requests.post(
                'https://www.google.com/recaptcha/api/siteverify',
                data={
                    'secret': settings.RECAPTCHA_SECRET_KEY,
                    'response': recaptcha_token
                }
            )
            recaptcha_data = recaptcha_response.json()
            if not recaptcha_data.get('success'):
                return Response(
                    {'error': 'Échec de la vérification reCAPTCHA'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Récupération des informations de la requête
        ip_address = self.get_client_ip(request)
        user_agent = request.META.get('HTTP_USER_AGENT', '')

        # Création du message
        message = ContactMessage.objects.create(
            name=serializer.validated_data['name'],
            email=serializer.validated_data['email'],
            subject=serializer.validated_data['subject'],
            message=serializer.validated_data['message'],
            ip_address=ip_address,
            user_agent=user_agent
        )

        # Envoi de l'email de notification
        email_sent = False
        email_error = None
        
        try:
            site_settings = SiteSettings.load()
            
            # Vérifier que l'email du propriétaire est défini
            if not site_settings.owner_email or site_settings.owner_email == 'email@example.com':
                email_error = "L'email du propriétaire n'est pas configuré dans SiteSettings"
                print(f"⚠️ ATTENTION: {email_error}")
                print(f"⚠️ Allez dans /admin/portfoapp/sitesettings/ pour le définir.")
            elif not settings.EMAIL_HOST_USER:
                email_error = "EMAIL_HOST_USER n'est pas configuré dans .env"
                print(f"⚠️ ATTENTION: {email_error}")
            elif not settings.EMAIL_HOST_PASSWORD:
                email_error = "EMAIL_HOST_PASSWORD n'est pas configuré dans .env"
                print(f"⚠️ ATTENTION: {email_error}")
            else:
                print(f"\n{'='*60}")
                print(f"📧 TENTATIVE D'ENVOI D'EMAIL")
                print(f"{'='*60}")
                print(f"📧 Destinataire: {site_settings.owner_email}")
                print(f"📧 Expéditeur: {settings.EMAIL_HOST_USER}")
                print(f"📧 Serveur SMTP: {settings.EMAIL_HOST}:{settings.EMAIL_PORT}")
                print(f"📧 TLS: {settings.EMAIL_USE_TLS}")
                print(f"📧 Backend: {settings.EMAIL_BACKEND}")
                print(f"{'='*60}\n")
                
                send_mail(
                    subject=f'[Portfolio] Nouveau message: {message.subject}',
                    message=f'''
Nouveau message de contact reçu:

Nom: {message.name}
Email: {message.email}
Objet: {message.subject}

Message:
{message.message}

---
Date: {message.created_at}
IP: {ip_address}
                    ''',
                    from_email=settings.EMAIL_HOST_USER or settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[site_settings.owner_email],
                    fail_silently=False,
                )
                email_sent = True
                print(f"\n{'='*60}")
                print(f"✅ EMAIL ENVOYÉ AVEC SUCCÈS")
                print(f"✅ Destinataire: {site_settings.owner_email}")
                print(f"{'='*60}\n")
        except Exception as e:
            # Log l'erreur mais ne bloque pas la création du message
            import traceback
            email_error = str(e)
            print(f"\n{'='*60}")
            print(f"❌ ERREUR LORS DE L'ENVOI DE L'EMAIL")
            print(f"{'='*60}")
            print(f"❌ Erreur: {e}")
            print(f"❌ Type: {type(e).__name__}")
            print(f"\n❌ Détails complets:")
            print(f"{traceback.format_exc()}")
            print(f"{'='*60}\n")
        
        # Avertir dans les logs si l'email n'a pas été envoyé
        if not email_sent:
            print(f"\n⚠️ Le message de contact a été enregistré mais l'email n'a pas été envoyé.")
            if email_error:
                print(f"⚠️ Raison: {email_error}\n")

        return Response(
            {'message': 'Votre message a été envoyé avec succès!'},
            status=status.HTTP_201_CREATED
        )

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

    def list(self, request, *args, **kwargs):
        # Seuls les admins peuvent voir la liste des messages
        if not request.user.is_staff:
            return Response(
                {'error': 'Permission refusée'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        # Seuls les admins peuvent voir les détails
        if not request.user.is_staff:
            return Response(
                {'error': 'Permission refusée'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().retrieve(request, *args, **kwargs)


class SiteSettingsViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SiteSettings.objects.all()
    serializer_class = SiteSettingsSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        # Retourne toujours l'instance unique
        return SiteSettings.objects.filter(pk=1)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @action(detail=False, methods=['get'])
    def current(self, request):
        """Retourne les paramètres actuels du site"""
        settings_obj = SiteSettings.load()
        serializer = self.get_serializer(settings_obj)
        return Response(serializer.data)


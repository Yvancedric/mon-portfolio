# Portfolio Backend - Django REST API

Backend Django REST Framework pour le portfolio.

## Installation

1. Créer un environnement virtuel :
```bash
python -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate
```

2. Installer les dépendances :
```bash
pip install -r requirements.txt
```

3. Copier le fichier `.env.example` vers `.env` et configurer :
```bash
cp .env.example .env
```

4. Effectuer les migrations :
```bash
python manage.py makemigrations
python manage.py migrate
```

5. Créer un superutilisateur :
```bash
python manage.py createsuperuser
```

6. Charger les données initiales (optionnel) :
```bash
python manage.py loaddata initial_data.json
```

## Démarrage

```bash
python manage.py runserver
```

Le serveur sera accessible sur `http://localhost:8000`

## API Endpoints

- `/portfolio/settings/` - Paramètres du site
- `/portfolio/skill-categories/` - Catégories de compétences
- `/portfolio/skills/` - Compétences
- `/portfolio/experiences/` - Expériences professionnelles/académiques
- `/portfolio/project-categories/` - Catégories de projets
- `/portfolio/technologies/` - Technologies
- `/portfolio/projects/` - Projets
- `/portfolio/article-categories/` - Catégories d'articles
- `/portfolio/tags/` - Tags
- `/portfolio/articles/` - Articles de blog
- `/portfolio/contact/` - Messages de contact (POST uniquement pour les visiteurs)

## Administration

Accéder à l'interface d'administration Django sur `/admin/`

## Configuration

Tous les paramètres sont dans `portfolio_backend/settings.py` et peuvent être surchargés via le fichier `.env`.

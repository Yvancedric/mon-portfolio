"""
Configuration Gunicorn pour le déploiement
"""
import multiprocessing

# Nombre de workers
workers = multiprocessing.cpu_count() * 2 + 1

# Bind
bind = "0.0.0.0:8000"

# Worker class
worker_class = "sync"

# Timeout
timeout = 30

# Logging
accesslog = "-"
errorlog = "-"
loglevel = "info"

# Process naming
proc_name = "portfoapp"

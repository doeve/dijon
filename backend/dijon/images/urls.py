from django.urls import path
from . import views

urlpatterns = [
    path('images/<path:image_name>', views.serve_image),
]
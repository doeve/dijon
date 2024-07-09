from django.urls import path
from . import views

urlpatterns = [
    path('images/<path:image_name>', views.serve_image),
    path('image-names', views.get_image_names),
]
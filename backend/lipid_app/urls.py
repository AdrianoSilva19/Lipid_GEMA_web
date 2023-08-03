from django.urls import path
from . import views

urlpatterns = [
    path("", views.getRoutes, name="routes"),
    path("generics/", views.getGenerics, name="generics"),
    path("generics/<int:pk>/", views.getGeneric, name="generic"),
]

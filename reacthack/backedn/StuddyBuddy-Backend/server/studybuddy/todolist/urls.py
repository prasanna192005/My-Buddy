from django.urls import path, include
from . import views
from django.contrib import admin




urlpatterns = [
    path('', views.index, name='index'),
    path('assignments/<int:year>-<int:month>-<int:day>/', views.assignments, name='assignments'),
    path('selfstudy/<int:year>-<int:month>-<int:day>/', views.selfstudy, name='selfstudy'),
    path('create_assignments/', views.create_assignments, name='create_assignments'),
    path('create_selfstudy/', views.create_selfstudy, name='create_selfstudy'),
    path('complete_selfstudy/<uuid:uuid>/', views.complete_selfstudy, name='complete_selfstudy'),
    path('complete_assignments/<uuid:uuid>/', views.complete_assignments, name='complete_assignments'),
    path('delete_assignments/<uuid:uuid>/', views.delete_assignments, name='delete_assignments'),
    path('delete_selfstudy/<uuid:uuid>/', views.delete_selfstudy, name='delete_selfstudy'),
]

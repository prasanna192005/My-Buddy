# resources/urls.py
from django.urls import path
from .views import resource_list

urlpatterns = [
    path('resources/', resource_list, name='resource-list'),
]

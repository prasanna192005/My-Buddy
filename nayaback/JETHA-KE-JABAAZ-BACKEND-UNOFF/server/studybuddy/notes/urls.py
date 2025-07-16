from django.urls import path
from . import views

app_name = 'notes'

urlpatterns = [
    path('', views.note_list, name="note_list"),
    path('<uuid:pk>/', views.note_detail, name="note_details"),
    path('create/', views.note_create, name="note_create"),
    path('<uuid:pk>/share/', views.note_share, name="note_share"),
    path('<uuid:pk>/update/', views.note_update, name="note_update"),
    path('<uuid:pk>/delete/', views.note_delete, name="note_delete"),
]

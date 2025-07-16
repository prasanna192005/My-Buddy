from django.urls import path
from .views import upload_pdfs, ask_question, chat

urlpatterns = [
    path('upload_pdfs/', upload_pdfs, name='upload_pdfs'),
    path('ask_question/', ask_question, name='ask_question'),
    path('chat/', chat, name='chat'),
]
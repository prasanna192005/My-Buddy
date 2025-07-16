from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import ChatMessage

@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('user', 'emotion', 'timestamp')
    search_fields = ('user__username', 'emotion')
    list_filter = ('emotion', 'timestamp')

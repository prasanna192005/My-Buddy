# resources/admin.py
from django.contrib import admin
from .models import Resource

@admin.register(Resource)
class ResourceAdmin(admin.ModelAdmin):
    list_display = ['title', 'chapter', 'resource_type', 'url', 'pdf_file']
    search_fields = ['title', 'chapter__name', 'url']
    fields = ['title', 'chapter', 'resource_type', 'url', 'pdf_file']
    readonly_fields = []  # Add fields to readonly if needed
    
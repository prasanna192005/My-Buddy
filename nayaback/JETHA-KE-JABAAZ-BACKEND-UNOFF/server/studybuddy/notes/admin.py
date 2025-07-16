from django.contrib import admin
from .models import Note, NoteImage, NoteDocument

class NoteImageInline(admin.TabularInline):
    model = NoteImage
    extra = 1

class NoteDocumentInline(admin.TabularInline):
    model = NoteDocument
    extra = 1

@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ['title', 'created_by', 'last_modified_by']
    search_fields = ['title', 'content', 'created_by__username', 'last_modified_by__username']
    inlines = [NoteImageInline, NoteDocumentInline]

@admin.register(NoteImage)
class NoteImageAdmin(admin.ModelAdmin):
    list_display = ['note', 'image']
    search_fields = ['note__title']

@admin.register(NoteDocument)
class NoteDocumentAdmin(admin.ModelAdmin):
    list_display = ['note', 'document']
    search_fields = ['note__title']

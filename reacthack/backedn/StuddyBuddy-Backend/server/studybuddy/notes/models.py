from django.db import models
from authentication.models import User
import uuid

class Note(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=100)
    content = models.TextField(blank=True, null=True)  # Text content
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_notes')
    shared_with = models.ManyToManyField(User, related_name='shared_notes', blank=True)
    last_modified_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='modified_notes')
    rich_text_content = models.TextField(blank=True, null=True)  # Rich text content
    drawing = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.title

class NoteImage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    note = models.ForeignKey(Note, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='notes/images/')

    def __str__(self):
        return f"Image for {self.note.title}"

class NoteDocument(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    note = models.ForeignKey(Note, on_delete=models.CASCADE, related_name='documents')
    document = models.FileField(upload_to='notes/documents/')

    def __str__(self):
        return f"Document for {self.note.title}"

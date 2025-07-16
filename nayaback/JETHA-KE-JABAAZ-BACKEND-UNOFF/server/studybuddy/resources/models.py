# resources/models.py
from django.db import models
from authentication.models import User
from testseries.models import Chapter  # Adjust import based on your project structure

class Resource(models.Model):
    RESOURCE_TYPE_CHOICES = [
        ('pdf', 'PDF'),
        ('youtube', 'YouTube Link'),
        ('website', 'Website Link'),
    ]
    
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    url = models.URLField(blank=True, null=True)  # Optional URL field
    pdf_file = models.FileField(upload_to='resources/pdf/', blank=True, null=True)  # Field for PDF file
    resource_type = models.CharField(max_length=10, choices=RESOURCE_TYPE_CHOICES)

    def __str__(self):
        return self.title

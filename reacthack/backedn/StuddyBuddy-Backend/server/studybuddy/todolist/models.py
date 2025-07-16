from django.db import models
from authentication.models import User
import uuid

class Selfstudy(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    subject = models.CharField(max_length=255,null=True)    
     
    deadline = models.DateTimeField(null=True, blank=True)
    completed = models.BooleanField(default=False)
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    def __str__(self):
        return self.name

class Assignment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    subject = models.CharField(max_length=255,null=True)
    chapter = models.CharField(max_length=255,null=True)
    deadline = models.DateTimeField(null=True, blank=True)
    completed = models.BooleanField(default=False)
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    def __str__(self):
        return f"Assignment - {self.subject} ({'Completed' if self.completed else 'Pending'})"

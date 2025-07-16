from django.db import models

# Create your models here.
from django.db import models
from authentication.models import User

class ChatMessage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.TextField()
    emotion = models.CharField(max_length=50)
    response = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'ChatMessage({self.user.username}, {self.emotion}, {self.timestamp})'

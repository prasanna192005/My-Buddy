from django.db import models
# models.py
from django.db import models
from authentication.models import User

class Subject(models.Model):
    name = models.CharField(max_length=100)

class Subdomain(models.Model):
    name = models.CharField(max_length=100)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)

class Chapter(models.Model):
    name = models.CharField(max_length=100)
    subdomain = models.ForeignKey(Subdomain, on_delete=models.CASCADE)

class Question(models.Model):
    OPTION_CHOICES = [
        ('option1', 'Option 1'),
        ('option2', 'Option 2'),
        ('option3', 'Option 3'),
        ('option4', 'Option 4'),
    ]
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE)
    text = models.TextField(blank=True, null=True)  # Text field for question
    text_image = models.ImageField(upload_to='questions/images/', blank=True, null=True)  # Image field for question text
    option1 = models.CharField(max_length=200, blank=True, null=True)
    option2 = models.CharField(max_length=200, blank=True, null=True)
    option3 = models.CharField(max_length=200, blank=True, null=True)
    option4 = models.CharField(max_length=200, blank=True, null=True)
    option1_image = models.ImageField(upload_to='questions/options/', blank=True, null=True)  # Image field for option1
    option2_image = models.ImageField(upload_to='questions/options/', blank=True, null=True)  # Image field for option2
    option3_image = models.ImageField(upload_to='questions/options/', blank=True, null=True)  # Image field for option3
    option4_image = models.ImageField(upload_to='questions/options/', blank=True, null=True)  # Image field for option4
    correct_option = models.CharField(max_length=50, choices=OPTION_CHOICES)
    marks = models.IntegerField()
    negative_marks = models.IntegerField()

class Test(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    duration = models.IntegerField()  # Duration in minutes
    questions = models.ManyToManyField(Question)
    score = models.IntegerField(null=True, blank=True)
    finished_at = models.DateTimeField(null=True, blank=True)

class Answer(models.Model):
    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_option = models.CharField(max_length=50)
    correct = models.BooleanField()

# Create your models here.

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _
from .managers import CustomUserManager

# Define User Model to Reflect Updated Requirements
class User(AbstractUser):
    # Use CustomUserManager for managing User creation
    objects = CustomUserManager()
    
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True, null=True, blank=True)
    # Identify if the user is a student or senior (mentor)
    is_student = models.BooleanField(default=False)
    is_senior = models.BooleanField(default=False)
    
    # Many-to-Many Relationship for Connections
    connections = models.ManyToManyField('self', blank=True, symmetrical=False, related_name='connected_users')
    profile_image = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    
    # Retain AbstractUser fields with custom `groups` and `user_permissions` fields
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',
        blank=True,
        help_text=_('The groups this user belongs to. A user will get all permissions granted to each of their groups.'),
        verbose_name=_('groups')
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_set',
        blank=True,
        help_text=_('Specific permissions for this user.'),
        verbose_name=_('user permissions')
    )
    
    # Specify custom USERNAME_FIELD and REQUIRED_FIELDS
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email

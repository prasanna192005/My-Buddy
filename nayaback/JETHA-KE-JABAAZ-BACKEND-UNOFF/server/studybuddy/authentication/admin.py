from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _
from .models import User



class UserAdmin(BaseUserAdmin):
    fieldsets = (
        (None, {'fields': ('email', 'password', 'is_senior')}),  # Add is_senior here
        (_('Personal info'), {'fields': ('username', 'friends')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2', 'is_senior'),  # Add is_senior here
        }),
    )
    list_display = ('id', 'email', 'username', 'is_staff', 'is_active', 'is_senior')  # Add is_senior here
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups', 'is_senior')  # Add is_senior here
    search_fields = ('email', 'username')
    ordering = ('email',)
    filter_horizontal = ('groups', 'user_permissions')

admin.site.register(User, UserAdmin)

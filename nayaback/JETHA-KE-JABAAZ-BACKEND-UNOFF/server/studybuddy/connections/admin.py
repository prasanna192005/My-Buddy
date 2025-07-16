from django.contrib import admin
from .models import FriendRequest, Message

class FriendRequestAdmin(admin.ModelAdmin):
    list_display = ('sender', 'receiver', 'status', 'created_at')
    search_fields = ('sender__username', 'receiver__username', 'status')
    list_filter = ('status', 'created_at')

class MessageAdmin(admin.ModelAdmin):
    list_display = ('sender', 'receiver', 'content', 'timestamp')
    search_fields = ('sender__username', 'receiver__username', 'content')
    list_filter = ('timestamp',)

admin.site.register(FriendRequest, FriendRequestAdmin)
admin.site.register(Message, MessageAdmin)

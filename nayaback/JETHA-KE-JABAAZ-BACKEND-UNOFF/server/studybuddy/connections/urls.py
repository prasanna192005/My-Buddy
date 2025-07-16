from django.urls import path
from connections import views


app_name = 'connections'

urlpatterns = [
    path('', views.connect, name='connect'),
    path('send_friend_request/<int:receiver_id>/', views.send_friend_request, name='send_friend_request'),
    path('friends/', views.friends, name='friends'),
    path('meeting/', views.videocall, name='meeting'),
    path('joinmeet/', views.joinmeet, name='joinmeet'),
    path('chat/<str:username>/', views.chat, name='chat'),
]

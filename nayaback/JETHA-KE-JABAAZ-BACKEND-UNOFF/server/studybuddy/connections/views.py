from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import FriendRequest, Message
from .serializers import FriendRequestSerializer, MessageSerializer
from authentication.models import User
import jwt
from django.conf import settings

# Helper function to get user from the token
def get_user_from_token(request):
    try:
        authorization_header = request.headers.get('Authorization')
        print(authorization_header)
        if not authorization_header:
            return None, {"error": "Authorization header missing"}, status.HTTP_401_UNAUTHORIZED
        
        token = authorization_header.split(' ')[1]
        decoded_token = jwt.decode(jwt=token, key=settings.SECRET_KEY, algorithms=['HS256'])
        
        user_id = decoded_token.get('id')
        if not user_id:
            return None, {"error": "Invalid token format"}, status.HTTP_403_FORBIDDEN
        
        user = get_object_or_404(User, id=user_id)
        return user, None, None
    except jwt.ExpiredSignatureError:
        return None, {"error": "Token has expired"}, status.HTTP_403_FORBIDDEN
    except jwt.DecodeError:
        return None, {"error": "Invalid token"}, status.HTTP_403_FORBIDDEN
    except Exception as e:
        return None, {"error": str(e)}, status.HTTP_403_FORBIDDEN

@api_view(['GET'])
def connect(request):
    user, error_response, status_code = get_user_from_token(request)
    print(user)
    user_profiles = User.objects.exclude(id=user.id)
    print(user_profiles)
    current_user_friends_ids = user.friends.values_list('id', flat=True)
    user_profiles = user_profiles.exclude(id__in=current_user_friends_ids)

    courses = request.GET.get('courses')
    search_query = request.GET.get('search')
    availability = request.GET.get('availability')

    if search_query:
        user_profiles = user_profiles.filter(username__icontains=search_query)
    
    if courses:
        user_profiles = user_profiles.filter(courses=courses)
    
    if availability:
        user_profiles = user_profiles.filter(availability=availability)

    current_user = user
    for profile in user_profiles:
        profile.has_pending_request = FriendRequest.objects.filter(sender=current_user, receiver=profile).exists()
        profile.is_friend = current_user.friends.filter(id=profile.id).exists()

    serialized_profiles = []
    for profile in user_profiles:
        serialized_profiles.append({
            'id': profile.id,
            'username': profile.username,
            'email': profile.email,
            'profile_image': profile.profile_image.url if profile.profile_image else None,
            'has_pending_request': profile.has_pending_request,
            'is_friend': profile.is_friend,
        })

    return Response({
        'students': serialized_profiles,
    })

@api_view(['POST'])
def send_friend_request(request, receiver_id):
    print("hi")
    print(receiver_id)
    user, error_response, status_code = get_user_from_token(request)
    print("token received")
    if error_response:
        return Response(error_response, status=status_code)
    print("hello")
    receiver = get_object_or_404(User, id=receiver_id)
    print("i passed")
    print(receiver.email)
    existing_request = FriendRequest.objects.filter(sender=user, receiver=receiver).exists()
    if not existing_request:
        FriendRequest.objects.create(sender=user, receiver=receiver)
        return Response({'message': 'Friend request sent successfully'}, status=status.HTTP_200_OK)
    else:
        return Response({'message': 'Friend request already sent'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def friends(request):
    user, error_response, status_code = get_user_from_token(request)
    if error_response:
        return Response(error_response, status=status_code)

    friends = user.friends.all()

    serialized_friends = []
    for friend in friends:
        serialized_friends.append({
            'id': friend.id,
            'username': friend.username,
            'email': friend.email,
            'profile_image': friend.profile_image.url if friend.profile_image else None,

        })

    return Response({
        'friends': serialized_friends,
    })

@api_view(['GET', 'POST'])
def chat(request, username):
    user, error_response, status_code = get_user_from_token(request)
    if error_response:
        return Response(error_response, status=status_code)

    recipient = get_object_or_404(User, username=username)
    
    if request.method == 'POST':
        content = request.data.get('content')
        if content:
            Message.objects.create(sender=user, receiver=recipient, content=content)
            return Response({'message': 'Message sent successfully'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Content cannot be empty'}, status=status.HTTP_400_BAD_REQUEST)
    
    else:
        messages_history = Message.objects.filter(sender=user, receiver=recipient) | Message.objects.filter(sender=recipient, receiver=user)
        serialized_messages = []
        for message in messages_history:
            serialized_messages.append({
                'id': message.id,
                'sender': message.sender.username,
                'receiver': message.receiver.username,
                'content': message.content,
                'timestamp': message.timestamp,
            })
        return Response({
            'recipient': recipient.username,
            'messages': serialized_messages,
        })

@api_view(['GET'])
def videocall(request):
    user, error_response, status_code = get_user_from_token(request)
    if error_response:
        return Response(error_response, status=status_code)

    username = user.username
    return Response({'username': username})

@api_view(['POST'])
def joinmeet(request):
    user, error_response, status_code = get_user_from_token(request)
    if error_response:
        return Response(error_response, status=status_code)

    if request.method == 'POST':
        rid = request.data.get('roomID')
        return Response({'roomID': rid})
    else:
        return Response({'error': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed
from .models import User
from .serializers import UserSerializer,ProfileImageSerializer
from connections.models import FriendRequest
from connections.serializers import FriendRequestSerializer
from .managers import CustomUserManager
import jwt,datetime
from django.contrib.auth import authenticate, login
from django.conf import settings

class SignupView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse({'message': 'Account created successfully'}, status=status.HTTP_201_CREATED)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        user = authenticate(request, email=email, password=password)

        if user and user.check_password(password):
            payload = {
                'id': user.id,
                'email': user.email, 
                'username': user.username,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=180),
                'iat': datetime.datetime.utcnow()
            }

            token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
            token = token.decode('utf-8') if isinstance(token, bytes) else token
            print(payload)
            print(token)
            response = JsonResponse({'status': True, 'message': 'Login successful', 'token': token})
            decoded_token = jwt.decode(jwt=token, key=settings.SECRET_KEY, algorithms=['HS256'])
            print(decoded_token)
            return response

        return JsonResponse({'status': False, 'error': 'Invalid email or password'}, status=401)

def get_user_from_token(request):
    try:
        authorization_header = request.headers.get('Authorization')
        if not authorization_header:
            return None, {"error": "Authorization header missing"}, status.HTTP_401_UNAUTHORIZED
        
        token = authorization_header.split(' ')[1]
        decoded_token = jwt.decode(jwt=token, key=settings.SECRET_KEY, algorithms=['HS256'])
        
        user_id = decoded_token.get('id')
        if not user_id:
            return None, {"error": "Invalid token format"}, status.HTTP_403_FORBIDDEN
        
        user = get_object_or_404(User, id=user_id)
        print(user)
        return user, None, None
    except jwt.ExpiredSignatureError:
        return None, {"error": "Token has expired"}, status.HTTP_403_FORBIDDEN
    except jwt.DecodeError:
        return None, {"error": "Invalid token"}, status.HTTP_403_FORBIDDEN
    except Exception as e:
        return None, {"error": str(e)}, status.HTTP_403_FORBIDDEN

@api_view(['GET'])
def profile_view_get(request):
    user, error_response, status_code = get_user_from_token(request)
    if error_response:
        return Response(error_response, status=status_code)
    
    serializer = UserSerializer(user)
    friend_requests = FriendRequest.objects.filter(receiver=user, status='pending')
    friend_requests_serializer = FriendRequestSerializer(friend_requests, many=True)
    print(friend_requests_serializer.data)
    return Response({
        'user': serializer.data,
        'friend_requests': friend_requests_serializer.data
    })

@api_view(['PUT'])
def profile_view_put(request):
    user, error_response, status_code = get_user_from_token(request)
    if error_response:
        return Response(error_response, status=status_code)
    
    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def profile_image_update_view(request):
    print("hi")
    
    user, error_response, status_code = get_user_from_token(request)
    if error_response:
        return Response(error_response, status=status_code)
    print(user)
    print(request.data)
    serializer = ProfileImageSerializer(user, data=request.data, partial=True)
    print("hi")
    if serializer.is_valid():
        print("enters")
        serializer.save()
        print(serializer.data['profile_image'])
        return Response({
            'message': 'Profile image updated successfully',
            'profile_image': serializer.data['profile_image']
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def profile_view_get2(request):
    user, error_response, status_code = get_user_from_token(request)
    if error_response:
        return Response(error_response, status=status_code)
    
    serializer = UserSerializer(user)
    profile_data = serializer.data
    profile_data['profile_image'] = user.profile_image.url if user.profile_image else None
    
    friend_requests = FriendRequest.objects.filter(receiver=user, status='pending')
    friend_requests_serializer = FriendRequestSerializer(friend_requests, many=True)
    
    return Response({
        'profile_image':  profile_data['profile_image']
    })


@api_view(['POST'])
def accept_friend_request_view(request, request_id):
    user, error_response, status_code = get_user_from_token(request)
    if error_response:
        return Response(error_response, status=status_code)
    
    friend_request = get_object_or_404(FriendRequest, id=request_id, receiver=user)
    friend_request.status = 'accepted'
    friend_request.save()
    friend_request.sender.friends.add(user)
    user.friends.add(friend_request.sender)
    return Response({'message': 'Friend request accepted successfully'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def decline_friend_request_view(request, request_id):
    user, error_response, status_code = get_user_from_token(request)
    if error_response:
        return Response(error_response, status=status_code)
    
    friend_request = get_object_or_404(FriendRequest, id=request_id, receiver=user)
    friend_request.status = 'declined'
    friend_request.save()
    return Response({'message': 'Friend request declined successfully'}, status=status.HTTP_200_OK)

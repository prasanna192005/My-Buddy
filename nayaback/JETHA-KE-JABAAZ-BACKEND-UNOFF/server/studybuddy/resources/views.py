from django.http import FileResponse, JsonResponse
from django.shortcuts import render, get_object_or_404
from .models import Resource
from .serializers import ResourceSerializer
from authentication.models import User
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import jwt

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
        return user, None, None
    except jwt.ExpiredSignatureError:
        return None, {"error": "Token has expired"}, status.HTTP_403_FORBIDDEN
    except jwt.DecodeError:
        return None, {"error": "Invalid token"}, status.HTTP_403_FORBIDDEN
    except Exception as e:
        return None, {"error": str(e)}, status.HTTP_403_FORBIDDEN

from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Resource
from .serializers import ResourceSerializer
from authentication.views import get_user_from_token


@api_view(['GET'])
def resource_list(request):
    user, error, error_status = get_user_from_token(request)
    if error:
        return Response(error, status=error_status)

    chapter_id = request.query_params.get('chapter')
    if not chapter_id:
        return Response({"error": "Chapter ID is required"}, status=status.HTTP_400_BAD_REQUEST)

    resources = Resource.objects.filter(chapter_id=chapter_id)
    serializer = ResourceSerializer(resources, many=True)
    return Response(serializer.data)

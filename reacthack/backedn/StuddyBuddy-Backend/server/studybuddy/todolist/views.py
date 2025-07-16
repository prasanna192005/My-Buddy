from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Selfstudy, Assignment
from .serializers import SelfstudySerializer, AssignmentSerializer
from datetime import datetime
from django.shortcuts import get_object_or_404
import jwt
from django.conf import settings
from authentication.models import User


# Helper function to get user from the token
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


@api_view(['GET'])
def index(request):
    return Response({"message": "Welcome to the TodoList API!"}, status=status.HTTP_200_OK)


@api_view(['GET'])
def assignments(request, year, month, day):
    user, error_response, status_code = get_user_from_token(request)
    if error_response:
        return Response(error_response, status=status_code)

    try:
        assignment_date = datetime(year, month, day).date()
    except ValueError:
        return Response({"error": "Invalid date"}, status=status.HTTP_400_BAD_REQUEST)
    
    assignments = Assignment.objects.filter(user=user, deadline__date=assignment_date)
    currentTime = datetime.now().replace(tzinfo=None)
    for a in assignments:
        if a.deadline is not None:
            a.is_before_due_date = a.deadline.replace(tzinfo=None) < currentTime
        else:
            a.is_before_due_date = False
    serializer = AssignmentSerializer(assignments, many=True)
    print(serializer.data)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def selfstudy(request, year, month, day):
    user, error_response, status_code = get_user_from_token(request)
    if error_response:
        return Response(error_response, status=status_code)

    try:
        selfstudy_date = datetime(year, month, day).date()
    except ValueError:
        return Response({"error": "Invalid date"}, status=status.HTTP_400_BAD_REQUEST)
    
    selfstudy = Selfstudy.objects.filter(user=user, deadline__date=selfstudy_date)
    currentTime = datetime.now().replace(tzinfo=None)
    for s in selfstudy:
        if s.deadline is not None:
            s.is_before_due_date = s.deadline.replace(tzinfo=None) < currentTime
        else:
            s.is_before_due_date = False
    serializer = SelfstudySerializer(selfstudy, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def create_assignments(request):
    user, error_response, status_code = get_user_from_token(request)
    if error_response:
        return Response(error_response, status=status_code)

    assignment_data = {
        "user": user.id,
        "subject": request.data.get('subject'),
        "chapter": request.data.get('chapter'),
        "deadline": request.data.get('deadline'),
    }
    
    serializer = AssignmentSerializer(data=assignment_data)
    if serializer.is_valid():
        serializer.save(user=user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def create_selfstudy(request):
    user, error_response, status_code = get_user_from_token(request)
    if error_response:
        return Response(error_response, status=status_code)

    selfstudy_data = {
        "user": user.id,
        "subject": request.data.get('subject'),
        "deadline": request.data.get('deadline'),
    }
    
    serializer = SelfstudySerializer(data=selfstudy_data)
    if serializer.is_valid():
        serializer.save(user=user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def complete_selfstudy(request, uuid):
    user, error_response, status_code = get_user_from_token(request)
    if error_response:
        return Response(error_response, status=status_code)

    selfstudy = get_object_or_404(Selfstudy, uuid=uuid, user=user)
    selfstudy.completed = True
    selfstudy.save()
    return Response({"message": "Self-study marked as completed"}, status=status.HTTP_200_OK)


@api_view(['POST'])
def complete_assignments(request, uuid):
    authorization_header2 = request.headers.get('Authorization')
    print(authorization_header2)
    user, error_response, status_code = get_user_from_token(request)
    if error_response:
        return Response(error_response, status=status_code)

    assignment = get_object_or_404(Assignment, uuid=uuid, user=user)
    assignment.completed = True
    assignment.save()
    return Response({"message": "Assignment marked as completed"}, status=status.HTTP_200_OK)


@api_view(['DELETE'])
def delete_selfstudy(request, uuid):
    user, error_response, status_code = get_user_from_token(request)
    if error_response:
        return Response(error_response, status=status_code)

    selfstudy = get_object_or_404(Selfstudy, uuid=uuid, user=user)
    selfstudy.delete()
    return Response({"message": "Self-study deleted"}, status=status.HTTP_200_OK)


@api_view(['DELETE'])
def delete_assignments(request, uuid):
    user, error_response, status_code = get_user_from_token(request)
    if error_response:
        return Response(error_response, status=status_code)

    assignment = get_object_or_404(Assignment, uuid=uuid, user=user)
    assignment.delete()
    return Response({"message": "Assignment deleted"}, status=status.HTTP_200_OK)

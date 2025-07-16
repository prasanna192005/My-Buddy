from django.shortcuts import render, get_object_or_404, redirect
from .models import Note, NoteImage, NoteDocument
from .forms import NoteForm, NoteShareForm
from authentication.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
import jwt
import logging

logger = logging.getLogger(__name__)

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
def note_list(request):
    user, error, status_code = get_user_from_token(request)
    if error:
        return Response(error, status=status_code)
    
    notes = Note.objects.filter(shared_with=user) | Note.objects.filter(created_by=user)
    notes = notes.distinct()
    note_list = []
    for note in notes:
        note_list.append({
            "id": note.id,
            "title": note.title,
            "content": note.content,
            "images": [img.image.url for img in note.images.all()],
            "documents": [doc.document.url for doc in note.documents.all()],
            "rich_text_content": note.rich_text_content,
            "drawing": note.drawing,
            "shared_with": [u.email for u in note.shared_with.all()]  # Include shared_with emails
        })
    
    return Response(note_list, status=status.HTTP_200_OK)

@api_view(['GET'])
def note_detail(request, pk):
    user, error, status_code = get_user_from_token(request)
    if error:
        return Response(error, status=status_code)
    
    note = get_object_or_404(Note, pk=pk)
    if user not in note.shared_with.all() and user != note.created_by:
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
    
    note_data = {
        "id": note.id,
        "title": note.title,
        "content": note.content,
        "images": [img.image.url for img in note.images.all()],
        "documents": [doc.document.url for doc in note.documents.all()],
        "rich_text_content": note.rich_text_content,
        "drawing": note.drawing,
        "shared_with": [u.username for u in note.shared_with.all()]
    }
    return Response(note_data, status=status.HTTP_200_OK)

@api_view(['POST'])
def note_create(request):
    user, error, status_code = get_user_from_token(request)
    if error:
        return Response(error, status=status_code)

    data = request.data.copy()
    shared_with_ids = data.get('shared_with', [])
    
    # Ensure shared_with_ids is a list and contains valid user IDs
    if isinstance(shared_with_ids, list):
        shared_with_users = User.objects.filter(id__in=shared_with_ids)
        if shared_with_ids and len(shared_with_ids) != len(shared_with_users):
            return Response({"error": "One or more user IDs in shared_with are invalid"}, status=status.HTTP_400_BAD_REQUEST)
    else:
        shared_with_users = []

    # Update data with valid shared_with users
    data['shared_with'] = [user.id for user in shared_with_users]

    form = NoteForm(data, user=user)

    if form.is_valid():
        note = form.save(commit=False)
        note.created_by = user
        note.save()
        
        # Add shared_with users
        if shared_with_users:
            note.shared_with.add(*shared_with_users)

        # Handle multiple images
        for image in request.FILES.getlist('images'):
            NoteImage.objects.create(note=note, image=image)

        # Handle multiple documents
        for document in request.FILES.getlist('documents'):
            NoteDocument.objects.create(note=note, document=document)

        return Response({
            "id": note.id,
            "title": note.title,
            "content": note.content,
            "images": [img.image.url for img in note.images.all()],
            "documents": [doc.document.url for doc in note.documents.all()],
            "rich_text_content": note.rich_text_content,
            "drawing": note.drawing,
            "shared_with": [u.email for u in note.shared_with.all()]
        }, status=status.HTTP_201_CREATED)
    else:
        return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def note_update(request, pk):
    user, error, status_code = get_user_from_token(request)
    if error:
        return Response(error, status=status_code)
    
    note = get_object_or_404(Note, pk=pk)
    if user != note.created_by:
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
    
    data = request.data.copy()
    new_shared_with = data.get('shared_with', [])
    
    # Update shared_with users
    note.shared_with.clear()
    note.shared_with.add(*User.objects.filter(pk__in=new_shared_with))
    
    form = NoteForm(data, instance=note, user=user)
    if form.is_valid():
        note = form.save(commit=False)
        note.last_modified_by = user
        note.save()
        
        # Handle multiple images (remove existing ones if necessary)
        if request.FILES.getlist('images'):
            note.images.all().delete()  # Remove existing images if new ones are provided
            for image in request.FILES.getlist('images'):
                NoteImage.objects.create(note=note, image=image)
        
        # Handle multiple documents (remove existing ones if necessary)
        if request.FILES.getlist('documents'):
            note.documents.all().delete()  # Remove existing documents if new ones are provided
            for document in request.FILES.getlist('documents'):
                NoteDocument.objects.create(note=note, document=document)
        
        return Response({
            "id": note.id,
            "title": note.title,
            "content": note.content,
            "images": [img.image.url for img in note.images.all()],
            "documents": [doc.document.url for doc in note.documents.all()],
            "rich_text_content": note.rich_text_content,
            "drawing": note.drawing,
            "shared_with": [u.email for u in note.shared_with.all()]
        }, status=status.HTTP_200_OK)
    else:
        return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def note_share(request, pk):
    user, error, status_code = get_user_from_token(request)
    if user is None:
        logger.error(f"User could not be retrieved from token: {error}")
        return Response({"error": "Authentication failed"}, status=status.HTTP_401_UNAUTHORIZED)
    note = get_object_or_404(Note, pk=pk)
    
    data = request.data.copy()
    user_ids = data.get('users', [])
    users = User.objects.filter(id__in=user_ids)
    
    if not users:
        return Response({"error": "No valid users found"}, status=status.HTTP_400_BAD_REQUEST)
    
    data['users'] = [user.pk for user in users] 
    
    if request.method == 'POST':
        form = NoteShareForm(data, note_instance=note, initial={'users': users})
        if form.is_valid():
            users_to_share_with = form.cleaned_data['users']
            note.shared_with.add(*users_to_share_with)
            return Response({"message": "Note shared successfully"}, status=status.HTTP_201_CREATED)
        else:
            logger.error(f"Form errors: {form.errors}")
            return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)

    return Response({"error": "Invalid request method"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['DELETE'])
def note_delete(request, pk):
    user, error, status_code = get_user_from_token(request)
    if error:
        return Response(error, status=status_code)
    
    note = get_object_or_404(Note, pk=pk)
    if user != note.created_by:
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
    
    note.delete()
    return Response({"message": "Note deleted successfully"}, status=status.HTTP_200_OK)

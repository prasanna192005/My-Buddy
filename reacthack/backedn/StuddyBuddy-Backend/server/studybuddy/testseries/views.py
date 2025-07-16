from django.shortcuts import render

# Create your views here.
# views.py
from django.shortcuts import render, get_object_or_404, redirect
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Subject, Subdomain, Chapter, Question, Test, Answer
from .serializers import SubjectSerializer, SubdomainSerializer, ChapterSerializer, QuestionSerializer, TestSerializer, AnswerSerializer,TestSerializer, TestDetailSerializer
from authentication.models import User
import jwt
import random
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.db.models import Count, Sum, Avg, F,Max
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Test, Answer, Question, Chapter, Subdomain
from .serializers import TestSerializer, QuestionSerializer, AnswerSerializer

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
def get_allchapters(request):
    chapters = Chapter.objects.all()
    serializer = ChapterSerializer(chapters, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_subjects(request):
    subjects = Subject.objects.all()
    serializer = SubjectSerializer(subjects, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_subdomains(request, subject_id):
    subdomains = Subdomain.objects.filter(subject_id=subject_id)
    serializer = SubdomainSerializer(subdomains, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_chapters(request, subdomain_id):
    chapters = Chapter.objects.filter(subdomain_id=subdomain_id)
    serializer = ChapterSerializer(chapters, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_questions(request, chapter_ids):
    chapter_ids = chapter_ids.split(',')
    questions = Question.objects.filter(chapter_id__in=chapter_ids)
    serializer = QuestionSerializer(questions, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def generate_test(request):
    user, error, status_code = get_user_from_token(request)
    if error:
        return Response(error, status=status_code)

    chapter_ids = request.data.get('chapter_ids')
    duration = request.data.get('duration')
    
    question_count = 0
    if duration == 15:
        question_count = 5
    elif duration == 30:
        question_count = 10
    elif duration == 60:
        question_count = 20

    questions = Question.objects.filter(chapter_id__in=chapter_ids).order_by('?')[:question_count]

    test = Test.objects.create(user=user, duration=duration)
    test.questions.set(questions)
    test.save()

    serializer = TestSerializer(test)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def submit_test(request, test_id):
    user, error, status_code = get_user_from_token(request)
    if error:
        return Response(error, status=status_code)

    test = Test.objects.get(id=test_id)
    answers = request.data.get('answers')

    total_score = 0

    for answer in answers:
        question_id = answer.get('question_id')
        selected_option = answer.get('selected_option')
        question = Question.objects.get(id=question_id)
        correct = (selected_option == question.correct_option)

        if correct:
            total_score += question.marks
        else:
            total_score -= question.negative_marks

        Answer.objects.create(test=test, question=question, selected_option=selected_option, correct=correct)

    test.score = total_score
    test.save()

    return Response({"score": total_score}, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_test_result(request, test_id):
    user, error, status_code = get_user_from_token(request)
    if error:
        return Response(error, status=status_code)

    test = Test.objects.get(id=test_id)
    answers = Answer.objects.filter(test=test)

    test_serializer = TestSerializer(test)
    answer_serializer = AnswerSerializer(answers, many=True)

    return Response({"test": test_serializer.data, "answers": answer_serializer.data}, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_previous_tests(request):
    user, error, status_code = get_user_from_token(request)
    if error:
        return Response(error, status=status_code)
    
    tests = Test.objects.filter(user=user)
    serializer = TestSerializer(tests, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_test_detail(request, test_id):
    user, error, status_code = get_user_from_token(request)
    if error:
        return Response(error, status=status_code)
    
    test = get_object_or_404(Test, id=test_id, user=user)
    serializer = TestDetailSerializer(test)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def share_test(request, pk):
    user, error, status_code = get_user_from_token(request)
    if error:
        return Response(error, status=status_code)

    test = get_object_or_404(Test, pk=pk)
    if test.user != user:
        return Response({"error": "You do not have permission to share this test."}, status=status.HTTP_403_FORBIDDEN)

    user_ids = request.data.get('user_ids', [])
    users = User.objects.filter(id__in=user_ids)
    test.shared_with.add(*users)

    return Response({"message": "Test shared successfully"}, status=status.HTTP_200_OK)

@api_view(['GET'])
def shared_tests(request):
    user, error, status_code = get_user_from_token(request)
    if error:
        return Response(error, status=status_code)

    tests = Test.objects.filter(shared_with=user)
    serializer = TestSerializer(tests, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_test_questions(request, test_id):
    user, error, status_code = get_user_from_token(request)
    if error:
        return Response(error, status=status_code)

    test = get_object_or_404(Test, id=test_id, user=user)
    questions = test.questions.all()
    
    serializer = QuestionSerializer(questions, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
def performance_summary(request):
    user, error, status_code = get_user_from_token(request)
    if error:
        return Response(error, status=status_code)
    
    tests = Test.objects.filter(user=user)
    total_tests = tests.count()
    total_score = tests.aggregate(total_score=Sum('score'))['total_score'] or 0
    average_score = tests.aggregate(average_score=Avg('score'))['average_score'] or 0
    max_score = tests.aggregate(max_score=Max('score'))['max_score'] or 0

    data = {
        'total_tests': total_tests,
        'total_score': total_score,
        'average_score': average_score,
        'max_score': max_score,
    }
    return Response(data, status=status.HTTP_200_OK)

@api_view(['GET'])
def weak_areas_analysis(request):
    user, error, status_code = get_user_from_token(request)
    if error:
        return Response(error, status=status_code)
    
    wrong_answers = Answer.objects.filter(test__user=user, correct=False)
    weak_areas = wrong_answers.values('question__chapter__subdomain__name').annotate(wrong_count=Count('id')).order_by('-wrong_count')

    data = [{'topic': item['question__chapter__subdomain__name'], 'wrong_count': item['wrong_count']} for item in weak_areas]
    return Response(data, status=status.HTTP_200_OK)

@api_view(['GET'])
def mistakes_analysis(request):
    user, error, status_code = get_user_from_token(request)
    if error:
        return Response(error, status=status_code)
    
    wrong_answers = Answer.objects.filter(test__user=user, correct=False)
    mistakes = wrong_answers.values('question__id', 'question__text', 'selected_option', 'question__correct_option').annotate(mistake_count=Count('id')).order_by('-mistake_count')

    data = [{'question_id': item['question__id'], 'question_text': item['question__text'], 'selected_option': item['selected_option'], 'correct_option': item['question__correct_option'], 'mistake_count': item['mistake_count']} for item in mistakes]
    return Response(data, status=status.HTTP_200_OK)

@api_view(['GET'])
def time_management_analysis(request):
    user, error, status_code = get_user_from_token(request)
    if error:
        return Response(error, status=status_code)
    
    tests = Test.objects.filter(user=user)
    test_times = tests.values('id', 'duration', 'created_at', 'finished_at')
    
    data = []
    for test_time in test_times:
        duration = test_time['duration']
        created_at = test_time['created_at']
        finished_at = test_time['finished_at']
        
        if finished_at and created_at:
            actual_time = (finished_at - created_at).total_seconds() / 60  # in minutes
            time_difference = actual_time - duration
            data.append({
                'test_id': test_time['id'],
                'duration': duration,
                'actual_time': actual_time,
                'time_difference': time_difference
            })
    
    return Response(data, status=status.HTTP_200_OK)

from django.db.models import Count, Sum, F, FloatField, ExpressionWrapper
from django.db.models import Case, When, IntegerField, Value, Sum
@api_view(['GET'])
def topic_analysis(request):
    user, error, status_code = get_user_from_token(request)
    if error:
        return Response(error, status=status_code)
    
    # Fetch the tests taken by the user
    tests = Test.objects.filter(user=user)
    
    # Aggregate data by subdomain (topic)
    topic_performance = Answer.objects.filter(test__in=tests).values(
        'question__chapter__subdomain__name'
    ).annotate(
        total_questions=Count('id'),
        correct_answers=Sum(
            Case(
                When(correct=True, then=1),
                default=0,
                output_field=IntegerField()
            )
        ),
    ).order_by('-total_questions')

    # Calculate accuracy for each topic
    data = [{
        'topic': item['question__chapter__subdomain__name'],
        'total_questions': item['total_questions'],
        'correct_answers': item['correct_answers'],
        'accuracy': (item['correct_answers'] / item['total_questions']) * 100 if item['total_questions'] > 0 else 0
    } for item in topic_performance]
    
    return Response(data, status=status.HTTP_200_OK)

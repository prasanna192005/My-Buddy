from rest_framework import serializers
from .models import Subject, Subdomain, Chapter, Question, Test, Answer

class SubjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subject
        fields = ['id', 'name']

class SubdomainSerializer(serializers.ModelSerializer):
    subject = SubjectSerializer()

    class Meta:
        model = Subdomain
        fields = ['id', 'name', 'subject']

class ChapterSerializer(serializers.ModelSerializer):
    subdomain = SubdomainSerializer()

    class Meta:
        model = Chapter
        fields = ['id', 'name', 'subdomain']

class QuestionSerializer(serializers.ModelSerializer):
    chapter = ChapterSerializer()

    class Meta:
        model = Question
        fields = [
            'id', 'text', 'text_image', 'option1', 'option2', 'option3', 'option4',
            'option1_image', 'option2_image', 'option3_image', 'option4_image',
            'correct_option', 'marks', 'negative_marks', 'chapter'
        ]

class AnswerSerializer(serializers.ModelSerializer):
    question = QuestionSerializer()

    class Meta:
        model = Answer
        fields = ['id', 'test', 'question', 'selected_option', 'correct']

class TestSerializer(serializers.ModelSerializer):
    answers = serializers.SerializerMethodField()

    class Meta:
        model = Test
        fields = ['id', 'user', 'name', 'created_at', 'duration', 'answers', 'score']

    def get_answers(self, obj):
        answers = Answer.objects.filter(test=obj)
        return AnswerSerializer(answers, many=True).data

class TestDetailSerializer(serializers.ModelSerializer):
    answers = serializers.SerializerMethodField()

    class Meta:
        model = Test
        fields = ['id', 'user', 'name', 'created_at', 'duration', 'score', 'answers']

    def get_answers(self, obj):
        answers = Answer.objects.filter(test=obj)
        return AnswerSerializer(answers, many=True).data

class MistakeAnalysisSerializer(serializers.ModelSerializer):
    question = serializers.CharField(source='question.text')
    chapter = serializers.CharField(source='question.chapter.name')
    topic = serializers.CharField(source='question.chapter.subdomain.name')

    class Meta:
        model = Answer
        fields = ['question_id', 'question', 'chapter', 'topic', 'wrong_count']

class TopicAnalysisSerializer(serializers.Serializer):
    topic = serializers.CharField()
    total_questions = serializers.IntegerField()
    correct_answers = serializers.IntegerField()
    accuracy = serializers.FloatField()

class TimeManagementAnalysisSerializer(serializers.Serializer):
    duration = serializers.IntegerField()
    total_questions = serializers.IntegerField()
    correct_answers = serializers.IntegerField()

class PerformanceSummarySerializer(serializers.Serializer):
    total_tests = serializers.IntegerField()
    total_score = serializers.IntegerField()
    average_score = serializers.FloatField()
    max_score = serializers.IntegerField()

class WeakAreasAnalysisSerializer(serializers.Serializer):
    topic = serializers.CharField()
    wrong_count = serializers.IntegerField()

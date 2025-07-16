from rest_framework import serializers
from .models import Selfstudy, Assignment

class SelfstudySerializer(serializers.ModelSerializer):
    class Meta:
        model = Selfstudy
        fields = '__all__'

class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = '__all__'

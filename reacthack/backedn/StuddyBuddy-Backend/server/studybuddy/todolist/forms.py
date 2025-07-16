from django import forms
from .models import Selfstudy,Assignment

class selfstudyform(forms.ModelForm):
    class Meta:
        model = Selfstudy
        fields = '__all__'
        
        widgets = {
            "name": forms.TextInput(attrs={'placeholder': 'Enter name here...'}),  
        }

class assignmentsform(forms.ModelForm):
    class Meta:
        model = Assignment
        fields = '__all__'
        
        widgets = {
            "name": forms.TextInput(attrs={'placeholder': 'Enter name here...'}),  
        }
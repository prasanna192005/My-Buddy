from django import forms
from .models import Note, NoteImage, NoteDocument
from authentication.models import User
from django.db.models import Q

class NoteForm(forms.ModelForm):
    shared_with = forms.ModelMultipleChoiceField(
        queryset=User.objects.all(),
        required=False,
        widget=forms.CheckboxSelectMultiple
    )
    drawing = forms.CharField(
        widget=forms.HiddenInput(),  # Use hidden input for base64 drawing data
        required=False
    )

    class Meta:
        model = Note
        fields = ['title', 'content', 'rich_text_content', 'drawing', 'shared_with']

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user', None)
        super(NoteForm, self).__init__(*args, **kwargs)


class NoteImageForm(forms.ModelForm):
    class Meta:
        model = NoteImage
        fields = ['image']

class NoteDocumentForm(forms.ModelForm):
    class Meta:
        model = NoteDocument
        fields = ['document']

class NoteShareForm(forms.ModelForm):
    users = forms.ModelMultipleChoiceField(
        queryset=User.objects.all(),
        widget=forms.SelectMultiple
    )

    def __init__(self, *args, **kwargs):
        note_instance = kwargs.pop('note_instance', None)
        super(NoteShareForm, self).__init__(*args, **kwargs)
        if note_instance:
            self.fields['users'].queryset = User.objects.exclude(pk__in=note_instance.shared_with.all())
        else:
            self.fields['users'].queryset = User.objects.none()  # Empty queryset if note_instance is not provided

    def clean_users(self):
        users = self.cleaned_data.get('users')
        if not users:
            raise forms.ValidationError("Users field is required.")
        return users

    class Meta:
        model = Note
        fields = ['users']

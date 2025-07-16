from django.contrib import admin
from .models import Subject, Subdomain, Chapter, Question, Test, Answer

class QuestionAdmin(admin.ModelAdmin):
    list_display = (
        'id', 'text', 'chapter', 'option1', 'option2', 'option3', 'option4',
        'correct_option', 'marks', 'negative_marks', 'text_image',
        'option1_image', 'option2_image', 'option3_image', 'option4_image'
    )
    list_filter = ('chapter__subdomain', 'chapter')
    search_fields = ('text', 'option1', 'option2', 'option3', 'option4')

class TestAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'name', 'created_at', 'duration', 'score')
    list_filter = ('user', 'created_at', 'duration',)
    search_fields = ('name',)
    filter_horizontal = ('questions',) 

class AnswerAdmin(admin.ModelAdmin):
    list_display = ('id', 'test', 'question', 'selected_option', 'correct')
    list_filter = ('test', 'question__chapter__subdomain', 'question__chapter',)
    search_fields = ('selected_option',)

class SubjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

class SubdomainAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'subject')
    list_filter = ('subject',)
    search_fields = ('name',)

class ChapterAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'subdomain')
    list_filter = ('subdomain',)
    search_fields = ('name',)

admin.site.register(Subject, SubjectAdmin)
admin.site.register(Subdomain, SubdomainAdmin)
admin.site.register(Chapter, ChapterAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(Test, TestAdmin)
admin.site.register(Answer, AnswerAdmin)

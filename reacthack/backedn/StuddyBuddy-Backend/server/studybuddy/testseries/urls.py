# urls.py
from django.urls import path
from . import views

urlpatterns = [
    path('subjects/', views.get_subjects, name='get_subjects'),
    path('all_chapters/', views.get_allchapters, name='get_chapters'),
    path('subdomains/<int:subject_id>/', views.get_subdomains, name='get_subdomains'),
    path('chapters/<int:subdomain_id>/', views.get_chapters, name='get_chapters'),
    path('questions/<str:chapter_ids>/', views.get_questions, name='get_questions'),
    path('generate_test/', views.generate_test, name='generate_test'),
    path('submit_test/<int:test_id>/', views.submit_test, name='submit_test'),
    path('get_test_result/<int:test_id>/', views.get_test_result, name='get_test_result'),
    path('get_previous_tests/', views.get_previous_tests, name='get_previous_tests'),
    path('get_test_detail/<int:test_id>/', views.get_test_detail, name='get_test_detail'),
    path('share/<uuid:pk>/', views.share_test, name="share_test"),  # New endpoint
    path('shared/', views.shared_tests, name="shared_tests"),
    path('get_test_questions/<int:test_id>/', views.get_test_questions, name='get_test_questions'),  # New endpoint
    path('analysis/performance/', views.performance_summary, name='performance_summary'),
    path('analysis/weak_areas/', views.weak_areas_analysis, name='weak_areas_analysis'),
    path('analysis/mistakes/', views.mistakes_analysis, name='mistakes_analysis'),
    path('analysis/time_management/', views.time_management_analysis, name='time_management_analysis'),
    path('analysis/topic/', views.topic_analysis, name='topic_analysis'),  # Added Topic Analysis

]

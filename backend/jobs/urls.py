from django.urls import path
from .views import JobListCreateAPIView, ApplyJobView, UserApplicationsView, JobDetailAPIView,manage_profile

urlpatterns = [
    path('', JobListCreateAPIView.as_view(), name='job-list'),
    
    path('<int:pk>/', JobDetailAPIView.as_view(), name='job-detail'), 
    path('<int:job_id>/apply/', ApplyJobView.as_view(), name='apply-job'),
    path('my-applications/', UserApplicationsView.as_view(), name='user-apps'),
    path('profile/manage/', manage_profile, name='manage_profile'),
]
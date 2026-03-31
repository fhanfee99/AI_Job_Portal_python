from django.db import models
from django.conf import settings
from django.contrib.auth.models import User

class User(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    skills = models.TextField(blank=True, null=True)
    role = models.CharField(max_length=100, blank=True, null=True)
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}'s Profile"
    
class Job(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    skills = models.TextField() 
    location = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    job_type = models.CharField(max_length=100, default='Full-time')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} at {self.company}"

class Application(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    applicant = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    resume = models.FileField(upload_to='resumes/', null=True, blank=True)
    match_percentage = models.IntegerField(default=0) 
    applied_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.applicant.username}"
    
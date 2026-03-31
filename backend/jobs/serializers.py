from rest_framework import serializers
from .models import Job, Application
from django.contrib.auth.models import User
from .models import User

from django.contrib.auth import get_user_model


User = get_user_model()

class UserProfileSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name', allow_blank=True)
    last_name = serializers.CharField(source='user.last_name', allow_blank=True)
    email = serializers.EmailField(source='user.email')

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'skills', 'role', 'resume']

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        user = instance.user

        for attr, value in user_data.items():
            setattr(user, attr, value)
        user.save()

        instance.skills = validated_data.get('skills', instance.skills)
        instance.role = validated_data.get('role', instance.role)
        instance.resume = validated_data.get('resume', instance.resume)
        instance.save()

        return instance
    
class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'

class ApplicationSerializer(serializers.ModelSerializer):
    job_details = JobSerializer(source='job', read_only=True)

    class Meta:
        model = Application
        fields = ['id', 'job', 'job_details', 'match_percentage', 'resume', 'applied_at']


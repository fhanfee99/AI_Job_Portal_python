from django.db.models import Q
from django.shortcuts import get_object_or_404 
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
import PyPDF2 
from .models import Job, Application
from .serializers import JobSerializer, ApplicationSerializer
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import User
from .serializers import UserProfileSerializer
from rest_framework.parsers import MultiPartParser, FormParser 

@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def manage_profile(request):
    profile, created = User.objects.get_or_create(user=request.user)

    if request.method == 'GET':
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data)

    if request.method == 'PUT':
        serializer = UserProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
class JobDetailAPIView(APIView):
    def get(self, request, pk):
        try:
            job = Job.objects.get(pk=pk)
            serializer = JobSerializer(job)
            return Response(serializer.data)
        except Job.DoesNotExist:
            return Response({"error": "Job not found"}, status=status.HTTP_404_NOT_FOUND)
        
class JobListCreateAPIView(generics.ListCreateAPIView):
    serializer_class = JobSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Job.objects.all().order_by('-created_at')
        
        search_query = self.request.query_params.get('search', None)
        location_query = self.request.query_params.get('location', None)

        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) | 
                Q(skills__icontains=search_query) |
                Q(company__icontains=search_query)
            )
        
        if location_query:
            queryset = queryset.filter(location__icontains=location_query)
            
        return queryset

class ApplyJobView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, job_id):
        job = get_object_or_404(Job, id=job_id)
            
        # Check if already applied (Using 'applicant' as per your model)
        if Application.objects.filter(applicant=request.user, job=job).exists():
            return Response({"error": "You have already applied for this job."}, status=status.HTTP_400_BAD_REQUEST)
        
        resume_file = request.FILES.get('resume')
        if not resume_file:
            return Response({"error": "Resume file is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # IMPORTANT: Reset file pointer to the beginning
            resume_file.seek(0)
            
            pdf_reader = PyPDF2.PdfReader(resume_file)
            resume_text = ""
            for page in pdf_reader.pages:
                text = page.extract_text()
                if text:
                    resume_text += text.lower()

            # Logic for skill matching
            job_skills = [s.strip().lower() for s in job.skills.split(',')] if job.skills else []
            matches = [skill for skill in job_skills if skill in resume_text]
            
            match_percentage = 0
            if job_skills:
                match_percentage = int((len(matches) / len(job_skills)) * 100)

            # Saving the application
            Application.objects.create(
                job=job, 
                applicant=request.user, # Make sure your model field is named 'applicant'
                resume=resume_file,
                match_percentage=match_percentage
            )

            return Response({
                "message": "Application successful!",
                "match_score": f"{match_percentage}%",
                "matched_skills": matches
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            # Printing error for you in terminal
            print(f"PDF Error: {str(e)}")
            return Response({"error": f"Failed to process PDF: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        
class UserApplicationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Sirf logged-in user ki applications nikalna
        applications = Application.objects.filter(applicant=request.user).order_by('-applied_at')
        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data)
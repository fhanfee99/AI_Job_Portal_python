from django.contrib import admin
from .models import Job, Application, User 
from django.contrib import admin

# @admin.register(User)
# class UserProfileAdmin(admin.ModelAdmin):
#     list_display = ('user', 'get_first_name', 'get_last_name', 'role', 'resume')
#     search_fields = ('user__username', 'user__first_name', 'user__last_name')

#     def get_first_name(self, obj):
#         return obj.user.first_name
#     get_first_name.short_description = 'First Name'

#     def get_last_name(self, obj):
#         return obj.user.last_name
#     get_last_name.short_description = 'Last Name'

@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'location')
    search_fields = ('title', 'company')

@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('id', 'get_email', 'get_job', 'match_percentage', 'applied_at')
    
    def get_email(self, obj):
        return obj.applicant.email
    get_email.short_description = 'User Email'

    def get_job(self, obj):
        return obj.job.title
    get_job.short_description = 'Job Title'
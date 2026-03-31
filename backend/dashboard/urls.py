from django.urls import path
from .views import home_view # This is what triggered the error

urlpatterns = [
    path('', home_view, name='home'),
]